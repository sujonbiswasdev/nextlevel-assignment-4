import { NextFunction, Request, Response } from "express"
import { categoryService } from "./category.service"

const CreateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await categoryService.CreateCategory(req.body, users.role as string, req.user?.id as string)
        res.status(201).json({ message: "category create sucessfully", result })
    } catch (e: any) {
        e.customMessage = 'category create failed'
        next(e)
    }
}


const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await categoryService.getCategory()
        res.status(200).json({ message: "category retrieve sucessfully", result })
    } catch (e: any) {
        e.customMessage = 'category retrieve failed'
        next(e)
    }
}

const SingleCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await categoryService.SingleCategory(req.params.id as string)
        res.status(200).json({ message: "single category retrieve sucessfully", result })
    } catch (e: any) {
        e.customMessage = 'single category retrieve failed'
        next(e)
    }
}

const UpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await categoryService.UpdateCategory(req.params.id as string, req.body)
        res.status(200).json({ message: "category Update sucessfully", result })
    } catch (e: any) {
        e.customMessage = e.message || 'category Update failed'
        next(e)
    }
}

const DeleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await categoryService.DeleteCategory(req.params.id as string)
        res.status(200).json({ message: "category delete sucessfully", result })
    } catch (e: any) {
        e.customMessage = 'category delete failed'
        next(e)
    }
}


export const CategoryController = { CreateCategory, getCategory, UpdateCategory, DeleteCategory, SingleCategory }