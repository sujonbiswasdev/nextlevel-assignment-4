import { NextFunction, Request, Response } from "express"
import { UserService } from "./users.service"
const getAllUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
          const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await UserService.getAllUser(users?.role as string)
        res.status(200).json({sucess:true,message:" get all users sucessfully",result})
    } catch (e:any) {
          e.customMessage=`${e.message}`||'admin only get'
         next(e)
    }
}

const UpdateUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
          const users = req.user
          const id=req.params.id
        if (!users) {
            res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await UserService.UpdateUser(users?.role as string,id as string,req.body)
        res.status(200).json({sucess:true,message:" get all users sucessfully",result})
    } catch (e:any) {
          e.customMessage=`${e.message}`||'admin only get'
         next(e)
    }
}

export const UserController={
    getAllUser,
    UpdateUser
}