import { NextFunction, Request, Response } from "express"
import { CategoryService } from "./category.service"

const CreateCategory=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const users = req.user
        if (!users) {
            res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await CategoryService.CreateCategory(users?.role as string,req.body)
        res.status(200).json({sucess:true,message:"category create sucessfully",result})
    } catch (e:any) {
          e.customMessage=`${e.message}`
         next(e)
    }
}



export const CategoryController={
    CreateCategory
}