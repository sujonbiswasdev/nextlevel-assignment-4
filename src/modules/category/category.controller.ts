import { NextFunction, Request, Response } from "express"
import { categoryService } from "./category.service"

const CreateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result = await categoryService.CreateCategory(req.body, user.id as string)
          if(!result.success){
           return res.status(400).json({result })
        }
       return res.status(201).json({ result })
    } catch (e: any) {
        next(e)
    }
}


const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await categoryService.getCategory()
          if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({result })
    } catch (e: any) {
        next(e)
    }
}

const SingleCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await categoryService.SingleCategory(req.params.id as string)
          if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (e: any) {
        next(e)
    }
}

const UpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result = await categoryService.UpdateCategory(req.params.id as string, req.body)
          if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({result })
    } catch (e: any) {
        next(e.message)
    }
}

const DeleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await categoryService.DeleteCategory(req.params.id as string)
          if(!result.success){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (e: any) {
        next(e)
    }
}


export const CategoryController = { CreateCategory, getCategory, UpdateCategory, DeleteCategory, SingleCategory }