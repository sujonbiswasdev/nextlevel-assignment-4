import { Request, Response } from "express"
import { StatsService } from "./stats.service"

const getuserStats=async(req:Request,res:Response)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getuserStats(user.id)
        res.status(200).json({sucess:true,message:"retrieve users stats sucessfully",result})
    } catch (error) {
        res.status(400).json({sucess:false,message:"retrieve users stats failed"})
    }
}

const getmealsStats=async(req:Request,res:Response)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getmealsStats(user.id)
        res.status(200).json({sucess:true,message:"retrieve meals stats sucessfully",result})
    } catch (error) {
        res.status(400).json({sucess:false,message:"retrieve meals stats failed"})
    }
}

const getordersStats=async(req:Request,res:Response)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getordersStats(user.id)
        res.status(200).json({sucess:true,message:"retrieve orders stats sucessfully",result})
    } catch (error) {
        res.status(400).json({sucess:false,message:"retrieve orders stats failed"})
    }
}

const getrevenueStats=async(req:Request,res:Response)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getrevenueStats(user.id)
        res.status(200).json({sucess:true,message:"retrieve revenue stats sucessfully",result})
    } catch (error) {
        res.status(400).json({sucess:false,message:"retrieve revenue stats failed"})
    }
}

const getreviewStats=async(req:Request,res:Response)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getreviewStats(user.id)
        res.status(200).json({sucess:true,message:"retrieve reviews stats sucessfully",result})
    } catch (error) {
        res.status(400).json({sucess:false,message:"retrieve reviews stats failed"})
    }
}

const getcategoryStats=async(req:Request,res:Response)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await StatsService.getcategoryStats(user.id)
        res.status(200).json({sucess:true,message:"retrieve category stats sucessfully",result})
    } catch (error) {
        res.status(400).json({sucess:false,message:"retrieve category stats failed"})
    }
}
export const StatsController={
    getuserStats,
    getmealsStats,
    getordersStats,
    getrevenueStats,
    getreviewStats,
    getcategoryStats
}