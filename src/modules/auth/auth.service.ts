import { prisma } from "../../lib/prisma"

const getCurentUser=async(id:string)=>{
     return await prisma.user.findUniqueOrThrow({
        where:{
            id
        }
    })
}
export const authService={
    getCurentUser
}