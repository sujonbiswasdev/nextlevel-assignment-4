import { Request, Response } from "express"
import { authService } from "./auth.service"

const getCurentUser=async(req:Request,res:Response)=>{
    try {
        const user= req.user
        if(!user){
            throw new Error("user not found")
        }
        const result =await authService.getCurentUser(user.id)
        res.status(200).json({sucess:true,message:"user get sucessfully",result})
    } catch (error) {
        res.status(400).json({sucess:false,message:"user get fail"})
    }
}

export const authController={
    getCurentUser
}