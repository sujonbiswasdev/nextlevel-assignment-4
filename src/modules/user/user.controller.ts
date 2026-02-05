import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.GetAllUsers()
        res.status(201).json({ sucess: true, message: "get all users sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "get all user fail"
        next(e)
    }

}

const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await UserService.UpdateUser(req.params.id as string, users.role as string, req.body)

        res.status(201).json({ sucess: true, message: result?.isActive ? 'user has been activated' : 'user has been suspend', result })
    } catch (e: any) {
        e.Custommessage = e.message || "user update fail"
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
        res.status(201).json({ sucess: true, message: "get user sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "get user fail"
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
        e.Custommessage = e.message || "customer profile update fail"
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
        res.status(201).json({ sucess: true, message: "get all users sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "get all user fail"
        next(e)
    }

}

export const UserController = {
    GetAllUsers,
    UpdateUser,
    getCustomerProfile,
    UpateCustomerProfile,
    DeleteCustomerProfile
}