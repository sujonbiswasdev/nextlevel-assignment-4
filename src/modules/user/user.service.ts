import { EnumRoleFilter } from './../../../generated/prisma/commonInputTypes';
import { error } from "node:console"
import { Role, Status, User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { UserWhereInput } from "../../../generated/prisma/models"
import z from 'zod';
import { formatZodIssues } from '../../utils/handleZodError';

const GetAllUsers = async (data: { email?: string, emailVerified?: boolean, role?: string, status?: string }, isactivequery: boolean) => {
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
    where: {
      AND: andCondition

    },
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  const totalusers = await prisma.user.count({
    where: {
      AND: andCondition
    }
  });
  return {
    sucess:true,
    message:result?"retrieve all user has been sucessfully":"retrieve all user failed",
    data: result,
    totalusers
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
      success:true,
      message:result.isActive?"your user status has been changed sucessfully":"your user status has been changed fail",
      result}

  }
}
const getUserprofile = async (id: string) => {

  const result = await prisma.user.findUniqueOrThrow({
    where: { id }
  })
  return {
    sucess:true,
    message:result?`you user profile has been retrieved sucessfully`:`you user profile didn't retrieved`,
    result
  }

}
const UpdateCustomerProfile = async (id: string, data: any) => {

  const userData = z.object({
    name: z.string().optional(),
    image: z.string().optional(),
    phone: z.string().min(10).max(15).optional()

  }).strict()

  const parseData = userData.safeParse(data)

  if (!parseData.success) {
     return {
      sucess:false,
       message:"your profile has been updated failed",
      data:formatZodIssues(parseData.error)
     }
  }
  
  if (!data) {
    throw new Error("your data isn't found,please provide a information")
  }
  await prisma.user.findUniqueOrThrow({
    where: { id }
  })
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      name:parseData.data.name,
      image:parseData.data.image,
      phone:parseData.data.phone
    }
  })
  return {
    sucess:true,
    message:"your profile has been update sucessfully",
    result
  }

}
const ChangeUserRole = async (id: string, userId: string, data: Partial<User>) => {
  const { role } = data
 const userData= await prisma.user.findUniqueOrThrow({ where: { id } })
 if(!userData){
  throw new Error("your user data didn't found")
 }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role
    }
  })
  return {
    sucess:true,
    message:result?`your user role has been changed sucessfully`:`your user role(${role}) changed fail`,
    result
  }
}
const DeleteUserProfile = async (id: string) => {
  const userData =await prisma.user.findUniqueOrThrow({ where: { id } })
  if(!userData){
    throw new Error("your user data didn't found")
  }
  const result = await prisma.user.delete({
    where: { id }
  })
  return {
    sucess:true,
    message:result?"user account delete sucessfully":`"user account delete failed"`,
    result
  }

}

const OwnProfileDelete = async (userid: string) => {
  const userData =await prisma.user.findUniqueOrThrow({ where: { id:userid } })
  if(!userData){
    throw new Error("your user data didn't found")
  }
  if(userData.id!==userid){
    throw new Error("your are not authorized")
  }
  const result = await prisma.user.delete({
    where: { id:userid }
  })
  return {
    sucess:true,
    message:result?"user own account delete sucessfully":"user own account delete faild",
    result
  }

}
export const UserService = { GetAllUsers, UpdateUserStatus, getUserprofile, UpdateCustomerProfile, DeleteUserProfile, ChangeUserRole,OwnProfileDelete }