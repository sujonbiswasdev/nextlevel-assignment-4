import { NextFunction, Request, Response } from "express"
import { auth as betterAuth } from '../lib/auth'

const auth = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles)
       try {
         const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        if (!session) {
            return res.status(401).json({
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
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resources!"
                })
            }
            console.log(
                roles
            )
        next()
       } catch (error) {
        
       }
    }
}
export default auth