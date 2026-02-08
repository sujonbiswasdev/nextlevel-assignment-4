import z from "zod";
import { ProviderProfile } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { formatZodIssues } from "../../utils/handleZodError";

const createProvider = async (data: unknown, userId: string) => {

    const providerData = z.object({
        restaurantName: z.string(),
        address:z.string(),
        description:z.string().optional(),
        image:z.string().optional()
    }).strict();

    const parseData=providerData.safeParse(data)
    if(!parseData.data){
        return {
            sucess:false,
            message:`your provided data is invalid`,
            data:formatZodIssues(parseData.error)
        }
    }
    await prisma.user.findUniqueOrThrow({ where: { id: userId } })
    const result = await prisma.providerProfile.create({
        data: {
            restaurantName:parseData.data.restaurantName,
            address:parseData.data.address,
            description:parseData.data.description,
            image:parseData.data.image,
            userId: userId
        }
    })
    return {
        sucess:false,
        message:result?`your provider profile has beed created`:`your provider profile create failed`,
        result
    };


}

const getAllProvider = async () => {
    const result = await prisma.providerProfile.findMany()
    return {
        sucess:false,
        message:result?`provider data has been retrieved sucessfully`:`provider data retrieve fail`,
        result
    }
}
const getProviderWithMeals = async (id: string) => {
    const existprovider = await prisma.providerProfile.findUniqueOrThrow({ where: { id } })
    if (existprovider.id !== id) {
        throw new Error("provider profile not found")
    }
    const result = await prisma.providerProfile.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            meals: {
                include: {
                    category: true
                }
            }
        }
    })
    return {
        sucess:false,
        message:result?`retrieve provider data with meals sucessfully`:`retrieve provider data with meals fail`,
        result
    }
}

export const providerService = {
    createProvider,
    getAllProvider,
    getProviderWithMeals
}