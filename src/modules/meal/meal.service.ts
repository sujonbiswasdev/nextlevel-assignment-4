import { DietaryPreference, Meal } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { MealWhereInput } from '../../../generated/prisma/models';
import z from "zod";
import { formatZodIssues } from "../../utils/handleZodError";


const getAllmeals = async (data: { meals_name?: string, description?: string, price?: Number, dietaryPreference?: string, cuisine?: string,category_name?:string }, isAvailable?: boolean, page?: number, limit?: number | undefined, skip?: number, sortBy?: string | undefined, sortOrder?: string | undefined) => {
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
                },
                {
                    category_name:{
                        contains:data.category_name,
                        mode:"insensitive"
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
            OR: dietaryList.map(item => ({ dietaryPreference: item}))
        });
    }



    const allpost = await prisma.meal.findMany({
        take: limit,
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

    const total = await prisma.meal.count({where:{AND:andConditions}})

    return {
        success: true,
        message: allpost ? `retrieve all meals has been successfully` : `retrieve all meals failed`,
        data: allpost,
        pagination: {
            total,
            page,
            limit,
            totalpage: Math.ceil(total / limit!)
        },

    }


}


const getSinglemeals = async (id: string) => {
    const result = await prisma.meal.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            category: true,
            provider: {
                include:{
                    user:true
                }
            },
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


    return {
        success: true,
        message: result ? `retrieve single meals has been successfully` : `retrieve single meals failed`,
        data: result,
    }
}

const createMeal = async (data: unknown, userid: string) => {
    const providerid = await prisma.user.findUnique({ where: { id: userid }, include: { provider:{select:{id:true}} } })
      if(!providerid){
        throw new Error('provider not found')
    }
    const mealsData = z.object({
        meals_name: z.string(),
        description:z.string().optional(),
        image:z.string(),
        price:z.number(),
        isAvailable:z.boolean().optional(),
        dietaryPreference:z.enum(['HALAL','VEGAN','VEGETARIAN','GLUTEN_FREE','KETO']).default('VEGETARIAN'),
        category_name:z.string(),
        cuisine:z.string()
    }).strict()
    const parseData = mealsData.safeParse(data)
    console.log(parseData,'jdskfsdjf')
    if (!parseData.success) {
        return {
            success: false,
            message: `your provided data is invalid`,
            data: formatZodIssues(parseData.error)
        }
    }
   const categoryCheck= await prisma.category.findFirst(
        {
            where: {
                name: parseData.data.category_name
            }
        }
    )
    if(!categoryCheck){
        throw new Error("category not found")
    }
    const validData=parseData.data
    const result = await prisma.meal.create({
        data: {
            ...validData,
            providerId:providerid!.provider!.id
        }
    })

    return {
        success: true,
        message: result ? `your meals has been created` : `your meals didn't created`,
        data: result,
    }
}

const UpdateMeals = async (data:unknown, mealid: string) => {
    const {category_name}=data as any
        const mealsData = z.object({
        meals_name: z.string().optional(),
        description:z.string().optional(),
        image:z.string().optional(),
        price:z.number().optional(),
        isAvailable:z.boolean().optional(),
        category_name:z.string().optional(),
        dietaryPreference:z.enum(['HALAL','VEGAN','VEGETARIAN','GLUTEN_FREE','KETO']).default('VEGETARIAN'),
        cuisine:z.string().optional(),
        status:z.enum(['PENDING','APPROVED','REJECTED']).default('APPROVED')
    })
    const parseData = mealsData.safeParse(data)
    if (!parseData.success) {
        return {
            success: false,
            message: `your provided data is invalid`,
            data: formatZodIssues(parseData.error)
        }
    }
    
    if (!mealid) {
        throw new Error("meals not found")
    }
    const existmeal = await prisma.meal.findUniqueOrThrow({ where: { id: mealid } })
    if (existmeal.category_name === category_name) {
        throw new Error("category_name is already up to date.")
    }
    const result = await prisma.meal.update({
        where: {
            id: mealid
        },
        data:{
            ...parseData.data,
        }

    })

      return {
        success: true,
        message: result ? `your meals has been updated` : `your meals didn't changed`,
        data: result,
    }

}

const DeleteMeals = async (mealid: string) => {

    const existmeal = await prisma.meal.findUniqueOrThrow({
        where: {
            id: mealid
        }
    })
    if (existmeal?.id !== mealid) {
        throw new Error('mealid is invalid,please check your mealid')
    }
    const result = await prisma.meal.delete({
        where: {
            id: mealid
        }
    })

      return {
        success: true,
        message: result ? `your meals has been deleted sucessfully` : `your meals  delete fail`,
        data: result,
    }

}

const getOwnMeals = async (userid: string) => {
    const result = await prisma.meal.findMany({
        where: {
            provider: {
                userId: userid
            }
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

    return {
        success: true,
        message: 'retrieve own meals has been successfully',
        data: result,
    }
}


export const mealService = {
    createMeal,
    UpdateMeals,
    DeleteMeals,
    getAllmeals,
    getSinglemeals,
    getOwnMeals
}