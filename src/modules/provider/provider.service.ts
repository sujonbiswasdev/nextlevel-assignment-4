import z from "zod";
import { ProviderProfile } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { formatZodIssues } from "../../utils/handleZodError";

const createProvider = async (data: unknown, userId: string) => {

  const providerData = z.object({
    restaurantName: z.string(),
    address: z.string(),
    description: z.string().optional(),
    image: z.string().optional()
  }).strict();

  const parseData = providerData.safeParse(data)
  if (!parseData.data) {
    return {
      success: false,
      message: `your provided data is invalid`,
      data: formatZodIssues(parseData.error)
    }
  }
  await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  const result = await prisma.providerProfile.create({
    data: {
      restaurantName: parseData.data.restaurantName,
      address: parseData.data.address,
      description: parseData.data.description,
      image: parseData.data.image,
      userId: userId
    }
  })
  return {
    success: true,
    message: `your provider profile has beed created`,
    result
  };


}

const getAllProvider = async () => {
  const result = await prisma.providerProfile.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
  return {
    success: result ? true : false,
    message: result ? `provider data has been retrieved successfully` : `provider data retrieve fail`,
    result
  }
}
const getProviderWithMeals = async (id: string) => {
  const existprovider = await prisma.providerProfile.findUniqueOrThrow({ where: { id } })
  if (existprovider.id !== id) {
    throw new Error("provider profile not found")
  }
  const provider = await prisma.providerProfile.findUniqueOrThrow({
    where: { id },
    include: {
      user: {
        include:{
          reviews:true
        }
      },
      meals: {
        include: { category: true },
        orderBy: { createdAt: "desc" }
      },
    }
  });

  const totalReview = provider.user.reviews.length;

  const averageRating = totalReview
    ? provider.user.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReview
    : 0;
  return {
    success: true,
    message: "retrieve provider data with meals successfully",
    result: {
      ...provider,
      totalReview:totalReview ||0,
      averageRating: Number(averageRating.toFixed(1)) || 0
    }
  };
}


const UpateProviderProfile = async (data: Partial<ProviderProfile>, userid: string) => {
  const providerData = z.object({
    restaurantName: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    image: z.string().min(8).optional(),
  }).strict()

  const parseData = providerData.safeParse(data)

  if (!parseData.success) {
    return {
      success: false,
      message: "your provider profile updated failed",
      data: formatZodIssues(parseData.error)
    }
  }


  if (!data) {
    throw new Error("your data isn't found,please provide a data")
  }
  const providerinfo = await prisma.user.findUniqueOrThrow({
    where: { id: userid },
    include: {
      provider: true
    }
  })
  if (!providerinfo) {
    throw new Error('provider data not found')
  }
  const result = await prisma.providerProfile.update({
    where: { id: providerinfo.provider!.id },
    data: {
      restaurantName: parseData.data.restaurantName,
      image: parseData.data.image,
      description: parseData.data.description,
      address: parseData.data.address,
    }
  })

  return {
    success: true,
    message: "your provider profile has been updated successfully",
    result
  }


}


const getOwnProviderProfile = async (userId: string) => {
  const result = await prisma.providerProfile.findUniqueOrThrow({
    where: {
      id: userId
    },
  })
  return {
    success: true,
    message: ` retrieved own provider profile successfully`,
    result
  }
}
export const providerService = {
  createProvider,
  getAllProvider,
  getProviderWithMeals,
  UpateProviderProfile,
  getOwnProviderProfile
}