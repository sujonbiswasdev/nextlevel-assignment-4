import { Account, Role, Status, User } from "../../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserWhereInput } from "../../../../generated/prisma/models";
import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { UserQueryOptions } from "./user.interface";

const GetAllUsers = async (
 data:UserQueryOptions
) => {
  const andCondition: UserWhereInput[] = [];
  if (typeof data.data?.email == "string") {
    andCondition.push({
      email: data.data?.email,
    });
  }

  if (typeof data.data?.name == "string") {
    andCondition.push({
      name: data.data?.name,
    });
  }
  if (typeof data.data?.phone == "string") {
    andCondition.push({
      email: data.data?.phone,
    });
  }
  if (typeof data.data?.emailVerified == "boolean") {
    andCondition.push({ emailVerified: data.data?.emailVerified });
  }
  if (typeof data.data?.role == "string") {
    andCondition.push({ role: data.data?.role as Role });
  }
  if (typeof data.data?.status == "string") {
    andCondition.push({ status: data.data?.status as Status });
  }

  if (typeof data.isactivequery == "boolean") {
    andCondition.push({ isActive: data.isactivequery });
  }

  const result = await prisma.user.findMany({
    take: data.limit,
    skip:data.skip,
    where: {
      AND: andCondition,
    },
    include: {
      provider: true,
      accounts:true
    },
    orderBy: {
      [data.sortBy!]: data.sortOrder,
    },
  });
  const totalusers = await prisma.user.count({
    where: {
      AND: andCondition,
    },
  });
  return {
    data: result,
    pagination: {
      total:totalusers,
      page:data.page,
      limit:data.limit,
      totalpage: Math.ceil(totalusers / data.limit!) || 1,
    },
  };
};

const getUserprofile = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if(!user){
    throw new AppError(status.NOT_FOUND, "user not found for this id")

  }
  if (user.role !== "Provider") {
    return user
  }

  const providerProfile = await prisma.providerProfile.findUnique({
    where: {
      userId: id,
    },
    include:{
      user:{
        include:{
          reviews:{
            where:{
              rating:{
                gt:0
              },
              parentId:null
            }
          }
        }
      }
    }
  });
    const totalReview = providerProfile?.user.reviews.length;

    const averageRating = totalReview
      ? providerProfile.user.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReview
      : 0;
  return {
      ...user,
      providerProfile,
      totalReview: totalReview || 0,
      averageRating: Number(averageRating.toFixed(1)) || 0
  
  };
};

const UpateUserProfile = async (
  data: Partial<User & Account>,
  email: string,
) => {

  if (!data) {
    throw new AppError(400,"your data isn't found,please provide a information");
  }
  const userinfo = await prisma.user.findUnique({
    where: { email:email },
    include: {
      accounts: true,
    },
  });
  if (!userinfo) {
    throw new AppError(404,"user data not found");
  }
  const isCustomer = userinfo.role == "Customer";
  const result = await prisma.user.update({
    where: { email },
    data: {
      name: data.name,
      image: data.image,
      bgimage: data.bgimage,
      phone: data.phone,
      isActive: data.isActive,
      ...(isCustomer ? {} : { email: data.email }),
      accounts: {
        updateMany: {
          where: { userId: userinfo.id },
          data: {
            password: data.password,
          },
        },
      },
    },
  });

  return result
};
const UpdateUser = async (id: string, data: Partial<User>) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError(404,"your user data didn't found");
  }
  if (userData.role == data.role) {
    throw new AppError(409,`your status(${data.role}) already up to date`);
  }
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: data.role,
      status: data.status,
      email: data.email,
    },
    
  });
  return result
};

const DeleteUserProfile = async (id: string) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError(404,"your user data didn't found");
  }
  const result = await prisma.user.delete({
    where: { id },
  });
  return result
};

const OwnProfileDelete = async (userid: string) => {
  console.log(userid);
  const userData = await prisma.user.findUnique({
    where: { id: userid },
  });
  if (!userData) {
    throw new AppError(404,"your user data not found");
  }
  const result = await prisma.user.delete({
    where: { id: userid },
  });
  return result;
};
export const UserService = {
  GetAllUsers,
  UpdateUser,
  getUserprofile,
  UpateUserProfile,
  DeleteUserProfile,
  OwnProfileDelete,
};
