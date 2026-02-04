import { prisma } from "../../lib/prisma"

const CreateCategory=async(role:string,data:{name:string})=>{
    if(role!=='Admin'){
        throw new Error("category create just Admin only")
    }
    const result = await prisma.category.create({
        data
    })
    return result
    
}
export const CategoryService={
    CreateCategory
}