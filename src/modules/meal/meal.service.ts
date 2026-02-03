import { Meal } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createMeal=async(payload:{name:string,description:string,price:number,isAvailable:boolean,dietaryPreference?:string,providerId:string,categoryId:string})=>{
  return  await prisma.meal.create({
        data:{
            ...payload  
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
export const mealService={createMeal,UpdateMeals,DeleteMeals}