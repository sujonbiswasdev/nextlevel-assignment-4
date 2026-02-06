import { DietaryPreference, Meal } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { MealWhereInput } from '../../../generated/prisma/models';

const createMeal = async (data: { meals_name: string, description: string, price: number, isAvailable: boolean, dietaryPreference: DietaryPreference, category_name: string, cuisine: string }, userid: string) => {
    const providerid = await prisma.user.findUniqueOrThrow({ where: { id: userid }, include: { provider: true } })
    const category = await prisma.category.findUniqueOrThrow(
        {
            where: {
                name: data.category_name
            }
        }
    )
    console.log(providerid)
    return await prisma.meal.create({
        data: {
            meals_name: data.category_name,
            description: data.description,
            price: data.price,
            isAvailable: data.isAvailable,
            dietaryPreference: data.dietaryPreference,
            category_name: data.category_name,
            cuisine: data.cuisine,
            providerId: providerid.provider?.id as string,

        }
    })

}

const UpdateMeals = async (data: Partial<Meal>, mealid: string) => {
    if (!mealid) {
        throw new Error("meals not found")
    }
    const existmeal = await prisma.meal.findUniqueOrThrow({ where: { id: mealid } })
    if (existmeal.category_name === data.category_name) {
        throw new Error("category_name is already up to date.")
    }
    return await prisma.meal.update({
        where: {
            id: mealid
        },
        data

    })

}

const DeleteMeals = async (mealid: string) => {

    const existmeal = await prisma.meal.findUnique({
        where: {
            id: mealid
        }
    })
    if (!existmeal?.id) {
        throw new Error("meals not found")
    }

    if (existmeal?.id !== mealid) {
        throw new Error('mealid is invalid,please check your mealid')
    }
    return await prisma.meal.delete({
        where: {
            id: mealid
        }
    })

}

const getAllmeals = async (data: { meals_name?: string, description?: string, price?: Number, dietaryPreference?: string, cuisine?: string }, isAvailable?: boolean,page?:number,limit?:number | undefined,skip?:number,sortBy?:string | undefined,sortOrder?:string | undefined) => {
    const andConditions: MealWhereInput[] | MealWhereInput = []
    if (data) {
        andConditions.push({
            OR: [
                {
                    meals_name: {
                        contains: data.meals_name,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: data.description,
                        mode: "insensitive"
                    }
                },
                {
                    cuisine: {
                        contains: data.cuisine,
                        mode: "insensitive"
                    }
                }
            ]
        })
    }
    if (typeof isAvailable === 'boolean') {
        andConditions.push({ isAvailable: isAvailable })
    }


    if (data.price) {
        andConditions.push({
            price: {
                gte: 10,
                lte: Number(data.price),
            },
        });
    }
    if (data.dietaryPreference?.length) {
        const dietaryList = data.dietaryPreference.split(',') as DietaryPreference[];
        andConditions.push({
            OR: dietaryList.map(item => ({ dietaryPreference: item }))
        });
    }



    const allpost = await prisma.meal.findMany({
        take:limit,
        skip,
        where: {
            AND: andConditions,
        },
        include: {
            provider: true,
            reviews: true,
        },
        orderBy: {
            [sortBy!]: sortOrder
        },
        

    })

    const total=await prisma.meal.count()

    return {
        data:allpost,
        pagination:{
            total,
            page,
            limit,
            totalpage:Math.ceil(total/limit!)
        }
    }


}

const getSinglemeals = async (id: string) => {
    return await prisma.meal.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            category: true,
            provider: true,
            reviews: {
                where: {
                    parentId: null
                },
                include: {
                    replies: {
                        include: {
                            replies: true
                        }
                    }
                }
            }
        }
    })
}
export const mealService = {
    createMeal,
    UpdateMeals,
    DeleteMeals,
    getAllmeals,
    getSinglemeals
}