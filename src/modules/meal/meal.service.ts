import { prisma } from "../../lib/prisma"

const createMeal=async(payload:{name:string,description:string,price:number,isAvailable:boolean,dietaryPreference?:string,providerId:string,categoryId:string})=>{
  return  await prisma.meal.create({
        data:{
            ...payload  
        }
    })

}

export const mealService={createMeal}