import { prisma } from "../../lib/prisma"

const getuserStats = async (adminid: string) => {
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: adminid
        }
    })
    if (existuser.id !== adminid) {
        throw new Error("you are unauthorize")
    }

    return await prisma.$transaction(async (tx) => {
        // today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const [totalUsers, totalSuspendUser, totalActivateUser, totalAdmin, totalCustomer, totalprovider, todaystats, oneMonthago, totalemailvarified, totalactiveusers, totalunactiveuser] =
            await Promise.all([
                await tx.user.count(),
                await tx.user.count({ where: { status: 'suspend' } }),
                await tx.user.count({ where: { status: 'activate' } }),
                await tx.user.count({ where: { role: 'Admin' } }),
                await tx.user.count({ where: { role: 'Customer' } }),
                await tx.user.count({ where: { role: 'Provider' } }),
                await tx.user.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
                await tx.user.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
                await tx.user.count({ where: { emailVerified: false } }),
                await tx.user.count({ where: { isActive: true } }),
                await tx.user.count({ where: { isActive: false } })

            ])
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
            totalunactiveuser

        }
    })
}


const getmealsStats = async (adminid: string) => {
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: adminid
        }
    })
    if (existuser.id !== adminid) {
        throw new Error("you are unauthorize")
    }

    return await prisma.$transaction(async (tx) => {
        const [totalmeals, totalavailabemeals, totalunavailabemeals] =
            await Promise.all([
                await tx.meal.count(),
                await tx.meal.count({ where: { isAvailable: true } }),
                await tx.meal.count({ where: { isAvailable: false } }),
                // await tx.meal.count({ where: { status: 'APPROVED' } }),
                // await tx.meal.count({ where: { status: 'PENDING' } }),
                // await tx.meal.count({ where: { status: 'REJECTED' } }),
            ])
        return {
            totalmeals,
            totalavailabemeals,
            totalunavailabemeals,
            // totalapprovedmeals,
            // totalpendingmeals,
            // totalrejectedmeals
        }
    })
}

const getordersStats = async (adminid: string) => {
    
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: adminid
        }
    })
    if (existuser.id !== adminid) {
        throw new Error("you are unauthorize")
    }

    return await prisma.$transaction(async (tx) => {
        // today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);
        const [totalorders, oneMonth, totalcancelledmeals, totalplacedmeals, totalpreparingmeals, totalreadymeals, totaldeliveredmeals, allearn, totalquantity, todayorders] =
            await Promise.all([
                await tx.order.count(),
                await tx.order.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
                await tx.order.count({ where: { status: 'CANCELLED' } }),
                await tx.order.count({ where: { status: 'PLACED' } }),
                await tx.order.count({ where: { status: 'PREPARING' } }),
                await tx.order.count({ where: { status: 'READY' } }),
                await tx.order.count({ where: { status: 'DELIVERED' } }),
                await tx.order.aggregate({ _sum: { totalPrice: true } }),
                await tx.orderitem.aggregate({ _sum: { quantity: true } }),
                await tx.order.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
            ])
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
            todayorders

        }
    })
}


const getrevenueStats = async (adminid: string) => {
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: adminid
        }
    })
    if (existuser.id !== adminid) {
        throw new Error("you are unauthorize")
    }

    return await prisma.$transaction(async (tx) => {
        // today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);


        const [totalrevenue, todaysRevenue, monthlyRevenue, avgrevenue, topProvidersrevenue] =
            await Promise.all([
                await tx.order.aggregate({ _sum: { totalPrice: true } }),
                await tx.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
                await tx.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
                await tx.order.aggregate({ _avg: { totalPrice: true } }),
                await tx.order.groupBy({ by: ['providerId'], orderBy: { _sum: { totalPrice: 'desc' } }, take: 5 })
            ])
        return {
            totalrevenue,
            todaysRevenue,
            monthlyRevenue,
            avgrevenue,
            topProvidersrevenue
        }
    })
}

const getreviewStats = async (adminid: string) => {
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: adminid
        }
    })
    if (existuser.id !== adminid) {
        throw new Error("you are unauthorize")
    }

    return await prisma.$transaction(async (tx) => {
        // today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);


        const [totalreviews, todayreviews, topRatedMeals] =
            await Promise.all([
                await tx.review.count(),
                await tx.review.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
                await tx.review.groupBy({ by: ['mealId'], _avg: { rating: true }, orderBy: { _avg: { rating: "desc" } }, take: 4 })
            ])
        return {
            totalreviews,
            todayreviews,
            topRatedMeals
        }
    })
}



const getcategoryStats = async (adminid: string) => {
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: adminid
        }
    })
    if (existuser.id !== adminid) {
        throw new Error("you are unauthorize")
    }
    return await prisma.$transaction(async (tx) => {
        const [totalcategory,totalcategory_name, mealsPerCategory] =
            await Promise.all([
                await tx.category.count(),
                await tx.category.findMany({select:{name:true}}),
                await tx.meal.groupBy({
                    by: ['category_name'], _count: {
                        _all: true
                    }
                })
            ])
        return {
            totalcategory,
            totalcategory_name,
            mealsPerCategory
        }
    })
}


// provider
const getrevenueProviderStats = async (userid: string) => {
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: userid
        },
        include:{
            provider:{
                select:{
                    id:true
                }
            }
        }
    })
    console.log(userid)
    if (existuser.id !== userid) {
        throw new Error("you are unauthorize")
    }
     return await prisma.$transaction(async (tx) => {
        // today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);


        const [totalrevenue, todaysRevenue, monthlyRevenue, avgrevenue, topProvidersrevenue] =
            await Promise.all([
                await tx.order.aggregate({where:{providerId:existuser.provider!.id}, _sum: { totalPrice: true } }),
                await tx.order.aggregate({ _sum: { totalPrice: true }, where: {providerId:existuser.provider!.id, createdAt: { gte: startOfToday, lte: endOfToday } } }),
                await tx.order.aggregate({ _sum: { totalPrice: true }, where: {providerId:existuser.provider!.id, createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
                await tx.order.aggregate({where:{providerId:existuser.provider!.id}, _avg: { totalPrice: true } }),
                await tx.order.groupBy({where:{providerId:existuser.provider!.id}, by: ['providerId'], orderBy: { _sum: { totalPrice: 'desc' } }, take: 5 })
            ])
        return {
            totalrevenue,
            todaysRevenue,
            monthlyRevenue,
            avgrevenue,
            topProvidersrevenue
        }
    })
}

const getProvidermealsStats = async (userid: string) => {
    console.log('get melass')
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: userid
        },
        include:{
            provider:{
                select:{
                    id:true
                }
            }
        }
    })
    if (existuser.id !== userid) {
        throw new Error("you are unauthorize")
    }

    return await prisma.$transaction(async (tx) => {
        const [totalmeals, totalavailabemeals, totalunavailabemeals] =
            await Promise.all([
                await tx.meal.count({where:{providerId:existuser.provider!.id}}),
                await tx.meal.count({ where: {providerId:existuser.provider!.id, isAvailable: true } }),
                await tx.meal.count({ where: {providerId:existuser.provider!.id, isAvailable: false } }),
                // await tx.meal.count({ where: { providerId:existuser.provider!.id,status: 'APPROVED' } }),
                // await tx.meal.count({ where: { providerId:existuser.provider!.id,status: 'PENDING' } }),
                // await tx.meal.count({ where: {providerId:existuser.provider!.id, status: 'REJECTED' } }),
            ])
        return {
            totalmeals,
            totalavailabemeals,
            totalunavailabemeals,
            // totalapprovedmeals,
            // totalpendingmeals,
            // totalrejectedmeals
        }
    })
}

const getProviderordersStats = async (userid: string) => {
    const todayOrdersData = await prisma.order.findMany({
  where: {
    createdAt: {
      gte: new Date(new Date().setHours(0,0,0,0)),
      lte: new Date(new Date().setHours(23,59,59,999))
    }
  }
})

console.log("TODAY DATA:", todayOrdersData)
console.log("TODAY LENGTH:", todayOrdersData.length)
    const existuser = await prisma.user.findUniqueOrThrow({
        where: {
            id: userid
        },
        include:{
            provider:{
                select:{
                    id:true
                }
            }
        }
    })

    const orderid=await prisma.order.findFirstOrThrow({where:{providerId:existuser.provider!.id}})
    if (existuser.id !== userid) {
        throw new Error("you are unauthorize")
    }

    return await prisma.$transaction(async (tx) => {
        // today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);
        const [totalorders, oneMonth, totalcancelledmeals, totalplacedmeals, totalpreparingmeals, totalreadymeals, totaldeliveredmeals, allearn, totalquantity, todayorders] =
            await Promise.all([
                await tx.order.count({where:{providerId:existuser.provider!.id}}),
                await tx.order.count({ where: {providerId:existuser.provider!.id, createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
                await tx.order.count({ where: {providerId:existuser.provider!.id, status: 'CANCELLED' } }),
                await tx.order.count({ where: {providerId:existuser.provider!.id, status: 'PLACED' } }),
                await tx.order.count({ where: { providerId:existuser.provider!.id,status: 'PREPARING' } }),
                await tx.order.count({ where: {providerId:existuser.provider!.id, status: 'READY' } }),
                await tx.order.count({ where: {providerId:existuser.provider!.id, status: 'DELIVERED' } }),
                await tx.order.aggregate({where:{providerId:existuser.provider!.id}, _sum: { totalPrice: true } }),
                await tx.orderitem.aggregate({where:{order:{
                    providerId:existuser.provider!.id
                }},_sum: { quantity: true } }),
                await tx.order.count({ where: {providerId:existuser.provider!.id, createdAt: { gte: startOfToday, lte: endOfToday } } }),
            ])
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
            todayorders

        }
    })
}

export const StatsService = {
    getuserStats,
    getmealsStats,
    getordersStats,
    getrevenueStats,
    getreviewStats,
    getcategoryStats,
    getrevenueProviderStats,
    getProvidermealsStats,
    getProviderordersStats
}