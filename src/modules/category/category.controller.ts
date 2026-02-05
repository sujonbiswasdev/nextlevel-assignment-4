import { NextFunction, Request, Response } from "express"
import { categoryService } from "./category.service"

const CreateCategory = async (req: Request, res: Response,next:NextFunction) => {
    try {
          const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result=await categoryService.CreateCategory(req.body,users.role as string)
        res.status(201).json({message:"category create sucessfully",result})
    } catch (e:any) {
           e.customMessage='category create fail'
            next(e)
    }
}


const getCategory = async (req: Request, res: Response,next:NextFunction) => {
    try {
          const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result=await categoryService.getCategory(users.role as string)
        res.status(201).json({message:"category get sucessfully",result})
    } catch (e:any) {
           e.customMessage= 'category get fail'
            next(e)
    }
}

const UpdateCategory = async (req: Request, res: Response,next:NextFunction) => {
    try {
          const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result=await categoryService.UpdateCategory(req.params.id as string,users.role as string,req.body)
        res.status(201).json({message:"category Update sucessfully",result})
    } catch (e:any) {
           e.customMessage=e.message || 'category Update fail'
            next(e)
    }
}

const DeleteCategory = async (req: Request, res: Response,next:NextFunction) => {
    try {
          const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result=await categoryService.DeleteCategory(req.params.id as string,users.role as string)
        res.status(201).json({message:"category delete sucessfully",result})
    } catch (e:any) {
           e.customMessage='category delete fail'
            next(e)
    }
}


export const CategoryController={CreateCategory,getCategory,UpdateCategory,DeleteCategory}