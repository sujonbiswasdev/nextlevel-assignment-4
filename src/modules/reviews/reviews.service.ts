import z from "zod";
import { ReviewStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { formatZodIssues } from "../../utils/handleZodError";

const CreateReviews = async (customerid: string, mealid: string, data: { rating: number, comment: string, parentId?: string }) => {

       const orderData = z.object({
            rating: z.number().min(1).max(5),
            comment: z.string(),
            parentId: z.string().optional()
        });
        const parseData = orderData.safeParse(data)
            if (!parseData.success) {
                return {
                    success: false,
                    message: `your provided data is invalid`,
                    data: formatZodIssues(parseData.error)
                }
            }

    const orderMealid = await prisma.orderitem.findFirst(
        {
            where: { mealId: mealid },
            include: {
                order: {
                    select: {
                        customerId: true
                    }
                }
            }
        }
    )
    console.log(orderMealid)
    if(data.rating>=6){
           return {
                    success: false,
                    message: `your provided rating is invalid`
                }
    }

    if (!orderMealid || orderMealid.mealId !== mealid || orderMealid.order.customerId !== customerid) {
        throw new Error('You must place an order before leaving a review.')

    }
   

   const result = await prisma.review.create({
        data: {
            customerId: customerid,
            mealId: mealid,
            ...parseData!.data!

        }
    })

     return {
        sucess: true,
        message:`your review has been created sucessfully`,
        result
    }

}

const updateReview = async (reviewId: string, data: { comment?: string,rating?:number}, authorId: string) => {

       const orderData = z.object({
            rating: z.number().min(1).max(5).optional(),
            comment: z.string().optional()
        });
        const parseData = orderData.safeParse(data)
            if (!parseData.success) {
                return {
                    success: false,
                    message: `your provided data is invalid`,
                    data: formatZodIssues(parseData.error)
                }
            }
    const review = await prisma.review.findFirst({
        where: {
            id:reviewId,
            customerId:authorId
        },
        select: {
            id: true
        }
    })
    console.log(
        review
    )
    if (!review) {
        throw new Error("Your provided input is invalid!")
    }

    const result= await prisma.review.update({
        where: {
            id: reviewId,
            customerId:authorId
        },
        data:{
            ...parseData.data
        }
    })
       return {
        sucess: true,
        message: result ? `your review update sucessfully` : `your review didn't updated`,
        result
    }
}


const deleteReview = async (reviewid: string, authorid: string) => {
    const review = await prisma.review.findFirst({
        where: {
            id: reviewid,
            customerId:authorid
        },
        select: {
            id: true
        }
    })
    if(!review){
        throw new Error('review not found')
    }

    const result= await prisma.review.delete({
        where: {
            id: review.id
        }
    })

        return {
        sucess: true,
        message:`your review delete sucessfully`,
        result
    }
}

const getReviewByid = async (reviewid: string) => {
    const result= await prisma.review.findUniqueOrThrow({
        where: {
            id:reviewid
        },
        include: {
            meal:true
        }
    })

      return {
        sucess: true,
        message:`Review retrieved successfully. `,
        result
    }
}

const moderateReview = async (id: string, data: { status: ReviewStatus }) => {


       const orderData = z.object({
            status: z.enum(['APPROVED','REJECT']),
        });
        const parseData = orderData.safeParse(data)
            if (!parseData.success) {
                return {
                    success: false,
                    message: `your provided data is invalid`,
                    data: formatZodIssues(parseData.error)
                }
            }
    const reviewData = await prisma.review.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    });
    if(!reviewData){
        throw new Error('review data not found')
    }

    if (reviewData.status === data.status) {
        throw new Error(`Your provided status (${data.status}) is already up to date.`)
    }

    const result= await prisma.review.update({
        where: {
            id
        },
        data:{
            status:parseData.data.status
        }
    })

       return {
        sucess: true,
        message: result ? `Review status update successfully. ` : `Review status update unsuccessfully.`,
        result
    }
}


export const ReviewsService = { CreateReviews,updateReview ,deleteReview,getReviewByid,moderateReview}