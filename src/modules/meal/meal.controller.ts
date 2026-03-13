import { NextFunction, Request, Response } from "express"
import { mealService } from "./meal.service"
import paginationSortingHelper from "../../helpers/paginationHelping"
import { catchAsync } from "../../shared/catchAsync"
import { sendResponse } from "../../shared/sendResponse"
import status from "http-status"
import { IMealQueryRequest } from "./meal.interface"

const createMeal = catchAsync(async (req: Request, res: Response) => {
        const user = req.user
        if (!user) {
            return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result = await mealService.createMeal(req.body, user.id as string)
        sendResponse(res,{
            httpStatusCode: status.CREATED,
            success:true,
            message:"your meal has been created",
            data:result
        })

})

const UpdateMeals = catchAsync(async(req:Request,res:Response)=>{
    const user=req.user
    if(!user){
        return res.status(status.UNAUTHORIZED).json({success:false,message:"you are not authorized"})
    }
    const result = await mealService.UpdateMeals(req.body,req.params.id as string)
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"meal update successfully",
        data:result
    })
})

const DeleteMeals = catchAsync(async(req:Request,res:Response)=>{
    const user=req.user
    if(!user){
        return res.status(status.UNAUTHORIZED).json({
            success:false,
            message:"you are unauthorized"
        })
    }
    const result = await mealService.DeleteMeals(user.id)
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"your meal delete has been successfully",
        data:result
    })
})

const Getallmeals = catchAsync(async(req:Request,res:Response)=>{

 const isAvailable = req.query.isAvailable
            ? req.query.isAvailable === 'true'
                ? true
                : req.query.isAvailable == 'false'
                    ? false
                    : undefined :
            undefined

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const result = await mealService.getAllmeals(req.query as any, isAvailable as boolean, page, limit, skip, sortBy, sortOrder)
        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:" retrieve all meals successfully",
            data:result
        })


})


// const getAllMealsForAdmin = async (req: Request, res: Response, next: NextFunction) => {
//     try {
        
//         const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

//         const result = await mealService.getAllMealsForAdmin(req.query as any, page, limit, skip, sortBy, sortOrder)
//         if (!result.success) {
//             res.status(400).json({ result })
//         }
//         res.status(200).json( result )
//     } catch (e: any) {
//         next(e)

//     }
// }


const GetSignlemeals = catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params
    const result =await mealService.getSinglemeals(id as string)
     sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:" retrieve single meal successfully",
            data:result
        })

})

const getownmeals = catchAsync(async (req:Request,res:Response)=>{
    const user=req.user
    if(!user){
        return res.status(status.UNAUTHORIZED).json({success:false,message:"you are unauthorized"})
    }
    const result =await mealService.getOwnMeals(user.id)
        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"your own meal retrieve has been successfully",
            data:result
        })
})

const updateStatus = catchAsync(async(req:Request,res:Response)=>{
    const user=req.user
    if(!user){
        return res.status(status.UNAUTHORIZED).json({success:false,message:"you are unauthorized"})
    }
    const {id}=req.params
    const result = await mealService.updateStatus(req.body,id as string)
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"meal status update successfully",
        data:result
    })
})
export const mealController = {
    createMeal,
    UpdateMeals,
    DeleteMeals,
    Getallmeals,
    GetSignlemeals,
    getownmeals,
    updateStatus
}