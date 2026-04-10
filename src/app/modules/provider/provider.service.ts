import z from "zod";
import { ProviderProfile } from "../../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { formatZodIssues } from "../../utils/handleZodError";
import { CreateproviderData, UpdateproviderData } from "./provider.validation";
import { ICreateproviderData } from "./provider.interface";
import AppError from "../../errorHelper/AppError";
import status from "http-status";

const createProvider = async (data: ICreateproviderData, userId: string) => {
  const existinguser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existinguser) {
    throw new AppError(404, "user not found");
  }
  const result = await prisma.providerProfile.create({
    data: {
      restaurantName: data.restaurantName,
      address: data.address,
      description: data.description,
      image: data.image,
      userId: userId,
    },
  });
  return result;
};

const getAllProvider = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      user: true,
      meals:{
        include:{
          reviews:true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  let i: number = 0;
  const userid = providers.map((p) => p.userId);
  console.log(userid.length, "userid");
  for (i = 0; i < userid.length; i++) {
    console.log(userid.length, "leng");
    console.log(i, "idss");
    const ratings = await prisma.review.aggregate({
      where: {
        rating: {
          gt: 0,
        },
        parentId: null,
        meal: {
          provider: {
            userId: userid[i],
          },
        },
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
    console.log(i, "id");
    console.log(userid[i], "ratingdata");

    const providerWithRating = providers.map((provider) => {
      // const providerMeals = ratings._avg.rating;

      const totalReview = ratings._count.rating;

      // const totalRating = providerMeals.reduce(
      //   (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
      //   0,
      // );

      const averageRating = ratings._avg.rating;

      return {
        ...provider,
        rating: {
          totalReview,
          averageRating,
        },
      };
    });

    return providerWithRating;
  }
};

const getProviderWithMeals = async (id: string) => {
  const existprovider = await prisma.providerProfile.findUnique({
    where: { id },
  });
  if (!existprovider) {
    throw new AppError(status.NOT_FOUND, "provider not found for this id");
  }
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          reviews: true,
        },
      },
      meals: {
        include: { category: true ,reviews:true},
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!provider) {
    throw new AppError(status.NOT_FOUND, "provider not found for this id");
  }
  const userid = provider.userId;
  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0,
      },
      parentId: null,
      meal: {
        provider: {
          userId: userid,
        },
      },
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  const totalReview = ratings.reduce((sum, r) => sum + r._count.rating, 0);

  const totalRating = ratings.reduce(
    (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
    0,
  );

  const averageRating = totalReview > 0 ? totalRating / totalReview : 0;

  return {
    result: {
      ...provider,
      totalReview: totalReview || 0,
      averageRating: Number(averageRating.toFixed(1)) || 0,
    },
  };
};

const UpateProviderProfile = async (
  data: Partial<ProviderProfile>,
  userid: string,
) => {
  if (!data) {
    throw new AppError(status.BAD_REQUEST, "no data provided for update");
  }
  const providerinfo = await prisma.user.findUnique({
    where: { id: userid },
    include: {
      provider: true,
    },
  });
  if (!providerinfo) {
    throw new AppError(status.NOT_FOUND, "user not found");
  }
  const result = await prisma.providerProfile.update({
    where: { id: providerinfo.provider!.id },
    data: {
      restaurantName: data.restaurantName,
      image: data.image,
      description: data.description,
      address: data.address,
    },
  });

  return result;
};

export const providerService = {
  createProvider,
  getAllProvider,
  getProviderWithMeals,
  UpateProviderProfile,
};
