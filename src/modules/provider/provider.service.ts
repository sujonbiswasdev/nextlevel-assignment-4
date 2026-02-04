import { ProviderProfile } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createProvider=async(data: Omit<ProviderProfile, 'id' | 'createdAt' | 'userId'>, userId: string)=>{
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
    const result = await prisma.providerProfile.findUniqueOrThrow({
        where:{
            id
        },
        include:{
            meals:true
        }
    })
    return result
}

export const providerService={
    createProvider,
    getAllProvider,
    getProviderWithMeals
}