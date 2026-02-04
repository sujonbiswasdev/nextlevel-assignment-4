import { NextFunction, Request, Response } from "express";
import { ServiceOrder } from "./order.service";

const createOrder=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const users= req.user
        if(!users){
            res.status(401).json({sucess:false,message:"you are unauthorized"})
        }
        const result = await ServiceOrder.CreateOrder(req.body,users?.id as string)
        res.status(201).json({sucess:true,message:"order create sucessfully",result})
    } catch (e:any) {
        e.Custommessage=e.message || "order create fail"
        next(e)
        
    }

}


export const OrderController={
    createOrder
}