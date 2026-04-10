import { Request, Response } from "express";

export function Notfound(req:Request,res:Response){
    res.status(404).json({message:"route not found"})
}