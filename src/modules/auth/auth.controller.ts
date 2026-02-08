import { NextFunction, Request, Response } from "express"
import { authService } from "./auth.service"

const getCurrentUser = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await authService.getCurrentUser(user.id)
           if(!result?.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({ sucess: true, result })
    } catch (error:any) {
        next(error)
    }
}
export const authController = {
    getCurrentUser 
}