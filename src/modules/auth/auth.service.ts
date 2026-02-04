import { prisma } from "../../lib/prisma"

const getCurentUser=async(id:string)=>{
     return await prisma.user.findUniqueOrThrow({
        where:{
            id
        },
        include:{
            provider:true,
        }
    })
}
export const authService={
    getCurentUser
}