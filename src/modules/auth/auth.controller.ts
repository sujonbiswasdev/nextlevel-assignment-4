import { NextFunction, Request, Response } from "express"
import { authService } from "./auth.service"

const getCurrentUser = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result = await authService.getCurrentUser(user.id)
           if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,result,message:`current user retrieve successfully` })
    } catch (error:any) {
        next(error)
    }
}

const signoutUser = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const cookies = req.cookies;
        const headers = req.headers;
        const user = req.user
        if (!user) {
            return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result = await authService.signoutUser(user.id,cookies,headers)
           if(!result?.success){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (error:any) {
        next(error)
    }
}
export const authController = {
    getCurrentUser ,
    signoutUser
}