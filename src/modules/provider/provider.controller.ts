import { NextFunction, Request, Response } from "express"
import { providerService } from "./provider.service"

const createProvider = async (req: Request, res: Response,next:NextFunction) => {
    try {
         const users = req.user
        if (!users) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await providerService.createProvider(req.body,users.id)
        res.status(201).json({message:"provider profile complete sucessfully",result})
    } catch (e:any) {
        e.Custommessage='provider profile complete failed'
        next(e)
    }
}

const gelAllprovider=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result =await providerService.getAllProvider()
        res.status(200).json({message:"retrieve all provider sucessfully",result})
    } catch (e:any) {
        e.Custommessage='Could not retrieve providers'
        next(e)
    }
}
const getProviderWithMeals=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result =await providerService.getProviderWithMeals(req.params.id as string)
        res.status(200).json({message:"retrieve provider profile with menu sucessfully",result})
    } catch (e:any) {
        e.Custommessage='retrieve provider profile with menu failed'
        next(e)
    }
}

export const providerController={createProvider,gelAllprovider,getProviderWithMeals}