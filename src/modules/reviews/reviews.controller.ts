import { NextFunction, Request, Response } from "express"
import { ReviewsService } from "./reviews.service"
import { ReviewStatus } from "../../../generated/prisma/enums"

const CreateReviews = async (req: Request, res: Response,next:NextFunction) => {
    try {
          const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result=await ReviewsService.CreateReviews(users.id,req.params.id as string,req.body)
        res.status(201).json({message:"reviews create sucessfully",result})
    } catch (e:any) {
           e.customMessage=e.message || 'reviews create failed'
            next(e)
    }
}

const updateReview = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { reviewid } = req.params;
        const result = await ReviewsService.updateReview(reviewid as string, req.body, user?.id as string)
         res.status(200).json({message:"reviews update sucessfully",result})
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "reviews update Failed",
            details: e
        })
    }
}

const deleteReview = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user = req.user;
        const { reviewid } = req.params;
        const result = await ReviewsService.deleteReview(reviewid as string, user?.id as string)
        res.status(200).json({message:"reviews delete sucessfully",result})
    } catch (e:any) {
        e.customMessage=e.message || 'reviews delete failed'
        next(e)
    }
}

const moderateReview = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { reviewId } = req.params;
        const result = await ReviewsService.moderateReview(reviewId as string, req.body)
         res.status(200).json({message:"moderate reviews update sucessfully",result})
    } catch (e:any) {
        e.customMessage=e.message || 'moderate reviews review failed'
        next(e)
    }
}


const getReviewByid = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { authorid } = req.params;
        const result = await ReviewsService.getReviewByid(authorid as string)
        res.status(200).json({message:"reviews retrieve sucessfully",result})
    } catch (e:any) {
        e.customMessage=e.message || 'reviews retrieve failed'
        next(e)
    }
}

export const ReviewsController={CreateReviews,updateReview,deleteReview,getReviewByid,moderateReview}