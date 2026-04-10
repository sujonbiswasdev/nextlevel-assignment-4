import { NextFunction, Request, Response } from "express";
import { ServiceOrder } from "./order.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    if (!user) {
        return res.status(status.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" })
    }
    const result = await ServiceOrder.CreateOrder(req.body, user.id as string)
    sendResponse(res,{
        httpStatusCode:status.CREATED,
        success:true,
        message:'your order has been created successfully',
        data:result
    })
}
)


const getOwnmealsOrder = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    if (!user) {
        return res.status(status.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" })
    }
    const result = await ServiceOrder.getOwnmealsOrder(user.id as string)
    sendResponse(res,{
        httpStatusCode:status.OK
        ,success:result?.success as boolean,
        message:result?.message as string,
        data:result?.result

    })
})


const UpdateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    if (!user) {
        return res.status(status.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" })
    }
    const result = await ServiceOrder.UpdateOrderStatus(req.params.id as string, req.body, user.role as string)
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"update order status successfully",
        data:result
    })
}
)
const getAllOrder = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    if (!user) {
        return res.status(status.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" })
    }
    const result = await ServiceOrder.getAllorder(user.role)
    if (!result) {
        sendResponse(res,{
            httpStatusCode:status.BAD_REQUEST,
            success:false,
            message:"retrieve all orders failed",
            data:result

        })
    }
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"retrieve all orders successfully",
        data:result
    })
}
)


const customerOrderStatusTrack = catchAsync(async (req: Request, res: Response) => {
     const users = req.user
        if (!users) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.customerOrderStatusTrack(req.params.id as string,users.id)
            if(!result?.success){
                sendResponse(res,{
                    httpStatusCode:status.BAD_REQUEST,
                    success:false,
                    message:result?.message as string,
                    data:result?.result
                })
            }
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"customer order status track successfully",
                data:result?.result
            })
}
)


const CustomerRunningAndOldOrder = catchAsync(async (req: Request, res: Response) => {
        const user = req.user
        if (!user) {
           return res.status(status.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.CustomerRunningAndOldOrder(user.id,req.query.status as string)
            if(!result.success){
                sendResponse(res,{
                    httpStatusCode:status.BAD_REQUEST,
                    success:false,
                    message:"customer order status track failed",
                    data:result?.result
                    })
            }
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:result.message,
                data:result?.result
            })
}
)
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result = await ServiceOrder.getSingleOrder(req.params.id as string )
            if(!result.success){
                sendResponse(res,{
                    httpStatusCode:status.BAD_REQUEST,
                    success:false,
                    message:"retrieve single order failed",
                    data:result?.result
                    })
            }
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve single order successfully",
                data:result?.result
            })
} )

export const OrderController = {
    createOrder,
    getOwnmealsOrder,
    UpdateOrderStatus,
    getAllOrder,
    customerOrderStatusTrack,
    CustomerRunningAndOldOrder,
    getSingleOrder
}