import { ProviderProfile } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createProvider=async(data: Omit<ProviderProfile, 'id' | 'createdAt' | 'userId'>, userId: string)=>{

    console.log(data)

      const result = await prisma.providerProfile.create({
        data: {
            ...data,
            userId: userId
        }
    })
    return result;
   

}

export const providerService={
    createProvider
}