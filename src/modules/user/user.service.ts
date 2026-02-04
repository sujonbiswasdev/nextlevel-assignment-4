import { User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const GetAllUsers=async()=>{
  return  await prisma.user.findMany({
    include:{
        provider:true
    }
  })

}

const UpdateUser=async(id:string,role:string,data:Partial<User>)=>{
  const {status}=data
 const curentUser = await prisma.user.findUniqueOrThrow({
  where:{id}
 })
 if(role!=="Admin"){
  throw new Error("status change only Admin")
 }
 if(curentUser.status==status){
  throw new Error("user already up to date")
 }
 const statusValue=["activate","suspend"]
 if(!statusValue.includes(status as string)){
  throw new Error("please check your status")
 }
 if(status=='activate'){
  const result = await prisma.user.update({
  where:{
    id
  },
  data:{
    status:status,
    isActive:true
  }
 })
 return result
 }
 if(status=='suspend'){

   const result = await prisma.user.update({
  where:{
    id
  },
  data:{
    status,
    isActive:false
  }
 })
 return result

 }


}


export const UserService={GetAllUsers,UpdateUser}