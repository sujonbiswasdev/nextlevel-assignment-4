import { NextFunction, Request, Response } from "express"
import { categoryService } from "./category.service"

const CreateCategory = async (req: Request, res: Response,next:NextFunction) => {
    try {
          const users = req.user
          console.log(users)
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result=await categoryService.CreateCategory(req.body,users.role as string)
        res.status(201).json({message:"category create sucessfully",result})
    } catch (e:any) {
           e.customMessage=e.message || 'category create fail'
            next(e)
    }
}

export const CategoryController={CreateCategory}