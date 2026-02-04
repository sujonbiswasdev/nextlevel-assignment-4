import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.GetAllUsers()
        res.status(201).json({ sucess: true, message: "order create sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "get all user fail"
        next(e)
    }

}

export const UserController = {
    GetAllUsers
}