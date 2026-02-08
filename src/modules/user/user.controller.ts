import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const search = req.query
        const { isActive } = req.query
        const isactivequery = isActive ? req.params.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined:undefined
        const result = await UserService.GetAllUsers(search, isactivequery as boolean)
          if(!result.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({result})
    } catch (e: any) {
        next(e)
    }
}

const UpdateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = req.user
        if (!user) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.UpdateUserStatus(req.params.id as string,req.body)
          if(!result){
            res.status(400).json({result })
        }

        res.status(200).json({result })
    } catch (e: any) {
       e.Custommessage= e.message
        next(e)
    }

}

const getUserprofile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.getUserprofile(req.params.id as string)
          if(!result.sucess){
            res.status(400).json({result })
        }
        res.status(201).json({ result })
    } catch (e: any) {
        next(e)
    }

}


const UpateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.UpateUserProfile(req.body,user.id as string)
          if(!result?.sucess){
            res.status(400).json({result })
        }

        res.status(200).json({ result })
    } catch (e: any) {
        e.Custommessage =e.message
        next(e)

    }

}

const ChangeUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.ChangeUserRole(req.params.id as string, req.body)
         if(!result.sucess){
          return res.status(400).json({result })
        }
         return res.status(200).json({ result })
    } catch (e: any) {
        e.customeMessage=e.message
        next(e)
    }

}


const DeleteUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.DeleteUserProfile(req.params.id as string)
         if(!result.sucess){
            res.status(400).json({result })
        }
        res.status(201).json({ result })
    } catch (e: any) {
        next(e)
    }

}

const OwnProfileDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('lkdsjfsdjfljslkdfjlkdsjfa')
        const user = req.user
        if (!user) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.OwnProfileDelete(user.id as string)
         if(!result.sucess){
            res.status(400).json({result })
        }
           res.status(201).json({ result })
    } catch (e: any) {
        next(e)
    }

}

export const UserController = {
    GetAllUsers,
    UpdateUserStatus,
    getUserprofile,
    UpateUserProfile,
    DeleteUserProfile,
    ChangeUserRole,
    OwnProfileDelete
}