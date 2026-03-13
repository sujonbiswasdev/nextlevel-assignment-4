import { serialize } from "cookie";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelper/AppError";

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

const signup = async (data: {
  name: string;
  email: string;
  password: string;
  image?: string;
  bgimage: string;
  phone: string;
  role: string;
  restaurantName: string;
  address: string;
  description: string;
}) => {
  const result = await auth.api.signUpEmail({
    body: {
      name: data.name, // required
      email: data.email, // required
      password: data.password, // required
      image: data.image,
      bgimage: data.bgimage,
      role: data.role as "Provider" | "Customer",
    },
  });
  try {
    let provider;
    if (data.role == "Provider") {
      provider = await prisma.$transaction(async (tx) => {
        await tx.providerProfile.create({
          data: {
            userId: result.user.id,
            restaurantName: data.restaurantName,
            address: data.address,
            description: data.description,
          },
        });
      });
      return provider
    }

    const accesstoken = tokenUtils.getAccessToken({
      userId: result.user.id,
      role: result.user.role,
      name: result.user.name,
      email: result.user.email,
      status: result.user.status,
      emailVerified: result.user.emailVerified,
    });

    const refreshtoken = tokenUtils.getRefreshToken({
      userId: result.user.id,
      role: result.user.role,
      name: result.user.name,
      email: result.user.email,
      status: result.user.status,
      emailVerified: result.user.emailVerified,
    });

    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    return {
      ...result.user,
      token: result.token,
      accesstoken,
      refreshtoken,
      provider,
    };
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: result.user.id,
      },
    });
    throw new AppError(400, "user created fail");
  }
};

const signin = async (
  data: { email: string; password: string },
  cookies: any,
  headers: any,
) => {
  const existingUesr = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  const result = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
  });
  if (existingUesr?.status == "suspend") {
    await auth.api.signOut({
      headers: {
        cookie: headers.cookie,
      },
    });
    throw new Error(
      "Your account has been suspended. Please contact support for assistance.",
    );
  }
  return result;
};
export const authService = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
};
