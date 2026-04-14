import { NextFunction, Request, Response } from "express";
import { ServiceOrder } from "./order.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import paginationSortingHelper from "../../helpers/paginationHelping";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    if (!user) {
        return res.status(status.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" })
    }
    const result = await ServiceOrder.CreateOrder(req.body, user.email as string)
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
    const {search}=req.query
    if (!user) {
        return res.status(status.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" })
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
    const result = await ServiceOrder.getOwnmealsOrder(user.email as string,req.query as any, page, limit, skip, sortBy, sortOrder,search as string)
    sendResponse(res,{
        httpStatusCode: status.OK,
        success: true,
        message: "your own meals orders retrieve successfully",
        data: result
   

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
                    data:result
                    })
            }
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve single order successfully",
                data:result?.result
            })
} )

const getOwnPayment = catchAsync(async (req: Request, res: Response) => {
    const email = req.user?.email;
    const result = await ServiceOrder.getOwnPaymentService(req.params.id as string,email as string);
  
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Fetched own payment participants successfully",
      data: result,
    });
  });

export const OrderController = {
    createOrder,
    getOwnmealsOrder,
    UpdateOrderStatus,
    getAllOrder,
    customerOrderStatusTrack,
    CustomerRunningAndOldOrder,
    getSingleOrder,
    getOwnPayment
}