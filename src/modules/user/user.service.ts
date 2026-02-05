import { error } from "node:console"
import { User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const GetAllUsers = async () => {
  return await prisma.user.findMany({
    include: {
      provider: true
    }
  })

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
    throw new Error("please check your status")
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

const getCustomerprofile = async (id:string,userid: string, role: string) => {
  if(id!==userid){
    throw new Error("you are not authorized")
  }
  if (role !== 'Customer') {
    throw new Error("get cusomer account must be role Customer")
  }
  return await prisma.user.findUniqueOrThrow({
    where: { id }
  })

}

const UpdateCustomerProfile = async (id: string, role: string, data: Partial<User>,userid:string) => {
   if(id!==userid){
    throw new Error("you are not authorized")
  }
  const {name,email,image,phone}=data
  await prisma.user.findUniqueOrThrow({
    where: { id }
  })
  if (role !== "Customer") {
    throw new Error("Customer profile update must be role Customer")
  }
  if(data.isActive || data.role || data.status){
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


const DeleteCustomerProfile = async (id:string,userid:string,role:string) => {
   if(id!==userid){
    throw new Error("you are not authorized")
  }
  if(role!=='Customer'){
    throw new Error("Customer profile delete role must be Customer")
  }

  return await prisma.user.delete({
    where:{id:userid}
  })

}

export const UserService = { GetAllUsers, UpdateUser, getCustomerprofile,UpdateCustomerProfile,DeleteCustomerProfile }