import { NextFunction, Request, Response } from "express"
import { StatsService } from "./stats.service"
import { catchAsync } from "../../shared/catchAsync"
import status from "http-status"
import { sendResponse } from "../../shared/sendResponse"

const getuserStats=catchAsync(async(req:Request,res:Response)=>{
    const user = req.user
    if (!user) {
         return res.status(status.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" })
    }
    const result = await StatsService.getuserStats(user.id)
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"retrieve user stats successfully",
        data:result
    })
}
)
const getmealsStats=catchAsync(async(req:Request,res:Response)=>{
       const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getmealsStats(user.id)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve meals stats successfully",
                data:result
            })
}
)


const getordersStats=catchAsync(async(req:Request,res:Response)=>{
     const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getordersStats(user.id)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve orders stats successfully",
                data:result
            })
}
)


const getrevenueStats=catchAsync(async(req:Request,res:Response)=>{
         const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getrevenueStats(user.id)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve revenue stats successfully",
                data:result
            })
}
)


const getreviewStats=catchAsync(async(req:Request,res:Response)=>{
         const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getcategoryStats(user.id)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve review stats successfully",
                data:result
            })
}
)

const getcategoryStats=catchAsync(async(req:Request,res:Response)=>{
         const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getrevenueStats(user.id)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve category stats successfully",
                data:result
            })
}
)


const getrevenueProviderStats=catchAsync(async(req:Request,res:Response)=>{
         const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getrevenueProviderStats(user.id)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve revenue provider stats successfully",
                data:result
            })
}
)

const getProvidermealsStats=catchAsync(async(req:Request,res:Response)=>{
         const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getProvidermealsStats(user.id)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve provider meals stats successfully",
                data:result
            })
}
)
const getProviderordersStats=catchAsync(async(req:Request,res:Response)=>{
         const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getProviderordersStats(user.id)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"retrieve provider order stats successfully",
                data:result
            })
}
)
export const StatsController={
    getuserStats,
    getmealsStats,
    getordersStats,
    getrevenueStats,
    getreviewStats,
    getcategoryStats,
    getrevenueProviderStats,
    getProvidermealsStats,
    getProviderordersStats
}