import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { ISignupData } from "./auth.interface";

const getCurrentUser = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      provider: true,
    },
  });
};

const signoutUser = async (id: string, sessionToken : string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await auth.api.signOut({
    headers:new Headers({
        Authorization : `Bearer ${sessionToken}`
    })
  });

  return {
    success: true,
    message: `current user signout successfully`,
    result,
  };
};

const signup = async (data: ISignupData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existingUser) {
    throw new AppError(status.CONFLICT,"Email already in use");
  }
  const result = await auth.api.signUpEmail({
    body: {
      name: data.name, // required
      email: data.email, // required
      password: data.password, // required
      image: data.image,
      phone:data.phone,
      bgimage: data.bgimage,
      role: data.role as "Provider" | "Customer",
    },
  });
    if (data.role === "Provider") {
        await prisma.providerProfile.create({
          data: {
            userId: result.user.id,
            restaurantName: data.restaurantName,
            address: data.address,
            description: data.description,
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

const signin = async (
  data: { email: string; password: string },
) => {
  const existingUesr = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if(!existingUesr){
    throw new AppError(404,"user not found")
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

const getNewToken = async (refreshToken : string, sessionToken : string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where : {
            token : sessionToken,
        },
        include : {
            user : true,
        }
    })

    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!)


    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
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

    const {token} = await prisma.session.update({
        where : {
            token : sessionToken
        },
        data : {
            token : sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })

    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
        sessionToken : token,
    }

}

const verifyEmail = async (email: string, otp: string) => {
  // const result = await auth.api.verifyEmailOTP({
  //   body: {
  //     email,
  //     otp,
  //   },
  // });

  // if (result.status && !result.user.emailVerified) {
  //   await prisma.user.update({
  //     where: {
  //       email,
  //     },
  //     data: {
  //       emailVerified: true,
  //     },
  //   });
  // }
};
export const authService = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
  getNewToken,
  verifyEmail
};
