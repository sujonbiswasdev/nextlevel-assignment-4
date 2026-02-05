import { NextFunction, Request, Response } from "express"
import { ReviewsService } from "./reviews.service"

const CreateReviews = async (req: Request, res: Response,next:NextFunction) => {
    try {
          const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result=await ReviewsService.CreateReviews(users.id,req.params.id as string,req.body,users.role as string)
        res.status(201).json({message:"reviews create sucessfully",result})
    } catch (e:any) {
           e.customMessage='reviews create fail'
            next(e)
    }
}

export const ReviewsController={CreateReviews}