import { EnumRoleFilter } from './../../../generated/prisma/commonInputTypes';
import { error } from "node:console"
import { Role, Status, User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { UserWhereInput } from "../../../generated/prisma/models"

const GetAllUsers = async (data: { email?: string, emailVerified?: boolean, role?: string, status?: string, isActive?: boolean }) => {
  const andCondition: UserWhereInput[] = []
  if (typeof data.email == 'string') {
    andCondition.push({
      email: data.email
    })
  }
  if (typeof data.emailVerified == 'boolean') {
    andCondition.push({ emailVerified: data.emailVerified })
  }
  if(typeof data.role=='string'){
    andCondition.push({role:data.role as Role})
  }
  if(typeof data.status=='string'){
     andCondition.push({status:data.status as Status})
  }

  if(typeof data.isActive=='boolean'){
     andCondition.push({isActive:data.isActive})
  }

  const result = await prisma.user.findMany({
    where: {
      AND: andCondition

    },
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  const totalusers = await prisma.user.count({
    where: {
      AND: andCondition
    }
  });
  return {
    data: result,
    totalusers
  }
}

const UpdateUser = async (id: string, role: string, data: Partial<User>) => {
  const { status } = data
  const curentUser = await prisma.user.findUniqueOrThrow({
    where: { id }
  })
  if (role !== "Admin") {
    throw new Error("status change only Admin")
  }
  if (curentUser.status == status) {
    throw new Error("user status already up to date")
  }
  const statusValue = ["activate", "suspend"]
  if (!statusValue.includes(status as string)) {
    throw new Error("please provide a valid status")
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
    return result

  }


}

const getCustomerprofile = async (id: string, userid: string, role: string) => {
  if (id !== userid) {
    throw new Error("you are not authorized")
  }

  console.log(id, userid)
  return await prisma.user.findUniqueOrThrow({
    where: { id }
  })

}

const UpdateCustomerProfile = async (id: string, role: string, data: Partial<User>, userid: string) => {
  if (id !== userid) {
    throw new Error("you are not authorized")
  }
  const { name, email, image, phone } = data
  await prisma.user.findUniqueOrThrow({
    where: { id }
  })
  if (role !== "Customer") {
    throw new Error("Customer profile update must be role Customer")
  }
  if (data.isActive || data.role || data.status) {
    throw new Error("you cann't change ,you can change(name,email,image,phone)")
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      name,
      email,
      image,
      phone
    }
  })
  return result

}


const DeleteCustomerProfile = async (id: string, userid: string, role: string) => {
  if (id !== userid) {
    throw new Error("you are not authorized")
  }
  if (role !== 'Customer') {
    throw new Error("Customer profile delete role must be Customer")
  }

  return await prisma.user.delete({
    where: { id: userid }
  })

}

const userRoleChange = async (id: string, userId: string, data: Partial<User>) => {
  const { role } = data
  const curentUser = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

  if (curentUser.id !== userId) {
    throw new Error("you are isn't admin login user")
  }
  if (curentUser.role == role) {
    throw new Error("user role already up to date")
  }


  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role
    }
  })
  return result




}

export const UserService = { GetAllUsers, UpdateUser, getCustomerprofile, UpdateCustomerProfile, DeleteCustomerProfile, userRoleChange }