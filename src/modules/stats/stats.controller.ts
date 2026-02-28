import { NextFunction, Request, Response } from "express"
import { StatsService } from "./stats.service"

const getuserStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getuserStats(user.id)
         if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,message:"retrieve users stats successfully",result})
    } catch (error:any) {
        next(error)
    }
}

const getmealsStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getmealsStats(user.id)
         if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,message:"retrieve meals stats successfully",result})
    } catch (error:any) {
        next(error)
    }
}

const getordersStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getordersStats(user.id)
         if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,message:"retrieve orders stats successfully",result})
    } catch (error:any) {
        next(error)
    }
}

const getrevenueStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getrevenueStats(user.id)
         if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,message:"retrieve revenue stats successfully",result})
    } catch (error:any) {
        next(error)
    }
}

const getreviewStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getreviewStats(user.id)
         if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,message:"retrieve reviews stats successfully",result})
    } catch (error:any) {
        next(error)
    }
}

const getcategoryStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getcategoryStats(user.id)
        //  if(!result){
        //     res.status(400).json({result })
        // }
        res.status(200).json({success:true,message:"retrieve category stats successfully",result})
    } catch (error:any) {
     
        next(error)
    }
}


const getrevenueProviderStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getrevenueProviderStats(user.id)
         if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,message:"retrieve revenue stats successfully",result})
    } catch (error:any) {
        next(error)
    }
}


const getProvidermealsStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getProvidermealsStats(user.id)
         if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,message:"retrieve  meals stats successfully",result})
    } catch (error:any) {
        next(error)
    }
}

const getProviderordersStats=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getProviderordersStats(user.id)
         if(!result){
            res.status(400).json({result })
        }
        res.status(200).json({success:true,message:"retrieve  orders stats successfully",result})
    } catch (error:any) {
        next(error)
    }
}
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