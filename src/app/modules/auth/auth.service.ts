import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { ISignupData } from "./auth.interface";

const getCurrentUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: { provider: true },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (!user.isActive) {
    throw new AppError(status.UNAUTHORIZED, "User account is not active");
  }
  return user;
};

const signoutUser = async (sessionToken: string) => {
  await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  return {
    success: true,
    message: `current user signout successfully`,
  };
};

const signup = async (data: ISignupData) => {
  const {
    name,
    email,
    password,
    image,
    phone,
    role,
    restaurantName,
    address,
    description,
  } = data;
  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!image) {
    throw new AppError(
      status.BAD_REQUEST,
      "Image is required to register a user.",
    );
  }
  if (userExist) {
    throw new AppError(status.CONFLICT, "Email already in use");
  }

  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      image,
      phone,
      role: role as "Provider" | "Customer",
    },
  });
  if (data.role === "Provider") {
    await prisma.providerProfile.create({
      data: {
        userId: result.user.id,
        restaurantName,
        address,
        description,
      },
    });
  }

  await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
  });
  return {
    ...result.user,
    token: result.token,
  };
};

const signin = async (data: { email: string; password: string }) => {
  const existingUesr = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!existingUesr) {
    throw new AppError(404, "user not found");
  }

  const result = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
  });
  if (result.user.status === "suspend") {
    throw new AppError(status.UNAUTHORIZED, "User is suspend");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified,
  });
  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
  );

  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};

const verifyEmail = async (email: string, otp: string) => {
  const data = await auth.api.verifyEmailOTP({
    body: {
      email: email,
      otp: otp,
    },
  });

  if (data.status && !data.user.emailVerified) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
};

const sendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (user.status==='suspend') {
    throw new AppError(status.NOT_FOUND, "your are suspend");
  }
  if (user.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email already verified");
  }

  // Send OTP using external auth API
  const result =await auth.api.sendVerificationOTP({
    body: {
      email: email, // required
      type: "email-verification",
  }, 
  });

  return result;
};

const forgetPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (isUserExist.status=='suspend') {
    throw new AppError(status.NOT_FOUND, "your account is suspend");
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};


const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  console.log(email,otp,newPassword,'passwrd')
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }


  if (isUserExist.status=='suspend') {
    throw new AppError(status.NOT_FOUND, "your account is suspend");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id,
    },
  });
};



export const authService = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
  getNewToken,
  verifyEmail,
  sendOtp,
  forgetPassword,
  resetPassword
};
