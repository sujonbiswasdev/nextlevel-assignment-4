import { Result } from '../../../../generated/prisma/internal/prismaNamespace';
import { prisma } from "../../lib/prisma";
import { MealWhereInput } from "../../../../generated/prisma/models";
import { DietaryPreference } from "../../../../generated/prisma/enums";
import { Meal } from "../../../../generated/prisma/client";
import {
  ICreateMealsData,
  IMealQueryRequest,
  IUpdateMealsData,
  MealQuery,
} from "./meal.interface";
import AppError from "../../errorHelper/AppError";
import status from "http-status";

const createMeal = async (data: ICreateMealsData, email: string) => {
  const providerid = await prisma.user.findUnique({
    where: { email},
    include: { provider: { select: { id: true } } },
  });
  if (!providerid) {
    throw new AppError(status.NOT_FOUND, "provider not found");
  }

  const categoryCheck = await prisma.category.findUnique({
    where: {
      name: data.category_name,
    },
  });
  if (!categoryCheck) {
    throw new AppError(status.NOT_FOUND, "category not found");
  }
  const result = await prisma.meal.create({
    data: {
      ...data,
      providerId: providerid!.provider!.id,
    },
  });

  return result;
};

const getAllmeals = async (
  data: Record<string, any>,
  isAvailable?: boolean,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?:string | undefined
) => {
  const andConditions: MealWhereInput[] | MealWhereInput = [];
  if (data) {
    const orConditions: any[] = [];

    if (search) {
      orConditions.push(
        {
          meals_name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      );
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine,
        },
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive",
        },
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable: isAvailable });
  }

  if (data.price) {
    andConditions.push({
      price: {
        gte: 0,
        lte: Number(data.price),
      },
    });
  }
  if (data.dietaryPreference?.length) {
    const dietaryList = data.dietaryPreference.split(
      ",",
    ) as DietaryPreference[];
    andConditions.push({
      OR: dietaryList.map((item) => ({ dietaryPreference: item })),
    });
  }
  const meals = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
      status: "APPROVED",
    },
    include: {
      provider: true,
      reviews: {
        
        where: {
          parentId: null,
          rating: { gt: 0 },
          status: "APPROVED",
        },
        include: {
          customer: true,
        },
      },
    },
    orderBy: {
      [sortBy!]: sortOrder,
    },
  });

  const mealsWithStats = meals.map((meal) => {
    const totalReviews = meal.reviews.length;
    const avgRating =
      totalReviews > 0
        ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return { ...meal, avgRating, totalReviews };
  });
  const total = await prisma.meal.count({ where: { AND: andConditions } });

  return {
    data: mealsWithStats,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit!) || 1,
    },
  };
};

const getSinglemeals = async (id: string) => {
  const result = await prisma.meal.findUniqueOrThrow({
    where: {
      id,
      status: "APPROVED",
    },
    include: {
      category: true,
      provider: {
        include: {
          user: true,
        },
      },
      reviews: {
        where: {
          parentId: null,
        },

        include: {
          replies: {
            include: {
              customer:true,
              replies: true,
            },
          },
          customer: {
            include: {
              reviews: true,
            },
          },
        },
      },
    },
  });

  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0,
      },
      parentId: null,
      meal: {
        provider: {
          userId: result.provider.userId,
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
    ...result,
    providerRating: {
      totalReview: totalReview??0,
      averageRating: averageRating ?? 0,
    },
  };
};

const UpdateMeals = async (data: IUpdateMealsData, mealid: string) => {
  const { category_name } = data as any;
  const existmeal = await prisma.meal.findUnique({
    where: { id: mealid },
  });
  if (!existmeal) {
    throw new AppError(status.NOT_FOUND, "meals not found");
  }
  if (existmeal.category_name === category_name) {
    throw new AppError(status.CONFLICT, "category_name is already up to date.");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid,
    },
    data: {
      ...data,
    },
  });

  return result;
};

const DeleteMeals = async (mealid: string) => {
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid,
    },
  });
  if (!existmeal) {
    throw new AppError(status.NOT_FOUND, "meal not found");
  }
  const result = await prisma.meal.delete({
    where: {
      id: mealid,
    },
  });
  console.log(result,'result')

  return result;
};

const getOwnMeals = async (userid: string) => {
  const meals = await prisma.meal.findMany({
    where: {
      provider: {
        userId: userid,
      },
    },
    include: {
      category: true,
      provider: true,
      reviews: {
        where: {
          parentId: null,
        },
        include: {
          replies: {
            include: {
              replies: true,
            },
          },
        },
      },
    },
  });
  const mealIds = meals.map((meal) => meal.id);
  const reviewStats = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      mealId: { in: mealIds },
      parentId: null,
      rating: { gt: 0 },
      status: "APPROVED",
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });
  const mealsWithStats = meals.map((meal) => {
    const stats = reviewStats.find((s) => s.mealId === meal.id);
    return {
      ...meal,
      averageRating: stats?._avg?.rating || 0, // Default to 0
      totalReview: stats?._count?.rating || 0, // Default to 0
    };
  });

  return mealsWithStats;
};

const updateStatus = async (data: any, mealid: string) => {
  const { status } = data;
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid,
    },
  });
  if (existmeal?.status === status) {
    throw new AppError(409, "meal status already up to date");
  }
  if (existmeal?.id !== mealid) {
    throw new AppError(404, "mealid is invalid,please check your mealid");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid,
    },
    data: {
      status,
    },
  });
  return result;
};
const getAllMealsForAdmin=async(data: MealQuery,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,)=>{
      const andConditions: MealWhereInput[] | MealWhereInput = [];

     if (data) {
    const orConditions: any[] = [];
    if (data.meals_name) {
      orConditions.push({
        meals_name: {
          contains: data.meals_name,
          mode: "insensitive",
        },
      });
    }
    if (data.description) {
      orConditions.push({
        description: {
          contains: data.description,
          mode: "insensitive",
        },
      });
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine,
        },
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive",
        },
      });
    }
  }
  const result = await prisma.meal.findMany({
    take: limit,
    skip,
     where: {
      AND: andConditions,
      status: "APPROVED",
    },
    orderBy: {
      [sortBy!]: sortOrder,
    },
  });
  return result


}

export const mealService = {
  createMeal,
  UpdateMeals,
  DeleteMeals,
  getAllmeals,
  getSinglemeals,
  getOwnMeals,
  updateStatus,
  getAllMealsForAdmin
};
