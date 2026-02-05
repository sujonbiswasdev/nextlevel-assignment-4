import { Category } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const CreateCategory=async(data:{name:string},role:string,adminId:string)=>{
    const existAdminUser=await prisma.user.findUniqueOrThrow({where:{id:adminId}})
    if(role!=='Admin' || existAdminUser.id!==adminId){
        throw new Error(role?"category create only admin":"admin user not found")
    }
  return  await prisma.category.create({
        data:{
            name:data.name,
            adminId:adminId
        }
    })

}


const getCategory=async()=>{

  return  await prisma.category.findMany({include:{meals:true,user:true}})

}

const SingleCategory=async(id:string)=>{
  const result = await prisma.category.findFirstOrThrow({
    where:{id},
    include:{meals:true,user:true}
  })
  return result

}

const UpdateCategory=async(id:string,data:Partial<Category>)=>{
    if(!data.name){
        throw new Error("please provide a valid property")
    }
    const {name}=data;
    const existcategory=await prisma.category.findUniqueOrThrow({where:{id}})
    if(existcategory.name==name){
        throw new Error("Category name is already up to date.")

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

const DeleteCategory=async(id:string)=>{
    const existingUser=await prisma.category.findUniqueOrThrow({where:{id}})
    if(existingUser.id!==id){
        throw new Error("category user not found")
    }
  const result = await prisma.category.delete({
    where:{id}
  })
  return result

}


export const categoryService={CreateCategory,getCategory,UpdateCategory,DeleteCategory,SingleCategory}