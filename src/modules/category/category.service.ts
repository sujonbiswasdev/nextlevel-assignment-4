import { Category } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const CreateCategory=async(data:{name:string},role:string)=>{
    if(role!=='Admin'){
        throw new Error("category create only admin")
    }
  return  await prisma.category.create({
        data
    })

}


const getCategory=async(role:string)=>{
    if(role!=='Admin'){
        throw new Error("category get only admin")
    }
  return  await prisma.category.findMany({include:{meals:true}})

}

const UpdateCategory=async(id:string,role:string,data:Partial<Category>)=>{
    const {name}=data;
    if(role!=='Admin'){
        throw new Error("category get only admin")
    }
    const existcategory=await prisma.category.findUniqueOrThrow({where:{id}})
    if(existcategory.name==name){
        throw new Error("category name already up to date")

    }
  const result = await prisma.category.update({
    where:{
        id
    },
    data:{
        name
    }
  })
  return result
}

const DeleteCategory=async(id:string,role:string)=>{
    if(role!=='Admin'){
        throw new Error("category delete only admin")
    }
  const result = await prisma.category.delete({
    where:{id}
  })
  return result

}


export const categoryService={CreateCategory,getCategory,UpdateCategory,DeleteCategory}