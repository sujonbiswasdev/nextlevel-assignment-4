import { NextFunction, Request, Response } from "express";
import { ServiceOrder } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user
        if (!users) {
            res.status(401).json({ sucess: false, message: "you are unauthorized" })
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
            res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.getUserOrder(users?.id as string)
        res.status(201).json({ sucess: true, message: "user orders get sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "user orders get fail"
        next(e)

    }

}
const getSigleOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ServiceOrder.getSingleOrder(req.params.id as string)
        res.status(201).json({ sucess: true, message: "sigle order get sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "sigle order get fail"
        next(e)

    }

}

const UpdateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
          const users = req.user
        if (!users) {
            res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.UpdateOrder(req.params.id as string,req.body,users?.id as string)
        res.status(201).json({ sucess: true, message: "sigle order get sucessfully", result })
    } catch (e: any) {
        e.Custommessage = e.message || "sigle order get fail"
        next(e)

    }

}


const ViewAllorders=async(req:Request,res:Response,next:NextFunction)=>{
    try {
          const users = req.user
        if (!users) {
            res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await ServiceOrder.ViewAllorders(users?.role as string)
        res.status(200).json({sucess:true,message:" get all users sucessfully",result})
    } catch (e:any) {
          e.customMessage=`${e.message}`||'admin only get'
         next(e)
    }
}

export const OrderController = {
    createOrder,
    getUserOrder,
    getSigleOrder,
    UpdateOrder,
    ViewAllorders
}