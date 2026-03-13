import { NextFunction, Request, Response } from "express"
import { auth as betterAuth } from '../lib/auth'
import status from "http-status"
import AppError from "../errorHelper/AppError"

const auth = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles)
       try {
         const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        if (!session) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: "You are Unauthorized"
            })
        }
        req.user={
            id:session.user.id,
            name:session.user.name,
            email:session.user.email,
            role:session.user.role as string,
            emailVerified:session.user.emailVerified,
            status:session.user.status as string,
            isActive:session.user.isActive as boolean
        }

         if (roles.length && !roles.includes(req.user.role)) {
                return res.status(status.FORBIDDEN).json({
                    success: false,
                    message: "Access denied: You do not have the required permissions to perform this action."
                })
            }
           
        next()
       } catch (error) {
        throw new AppError(status.BAD_REQUEST,"Authentication failed")
       }
    }
}
export default auth