import { NextFunction, Request, Response } from "express"
import { providerService } from "./provider.service"
import { sendResponse } from "../../shared/sendResponse"
import status from "http-status"
import { catchAsync } from "../../shared/catchAsync"

const createProvider = catchAsync(async (req: Request, res: Response) => {
            const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await providerService.createProvider(req.body,user.id)
            sendResponse(res,{
                httpStatusCode:status.CREATED,
                success:true,
                message:"your provider profile has been created",
                data:result
            })
}
)

const gelAllprovider=catchAsync(async(req:Request,res:Response)=>{
    const result =await providerService.getAllProvider()
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"retrieve all provider successfully",
        data:result
    })
}
)
const getProviderWithMeals=catchAsync(async(req:Request,res:Response)=>{
     const result =await providerService.getProviderWithMeals(req.params.id as string)
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"retrieve provider with meals successfully",
        data:result
    })
}
)

const UpateProviderProfile=catchAsync(async(req:Request,res:Response)=>{
    const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await providerService.UpateProviderProfile(req.body,user.id)
    if(!result){
        sendResponse(res,{
            httpStatusCode:status.BAD_REQUEST,
            success:false,
            message:"update provider profile failed",
            data:result
        })
    }
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"update provider profile successfully",
        data:result
    })
})

export const providerController={createProvider,gelAllprovider,getProviderWithMeals,UpateProviderProfile}