import { NextFunction, Request, Response } from "express"
import { authService } from "./auth.service"

const getCurentUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const users = req.user
        if (!users) {
            res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await authService.getCurentUser(users?.id as string)
        res.status(200).json({sucess:true,message:"user get sucessfully",result})
    } catch (e:any) {
          e.customMessage=`${e.message}`
         next(e)
    }
}

export const authController={
    getCurentUser
}