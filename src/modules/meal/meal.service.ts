import { Meal } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createMeal=async(data:{name:string,description:string,price:number,isAvailable:boolean,dietaryPreference?:string,categoryId:string},userid:string)=>{
    const providerid=await prisma.user.findUniqueOrThrow({where:{id:userid},include:{provider:true}})
  return  await prisma.meal.create({
        data:{
            ...data,
            providerId:providerid.provider?.id as string
        }
    })

}

const UpdateMeals=async(data:Partial<Meal>,mealid:string)=>{
    if(!mealid){
        throw new Error("mealid not found")
    }
    return  await prisma.meal.update({
    where:{
        id:mealid
    },
    data  
        
    })

}

const DeleteMeals=async(mealid:string)=>{
   
    const existmeal= await prisma.meal.findUnique({
        where:{
            id:mealid
        }
    })
    console.log(existmeal)
     if(!existmeal?.id){
        throw new Error("mealid not found")
    }

    if(existmeal?.id!==mealid){
        throw new Error('mealid is invalid,please check your mealid')
    }
    return  await prisma.meal.delete({
    where:{
        id:mealid
    }    
    })

}

const getAllmeals=async()=>{
   return await prisma.meal.findMany()
}

const getSinglemeals=async(id:string)=>{
   return await prisma.meal.findUniqueOrThrow({
    where:{
        id
    }
   })
}
export const mealService={
    createMeal,
    UpdateMeals,
    DeleteMeals,
    getAllmeals,
    getSinglemeals
}