import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interface/requestUser.interface";

/**
 * 🔹 Main Entry Function (Role Based)
 */
const getDashboardStatsData = async (user: IRequestUser) => {
  const existuser=await prisma.user.findUnique({
    where:{
        email:user.email
    }
  })
  if (!existuser) {
    throw new AppError(status.UNAUTHORIZED, "User does not exist or is unauthorized");
  }
  let statsData;

  switch (user.role) {
    case "Admin":
      statsData = getAdminStats(existuser.id);
      break;

    case "Provider":
      statsData = getProviderStats(existuser.id);
      break;

    default:
      throw new AppError(status.BAD_REQUEST, "Invalid user role");
  }

  return statsData;
};

/**
 * 🔹 ADMIN STATS
 */
const getAdminStats = async (adminId: string) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: { id: adminId },
  });

  if (existuser.id !== adminId) {
    throw new Error("you are unauthorize");
  }

  return {
    userStats: await getUserStatsInternal(),
    mealStats: await getMealStatsInternal(),
    orderStats: await getOrderStatsInternal(),
    revenueStats: await getRevenueStatsInternal(),
    reviewStats: await getReviewStatsInternal(),
    categoryStats: await getCategoryStatsInternal(),
  };
};

/**
 * 🔹 PROVIDER STATS
 */
const getProviderStats = async (userId: string) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      provider: { select: { id: true } },
    },
  });

  if (existuser.id !== userId) {
    throw new Error("you are unauthorize");
  }

  return {
    revenueStats: await getProviderRevenueInternal(existuser.provider!.id),
    mealStats: await getProviderMealInternal(existuser.provider!.id),
    orderStats: await getProviderOrderInternal(existuser.provider!.id),
  };
};



const getUserStatsInternal = async () => {
  return prisma.$transaction(async (tx: any) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const [
      totalUsers,
      totalSuspendUser,
      totalActivateUser,
      totalAdmin,
      totalCustomer,
      totalprovider,
      todaystats,
      oneMonthago,
      totalemailvarified,
      totalactiveusers,
      totalunactiveuser,
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({ where: { status: "suspend" } }),
      tx.user.count({ where: { status: "activate" } }),
      tx.user.count({ where: { role: "Admin" } }),
      tx.user.count({ where: { role: "Customer" } }),
      tx.user.count({ where: { role: "Provider" } }),
      tx.user.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      tx.user.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      tx.user.count({ where: { emailVerified: false } }),
      tx.user.count({ where: { isActive: true } }),
      tx.user.count({ where: { isActive: false } }),
    ]);

    return {
      totalUsers,
      totalSuspendUser,
      totalActivateUser,
      totalAdmin,
      totalCustomer,
      totalprovider,
      todaystats,
      oneMonthago,
      totalemailvarified,
      totalactiveusers,
      totalunactiveuser,
    };
  });
};

const getMealStatsInternal = async () => {
  return prisma.$transaction(async (tx: any) => {
    const [
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals,
      totalapprovedmeals,
      totalpendingmeals,
      totalrejectedmeals,
    ] = await Promise.all([
      tx.meal.count(),
      tx.meal.count({ where: { isAvailable: true } }),
      tx.meal.count({ where: { isAvailable: false } }),
      tx.meal.count({ where: { status: "APPROVED" } }),
      tx.meal.count({ where: { status: "PENDING" } }),
      tx.meal.count({ where: { status: "REJECTED" } }),
    ]);

    return {
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals,
      totalapprovedmeals,
      totalpendingmeals,
      totalrejectedmeals,
    };
  });
};

const getOrderStatsInternal = async () => {
  return prisma.$transaction(async (tx: any) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const [
      totalorders,
      oneMonth,
      totalcancelledmeals,
      totalplacedmeals,
      totalpreparingmeals,
      totalreadymeals,
      totaldeliveredmeals,
      allearn,
      totalquantity,
      todayorders,
    ] = await Promise.all([
      tx.order.count(),
      tx.order.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      tx.order.count({ where: { status: "CANCELLED" } }),
      tx.order.count({ where: { status: "PLACED" } }),
      tx.order.count({ where: { status: "PREPARING" } }),
      tx.order.count({ where: { status: "READY" } }),
      tx.order.count({ where: { status: "DELIVERED" } }),
      tx.order.aggregate({ _sum: { totalPrice: true } }),
      tx.orderitem.aggregate({ _sum: { quantity: true } }),
      tx.order.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
    ]);

    return {
      totalorders,
      oneMonth,
      totalcancelledmeals,
      totalplacedmeals,
      totalpreparingmeals,
      totalreadymeals,
      totaldeliveredmeals,
      allearn,
      totalquantity,
      todayorders,
    };
  });
};

const getRevenueStatsInternal = async () => {
  return prisma.$transaction(async (tx: any) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const [totalrevenue, todaysRevenue, monthlyRevenue, avgrevenue, topProvidersrevenue] =
      await Promise.all([
        tx.order.aggregate({ _sum: { totalPrice: true } }),
        tx.order.aggregate({
          _sum: { totalPrice: true },
          where: { createdAt: { gte: startOfToday, lte: endOfToday } },
        }),
        tx.order.aggregate({
          _sum: { totalPrice: true },
          where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        }),
        tx.order.aggregate({ _avg: { totalPrice: true } }),
        tx.order.groupBy({
          by: ["providerId"],
          orderBy: { _sum: { totalPrice: "desc" } },
          take: 5,
        }),
      ]);

    return {
      totalrevenue,
      todaysRevenue,
      monthlyRevenue,
      avgrevenue,
      topProvidersrevenue,
    };
  });
};

const getReviewStatsInternal = async () => {
  return prisma.$transaction(async (tx: any) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [totalreviews, todayreviews, topRatedMeals] = await Promise.all([
      tx.review.count(),
      tx.review.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      tx.review.groupBy({
        by: ["mealId"],
        _avg: { rating: true },
        orderBy: { _avg: { rating: "desc" } },
        take: 4,
      }),
    ]);

    return {
      totalreviews,
      todayreviews,
      topRatedMeals,
    };
  });
};

const getCategoryStatsInternal = async () => {
  return prisma.$transaction(async (tx: any) => {
    const [totalcategory, totalcategory_name, mealsPerCategory] = await Promise.all([
      tx.category.count(),
      tx.category.findMany({ select: { name: true } }),
      tx.meal.groupBy({
        by: ["category_name"],
        _count: { _all: true },
      }),
    ]);

    return {
      totalcategory,
      totalcategory_name,
      mealsPerCategory,
    };
  });
};

/**
 * 🔹 PROVIDER INTERNAL
 */

const getProviderRevenueInternal = async (providerId: string) => {
  return prisma.$transaction(async (tx: any) => {
    const [totalrevenue] = await Promise.all([
      tx.order.aggregate({
        where: { providerId },
        _sum: { totalPrice: true },
      }),
    ]);

    return { totalrevenue };
  });
};

const getProviderMealInternal = async (providerId: string) => {
  return prisma.$transaction(async (tx: any) => {
    const [totalmeals, totalavailabemeals, totalunavailabemeals] =
      await Promise.all([
        tx.meal.count({ where: { providerId } }),
        tx.meal.count({ where: { providerId, isAvailable: true } }),
        tx.meal.count({ where: { providerId, isAvailable: false } }),
      ]);

    return {
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals,
    };
  });
};

const getProviderOrderInternal = async (providerId: string) => {
  return prisma.$transaction(async (tx: any) => {
    const [totalorders] = await Promise.all([
      tx.order.count({ where: { providerId } }),
    ]);

    return { totalorders };
  });
};

/**
 * 🔹 EXPORT
 */
export const StatsService = {
  getDashboardStatsData,
};