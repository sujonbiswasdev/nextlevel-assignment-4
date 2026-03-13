import z, { object } from "zod";
import { ReviewStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { formatZodIssues } from "../../utils/handleZodError";
import { createReviewsData, updateReviewsData } from "./reviews.validation";
import { ICreatereviewData, IUpdatereviewData } from "./reviews.interface";
import AppError from "../../errorHelper/AppError";

const CreateReviews = async (customerid: string, mealid: string, data: ICreatereviewData) => {
    const existingmeal = await prisma.meal.findUnique({
        where: {
            id: mealid
            }
    })
    if(!existingmeal){
        throw new AppError(404, "meal not found for this id")
    }
    const orderMeal = await prisma.orderitem.findFirst({
        where: {
            mealId: mealid,
            order: {
                customerId: customerid
            }
        }
    });

    if (!orderMeal) {
        throw new AppError(404, "you can not review for this meal without order")
    }
    if (data.rating >= 6) {
      throw new AppError(400, "rating must be between 1 and 5")
    }

    const result = await prisma.review.create({
        data: {
            customerId: customerid,
            mealId: mealid,
            ...data

        }
    })

    return result

}
const updateReview = async (reviewId: string, data: IUpdatereviewData, authorId: string) => {
  
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId,
            customerId: authorId
        },
        select: {
            id: true
        }
    })
    
    if (!review) {
        throw new AppError(404,"review not found")
    }

    const result = await prisma.review.update({
        where: {
            id: reviewId,
            customerId: authorId
        },
        data: {
            ...data
        }
    })
    return {
        success: true,
        message:`your review update successfully`,
        result
    }
}


const deleteReview = async (reviewid: string, authorid: string) => {
    const review = await prisma.review.findFirst({
        where: {
            id: reviewid,
            customerId: authorid
        },
        select: {
            id: true
        }
    })
    if (!review) {
        throw new AppError(404, "review not found for this id")
    }

    const result = await prisma.review.delete({
        where: {
            id: review.id
        }
    })

    return result
}

const getReviewByid = async (reviewid: string) => {
    const result = await prisma.review.findUnique({
        where: {
            id: reviewid
        },
        include: {
            meal: true
        }
    })
    if(!result){
        throw new AppError(404,'review not found')
    }

    return result
}

const moderateReview = async (id: string, data: { status: ReviewStatus }) => {
    const {status}=data

    const reviewData = await prisma.review.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    });
    if (!reviewData) {
        throw new AppError(404,'review data not found by id')
    }

    if (reviewData.status === data.status) {
        throw new AppError(409, `Your provided status (${data.status}) is already up to date.`)
    }

    const result = await prisma.review.update({
        where: {
            id
        },
        data:{
            status
        }
    })

    return result
}

const getAllreviews = async () => {
    const result = await prisma.review.findMany({
        include: {
            customer: true,
            meal: true,
            replies: true
        }
    })

    return result
}


export const ReviewsService = { CreateReviews, updateReview, deleteReview, getReviewByid, moderateReview, getAllreviews }