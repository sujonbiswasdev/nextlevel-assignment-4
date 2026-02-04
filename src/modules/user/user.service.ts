import { prisma } from "../../lib/prisma"

const GetAllUsers=async()=>{
  return  await prisma.user.findMany({
    include:{
        provider:true
    }
  })

}

export const UserService={GetAllUsers}