import { string } from 'better-auth';
import { Meal } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { MealWhereInput } from '../../../generated/prisma/models';

const createMeal = async (data: { name: string, description: string, price: number, isAvailable: boolean, dietaryPreference?: string, categoryId?: string, categoryname: string }, userid: string) => {
    const providerid = await prisma.user.findUniqueOrThrow({ where: { id: userid }, include: { provider: true } })
    const category = await prisma.category.findUniqueOrThrow(
        {
            where: {
                id:data.categoryId,
                name:data.categoryname
            }
        }
    )

    return await prisma.meal.create({
        data: {
            ...data,
            categoryId:category.id || data.categoryname,
            providerId: providerid.provider?.id as string
        }
    })

}

const UpdateMeals = async (data: Partial<Meal>, mealid: string) => {
    if (!mealid) {
        throw new Error("mealid not found")
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
    console.log(existmeal)
    if (!existmeal?.id) {
        throw new Error("mealid not found")
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

const getAllmeals = async (data: { name: string, description: string, price: string, dietaryPreference: string }, isAvailable: boolean) => {
    const andConditions: MealWhereInput[] = []
    if (data) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: data.name,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: data.description,
                        mode: "insensitive"
                    }
                }
            ]
        })
    }
    if (typeof isAvailable === 'boolean') {
        andConditions.push({ isAvailable: isAvailable })
    }
    return await prisma.meal.findMany({
        where: {
            AND: andConditions
        },
        include: {
            provider: true,
            reviews:true
        }

    })
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