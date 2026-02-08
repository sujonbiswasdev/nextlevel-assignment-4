import { NextFunction, Request, Response } from "express"
import { providerService } from "./provider.service"

const createProvider = async (req: Request, res: Response,next:NextFunction) => {
    try {
         const user = req.user
        if (!user) {
           return res.status(401).json({ sucess: false, message: "you are unauthorized" })
        }
        const result =await providerService.createProvider(req.body,user.id)
         if(!result.sucess){
            res.status(400).json({result })
        }
        res.status(201).json({result})
    } catch (e:any) {
        next(e)
    }
}

const gelAllprovider=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result =await providerService.getAllProvider()
         if(!result.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({result})

    } catch (e:any) {
        e.Custommessage='Could not retrieve providers'
        next(e)
    }
}
const getProviderWithMeals=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result =await providerService.getProviderWithMeals(req.params.id as string)
         if(!result.sucess){
            res.status(400).json({result })
        }
        res.status(200).json({result})
    } catch (e:any) {
        e.Custommessage='retrieve provider profile with menu failed'
        next(e)
    }
}

export const providerController={createProvider,gelAllprovider,getProviderWithMeals}