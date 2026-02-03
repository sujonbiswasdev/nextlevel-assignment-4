import { NextFunction, Request, Response } from "express"
import { mealService } from "./meal.service"

const createMeal = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user=req.user
        if(!user){
            throw new Error("user not found")
        }
        const result=await mealService.createMeal(req.body)
        res.status(201).json(result)
    } catch (e:any) {
            next(e)
    }
}

export const mealController={createMeal}