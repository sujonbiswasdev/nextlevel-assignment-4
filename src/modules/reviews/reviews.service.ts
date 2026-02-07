import { ReviewStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const CreateReviews = async (customerid: string, mealid: string, data: { rating: number, comment: string, parentId?: string }) => {

    const orderMealid = await prisma.orderitem.findFirstOrThrow(
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
    if(data.rating>=5){
        throw new Error("your provided rating is invalid")
    }

    if (!orderMealid || orderMealid.mealId !== mealid || orderMealid.order.customerId !== customerid) {
        throw new Error('You must place an order before leaving a review.')

    }
   

    return await prisma.review.create({
        data: {
            customerId: customerid,
            mealId: mealid,
            parentId: data.parentId,
            rating: Number(data.rating),
            comment: data.comment,

        }
    })

}

const updateReview = async (reviewId: string, data: { comment?: string,rating:number}, authorId: string) => {
    const review = await prisma.review.findFirst({
        where: {
            id:reviewId,
            customerId:authorId
        },
        select: {
            id: true
        }
    })
    if (!review) {
        throw new Error("Your provided input is invalid!")
    }

    return await prisma.review.update({
        where: {
            id: reviewId,
            customerId:authorId
        },
        data:{
            comment:data.comment,
            rating:Number(data.rating)
        }
    })
}


const deleteReview = async (reviewid: string, authorid: string) => {
    const review = await prisma.review.findFirstOrThrow({
        where: {
            id: reviewid,
            customerId:authorid
        },
        select: {
            id: true
        }
    })

    return await prisma.review.delete({
        where: {
            id: review.id
        }
    })
}

const getReviewByid = async (reviewid: string) => {
    return await prisma.review.findFirstOrThrow({
        where: {
            id:reviewid
        },
        include: {
            meal:true
        }
    })
}

const moderateReview = async (id: string, data: { status: ReviewStatus }) => {
    const reviewData = await prisma.review.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    });

    if (reviewData.status === data.status) {
        throw new Error(`Your provided status (${data.status}) is already up to date.`)
    }

    return await prisma.review.update({
        where: {
            id
        },
        data
    })
}


export const ReviewsService = { CreateReviews,updateReview ,deleteReview,getReviewByid,moderateReview}