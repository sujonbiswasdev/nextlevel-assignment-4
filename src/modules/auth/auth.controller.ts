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

const signup = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const result = await authService.signup(req.body)
           if(!result?.success){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (error:any) {
        console.log(error.message)
        next(error)
    }
}

const signin = async (req: Request, res: Response,next:NextFunction) => {
    try {
          const cookies = req.cookies;
        const headers = req.headers;
        const result = await authService.signin(req.body,cookies,headers)
           if(!result){
            res.status(400).json(result)
        }
        res.status(200).json({ success: true,
        message: `user signin sucessfully`, result })
    } catch (error:any) {
        error.customMessage=error.message
        next(error)
    }
}
export const authController = {
    getCurrentUser ,
    signoutUser,
    signup,
    signin
}