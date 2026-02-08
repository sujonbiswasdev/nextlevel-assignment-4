import { NextFunction, Request, Response } from "express";
import { ServiceOrder } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.CreateOrder(req.params.id as string,req.body, users?.id as string)
         if(!result.sucess){
            res.status(400).json({result })
        }
        res.status(201).json({ result })
    } catch (e: any) {
        next(e.message)

    }

}

const getOwnmealsOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.getOwnmealsOrder(users?.id as string)
         if(!result.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({result })
    } catch (e: any) {
        next(e)

    }

}

const UpdateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.UpdateOrderStatus(req.params.id as string,req.body,users.role as string)
         if(!result?.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (e: any) {
        next(e.message)

    }

}

const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.getAllorder(users?.role as string)
          if(!result?.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (e: any) {
        next(e)

    }

}


const customerOrderStatusTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.customerOrderStatusTrack(req.params.id as string,users.id)
          if(!result?.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (e: any) {
        next(e)

    }
}

const CustomerRunningAndOldOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {status}= req.query
        const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.CustomerRunningAndOldOrder(user.id,status as string )
          if(!result?.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (e: any) {
        next(e)

    }

}

const getSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ServiceOrder.getSingleOrder(req.params.id as string )
          if(!result?.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({ result })
    } catch (e: any) {
        next(e)
    }

}

export const OrderController = {
    createOrder,
    getOwnmealsOrder,
    UpdateOrderStatus,
    getAllOrder,
    customerOrderStatusTrack,
    CustomerRunningAndOldOrder,
    getSingleOrder
}