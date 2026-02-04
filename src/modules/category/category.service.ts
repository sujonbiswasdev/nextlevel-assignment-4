import { prisma } from "../../lib/prisma"

const CreateCategory=async(payload:{name:string},role:string)=>{
    if(role!=='Admin'){
        throw new Error("category create only admin")
    }
  return  await prisma.category.create({
        data:{
            ...payload  
        }
    })

}

export const categoryService={CreateCategory}