import { NextFunction, Request, Response } from "express"
import { mealService } from "./meal.service"

const createMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            throw new Error("user not found")
        }
        const result = await mealService.createMeal(req.body, user.id)
        res.status(201).json({ message: "meal create sucessfully", result })
    } catch (e: any) {
        e.customMessage = 'meal create fail'
        next(e)
    }
}

const UpdateMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await mealService.UpdateMeals(req.body, id as string)
        res.status(200).json({ message: "meal update sucessfully", result })
    } catch (e: any) {
        e.customMessage = 'meal update fail'
        next(e)
    }
}

const DeleteMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await mealService.DeleteMeals(id as string)
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
        const result = await mealService.getAllmeals(req.query as any,isAvailable as boolean)
        res.status(200).json({ message: "get all meals sucessfully", result })
    } catch (e: any) {
        e.customMessage = `get all meals sucessfully`
        next(e)
    }
}

const GetSignlemeals = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await mealService.getSinglemeals(req.params.id as string)
        res.status(200).json({ message: "get signle meals sucessfully", result })
    } catch (e: any) {
        e.customMessage = `get signle meals fail`
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