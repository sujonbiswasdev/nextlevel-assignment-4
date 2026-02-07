import { prisma } from "../../lib/prisma"

const getCurrentUser=async(id:string)=>{
     return await prisma.user.findUniqueOrThrow({
        where:{
            id
        }
    })
}
export const authService={
    getCurrentUser
}