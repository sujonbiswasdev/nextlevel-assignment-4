import { NextFunction, Request, Response } from "express"
import { providerService } from "./provider.service"

const createProvider = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const users=req.user
        if(!users){
            throw new Error("user Not found")
        }
        const result =await providerService.createProvider(req.body,users.id)
        res.status(201).json(result)
    } catch (e:any) {
        next(e)
    }
}

export const providerController={createProvider}