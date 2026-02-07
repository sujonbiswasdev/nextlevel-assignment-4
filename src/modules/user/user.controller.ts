import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const search=req.query
        const result = await UserService.GetAllUsers(search)
        res.status(200).json({ sucess: true, message: "retrieve all users sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "retrieve all user failed"
        next(e)
    }
}

const UpdateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.UpdateUserStatus(req.params.id as string, users.role as string, req.body)

        res.status(200).json({ sucess: true, message: result?.isActive ? 'user has been activated' : 'user has been suspend', result })
    } catch (e: any) {
        e.Custommessage = e.message || "user update failed"
        next(e)
    }

}

const getCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.getCustomerprofile(req.params.id as string,users.id as string, users.role as string)
        res.status(201).json({ sucess: true, message: "retrieve user sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "retrieve user failed"
        next(e)
    }

}


const UpateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.UpdateCustomerProfile(req.params.id as string, users.role as string, req.body,users.id)

        res.status(201).json({ sucess: true, message: "customer profile update sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "customer profile update failed"
        next(e)
    }

}

const DeleteCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.DeleteCustomerProfile(req.params.id as string,users.id, users.role as string)
        res.status(201).json({ sucess: true, message: "customer profile delete sucessfully", result })
    } catch (e: any) {
        e.Custommessage = "customer profile delete failed"
        next(e)
    }

}

const UpdateRoleUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.userRoleChange(req.params.id as string,users.id as string, req.body)

        res.status(200).json({ sucess: true, message:"user role change sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "user role change failed"
        next(e)
    }

}

export const UserController = {
    GetAllUsers,
    UpdateUserStatus,
    getCustomerProfile,
    UpateCustomerProfile,
    DeleteCustomerProfile,
    UpdateRoleUsers
}