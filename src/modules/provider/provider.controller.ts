import { NextFunction, Request, Response } from "express"
import { providerService } from "./provider.service"

const createProvider = async (req: Request, res: Response,next:NextFunction) => {
    try {
         const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await providerService.createProvider(req.body,user.id)
         if(!result.success){
           return res.status(400).json({result })
        }
       return res.status(201).json(result)
    } catch (e:any) {
        next(e)
    }
}

const gelAllprovider=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result =await providerService.getAllProvider()
         if(!result.success){
            return res.status(400).json(result )
        }
        return res.status(200).json(result)

    } catch (e:any) {
        next(e)
    }
}
const getProviderWithMeals=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result =await providerService.getProviderWithMeals(req.params.id as string)
         if(!result.success){
            return res.status(400).json(result )
        }
        return res.status(200).json(result)
    } catch (e:any) {
        next(e)
    }
}

const UpateProviderProfile=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await providerService.UpateProviderProfile(req.body,user.id)
         if(!result.success){
           return res.status(400).json(result )
        }
        return res.status(200).json(result)
    } catch (e:any) {
        next(e)
    }
}


const getOwnProviderProfile=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result =await providerService.getOwnProviderProfile(user.id)
         if(!result.success){
            return res.status(400).json(result )
        }
        return res.status(200).json(result)
    } catch (e:any) {
        next(e)
    }
}


export const providerController={createProvider,gelAllprovider,getProviderWithMeals,UpateProviderProfile,getOwnProviderProfile}