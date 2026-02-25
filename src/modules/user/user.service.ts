import { Account, Role, Status, User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { UserWhereInput } from "../../../generated/prisma/models"
import z, { email } from 'zod';
import { formatZodIssues } from '../../utils/handleZodError';

const GetAllUsers = async (data: { email?: string, emailVerified?: boolean, role?: string, status?: string }, isactivequery: boolean,page?: number, limit?: number | undefined, skip?: number, sortBy?: string | undefined, sortOrder?: string | undefined) => {
  const andCondition: UserWhereInput[] = []
  if (typeof data.email == 'string') {
    andCondition.push({
      email: data.email
    })
  }
  if (typeof data.emailVerified == 'boolean') {
    andCondition.push({ emailVerified: data.emailVerified })
  }
  if (typeof data.role == 'string') {
    andCondition.push({ role: data.role as Role })
  }
  if (typeof data.status == 'string') {
    andCondition.push({ status: data.status as Status })
  }

  if (typeof isactivequery == 'boolean') {
    andCondition.push({ isActive: isactivequery })
  }

  const result = await prisma.user.findMany({
    take:limit,
    skip,
    where: {
      AND: andCondition

    },
    include: {
      provider: true,
    },
    orderBy: {
      [sortBy!]: sortOrder
    }
  })
  const totalusers = await prisma.user.count({
    where: {
      AND: andCondition
    }
  });
  return {
    success:  true ,
    message: "retrieve all user has been successfully" ,
    data: result,
    pagination: {
            totalusers,
            page,
            limit,
            totalpage: Math.ceil(totalusers / limit!)
        },
  }
}

const UpdateUserStatus = async (id: string, data: Partial<User>) => {
  const { status } = data
  const statusValue = ["activate", "suspend"]
  if (!statusValue.includes(status as string)) {
    throw new Error("please provide a valid status")
  }
  const curentUser = await prisma.user.findUniqueOrThrow({
    where: { id }
  })
  if (curentUser.status == status) {
    throw new Error("user status already up to date")
  }
  if (status == 'activate') {
    const result = await prisma.user.update({
      where: {
        id
      },
      data: {
        status: status,
        isActive: true
      }
    })
    return result
  }
  if (status == 'suspend') {

    const result = await prisma.user.update({
      where: {
        id
      },
      data: {
        status,
        isActive: false
      }
    })
    return {
      success: true,
      message: result.isActive ? "your user status has been changed successfully" : "your user status has been changed fail",
      result
    }

  }
}
const getUserprofile = async (id: string) => {

  const result = await prisma.user.findUniqueOrThrow({
    where: { id }
  })
  return {
    success:  true ,
    message:  `you user profile has been retrieved successfully`,
    result
  }

}
const UpateUserProfile = async (data: Partial<User & Account>, userid: string) => {

  const usersData = z.object({
    name: z.string().optional(),
    image: z.string().optional(),
    bgimage:z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(8).optional(),
    phone: z.string().min(10).max(15).optional(),
    isActive:z.boolean().optional()
  }).strict()

  const parseData = usersData.safeParse(data)

  if (!parseData.success) {
    return {
      success: false,
      message: "your profile updated failed",
      data: formatZodIssues(parseData.error)
    }
  }

  
  if (!data) {
    throw new Error("your data isn't found,please provide a information")
  }
  const userinfo = await prisma.user.findUniqueOrThrow({
    where: { id: userid },
    include: {
      accounts: true
    }
  })
  if (!userinfo) {
    throw new Error('user data not found')
  }
  const isCustomer = userinfo.role == 'Customer'
  const result = await prisma.user.update({
    where: { id: userid },
    data: {
      name: parseData.data.name,
      image: parseData.data.image,
      bgimage:parseData.data.bgimage,
      phone: parseData.data.phone,
      isActive:parseData.data.isActive,
      ...isCustomer ? {} : { email: parseData.data.email },
      accounts: {
        updateMany: {
          where: { userId: userid },
          data: {
            password: parseData.data.password
          }
        }
      }
    }
  })

  return {
    success:true,
    message:"your profile has been updated successfully",
    result
  }


}
const ChangeUserRole = async (id: string, data: Partial<User>) => {
  const roleData = z.object({
    role: z.enum(['Admin', 'Customer', 'Provider'])
  }).strict()

  const parseData = roleData.safeParse(data)

  if (!parseData.success) {
    return {
      success: false,
      message: "your profile updated failed",
      data: formatZodIssues(parseData.error)
    }
  }
  const userData = await prisma.user.findUniqueOrThrow({ where: { id } })
  if (!userData) {
    throw new Error("your user data didn't found")
  }
  if (userData.role == parseData.data.role) {
    throw new Error(`your status(${parseData.data.role}) already up to date`)
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role: parseData.data.role
    }
  })
  return {
    success: true,
    message:  `your user role (${parseData.data.role}) has been changed successfully`,
    result
  }
}


const DeleteUserProfile = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({ where: { id } })
  if (!userData) {
    throw new Error("your user data didn't found")
  }
  const result = await prisma.user.delete({
    where: { id }
  })
  return {
    success:  true ,
    message: "user account delete successfully",
    result
  }

}

const OwnProfileDelete = async (userid: string) => {
  console.log(userid)
  const userData = await prisma.user.findUniqueOrThrow({ where: { id: userid } })
  if (!userData) {
    throw new Error("your user data not found")
  }
  if (userData.id !== userid) {
    throw new Error("your are not authorized")
  }
  const result = await prisma.user.delete({
    where: { id: userid }
  })
  return {
    success:  true ,
    message:  "user own account delete successfully",
    result
  }

}
export const UserService = { GetAllUsers, UpdateUserStatus, getUserprofile, UpateUserProfile, DeleteUserProfile, ChangeUserRole, OwnProfileDelete }