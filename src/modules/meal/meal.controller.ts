import { NextFunction, Request, Response } from "express"
import { mealService } from "./meal.service"
import paginationSortingHelper from "../helpers/paginationHelping"

const createMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await mealService.createMeal(req.body, user.id)
        if(!result.success){
            res.status(400).json({result })
        }
        res.status(201).json({ message: "meal create sucessfully", result })
    } catch (e: any) {
        e.customMessage =e.message || 'meal create failed'
        next(e)
        console.log(e.message)
    }
}

const UpdateMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await mealService.UpdateMeals(req.body, id as string)
        if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({ message: "meal update sucessfully", result })
    } catch (e: any) {
        e.customMessage =e.message || 'meal update failed'
        next(e)
    }
}

const DeleteMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await mealService.DeleteMeals(id as string)
        if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({ message: "meal delete sucessfully", result })
    } catch (e: any) {
        e.customMessage = `${e.message}`
        next(e)
    }
}

const Getallmeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isAvailable = req.query.isAvailable
            ? req.query.isAvailable === 'true'
                ? true
                : req.query.isAvailable == 'false'
                    ? false
                    : undefined :
            undefined
            
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const result = await mealService.getAllmeals(req.query as any,isAvailable as boolean,page,limit,skip,sortBy,sortOrder)
        if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({ message: "retrieve all meals sucessfully", result })
    } catch (e: any) {
        e.customMessage = `retrieve all meal failed`
        next(e)
        console.log(e)
    }
}

const GetSignlemeals = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await mealService.getSinglemeals(req.params.id as string)
        if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({ message: "retrieve signle meal sucessfully", result })
    } catch (e: any) {
        e.customMessage = `retrieve signle meal failed`
        next(e)
    }
}

export const mealController = {
    createMeal,
    UpdateMeals,
    DeleteMeals,
    Getallmeals,
    GetSignlemeals
}