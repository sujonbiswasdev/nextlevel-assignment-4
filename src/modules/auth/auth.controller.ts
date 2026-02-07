import { Request, Response } from "express"
import { authService } from "./auth.service"

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await authService.getCurrentUser(user.id)
        res.status(200).json({ sucess: true, message: "current user get sucessfully", result })
    } catch (error) {
        res.status(400).json({ sucess: false, message: "current user get failed" })
    }
}

export const authController = {
    getCurrentUser
}