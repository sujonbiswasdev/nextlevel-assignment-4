import { ProviderProfile } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createProvider=async(data: Omit<ProviderProfile, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, userId: string)=>{
    const existingUser = await prisma.user.findUniqueOrThrow({where:{id:userId}})
    if(existingUser.role!=='Provider' || existingUser.id!==`${userId}`){
        throw new Error("you are not correct user")
    }
      const result = await prisma.providerProfile.create({
        data: {
            ...data,
            userId: userId
        }
    })
    return result;
   

}

const getAllProvider=async()=>{
    const result = await prisma.providerProfile.findMany()
    return result
}
const getProviderWithMeals=async(id:string)=>{
    const existprovider=await prisma.providerProfile.findUniqueOrThrow({where:{id}})
    if(existprovider.id!==id){
        throw new Error("provider profile not found")
    }
    const result = await prisma.providerProfile.findUniqueOrThrow({
        where:{
            id
        },
        include:{
            meals:{
                include:{
                    category:true
                }
            }
        }
    })
    return result
}

export const providerService={
    createProvider,
    getAllProvider,
    getProviderWithMeals
}