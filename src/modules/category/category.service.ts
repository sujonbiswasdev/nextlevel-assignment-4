import { prisma } from "../../lib/prisma"

const CreateCategory=async(data:{name:string},role:string)=>{
    if(role!=='Admin'){
        throw new Error("category create only admin")
    }
  return  await prisma.category.create({
        data
    })

}

export const categoryService={CreateCategory}