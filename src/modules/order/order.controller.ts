import { NextFunction, Request, Response } from "express";
import { ServiceOrder } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.CreateOrder(req.body, users?.id as string)
        res.status(201).json({ sucess: true, message: "order create sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "order create fail"
        next(e)

    }

}

const getUserOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.getUserOrder(users?.id as string)
        res.status(201).json({ sucess: true, message: "user order get sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "user order get fail"
        next(e)

    }

}

const UpdateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.UpdateOrder(req.params.id as string,req.body,users.role as string)
        res.status(201).json({ sucess: true, message: "user order Update sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "user order get fail"
        next(e)

    }

}


export const OrderController = {
    createOrder,
    getUserOrder,
    UpdateOrder
}