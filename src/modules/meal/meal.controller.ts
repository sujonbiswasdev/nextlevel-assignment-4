import { NextFunction, Request, Response } from "express"
import { mealService } from "./meal.service"

const createMeal = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result=await mealService.createMeal(req.body,users.id as string)
        res.status(201).json({message:"meal create sucessfully",result})
    } catch (e:any) {
           e.customMessage=e.message || 'meal create fail'
            next(e)
    }
}

const UpdateMeals = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const id=req.params.id
        const result=await mealService.UpdateMeals(req.body,id as string)
        res.status(200).json({message:"meal update sucessfully",result})
    } catch (e:any) {
        e.customMessage='meal update fail'
            next(e)
    }
}

const DeleteMeals = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const id=req.params.id
        const result=await mealService.DeleteMeals(id as string)
        res.status(200).json({message:"meal delete sucessfully",result})
    } catch (e:any) {
        e.customMessage=`${e.message}`
         next(e)
    }
}

const Getallmeals = async (req: Request, res: Response,next:NextFunction) => {
    try {
        
        const result=await mealService.getAllmeals()
        res.status(200).json({message:"get all meals sucessfully",result})
    } catch (e:any) {
        e.customMessage=`${e.message}`
         next(e)
    }
}

const GetSignlemeals = async (req: Request, res: Response,next:NextFunction) => {
    try {
        
        const result=await mealService.getSinglemeals(req.params.id as string)
        res.status(200).json({message:"get signle meals sucessfully",result})
    } catch (e:any) {
        e.customMessage=`${e.message}`
         next(e)
    }
}

export const mealController={
    createMeal,
    UpdateMeals,
    DeleteMeals,
    Getallmeals,
    GetSignlemeals}