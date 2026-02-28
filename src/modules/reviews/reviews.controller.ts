import { NextFunction, Request, Response } from "express"
import { ReviewsService } from "./reviews.service"

const CreateReviews = async (req: Request, res: Response,next:NextFunction) => {
    console.log('jlsjfjskdlfjskdljfklsdjf',req)
    try {
          const users = req.user
        if (!users) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result=await ReviewsService.CreateReviews(users.id,req.params.id as string,req.body)
         if(!result.success){
            res.status(400).json({result })
        }
        res.status(201).json({result})
    } catch (e:any) {
            next(e.message)
    }
}

const updateReview = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user = req.user;
        const { reviewid } = req.params;
        const result = await ReviewsService.updateReview(reviewid as string, req.body, user?.id as string)
         if(!result.success){
            res.status(400).json({result })
        }
         res.status(200).json({result})
    } catch (e:any) {
        next(e.message)
    }
}

const deleteReview = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user = req.user;
        const { reviewid } = req.params;
        const result = await ReviewsService.deleteReview(reviewid as string, user?.id as string)
         if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({result})
    } catch (e:any) {
        next(e)
    }
}

const moderateReview = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { reviewId } = req.params;
        const result = await ReviewsService.moderateReview(reviewId as string, req.body)
         if(!result.success){
            res.status(400).json({result })
        }
         res.status(200).json({result})
    } catch (e:any) {
        next(e.message)
    }
}


const getReviewByid = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const  {reviewid}  = req.params;
        const result = await ReviewsService.getReviewByid(reviewid as string)
         if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({result})
    } catch (e:any) {
        next(e)
    }
}
const getAllreviews=async (req: Request, res: Response,next:NextFunction) => {
    try {
        const  {reviewid}  = req.params;
        const result = await ReviewsService.getAllreviews()
         if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({result})
    } catch (e:any) {
        next(e)
    }
}
export const ReviewsController={CreateReviews,updateReview,deleteReview,getReviewByid,moderateReview,getAllreviews}