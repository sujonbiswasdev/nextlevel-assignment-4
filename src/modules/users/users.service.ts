import { User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const getAllUser=async(role:string)=>{
    if(role!=='Admin'){
        throw new Error("get all users only admin")
    }
    const result =await prisma.user.findMany({
        include:{
            provider:true
        }
    })
    return result
}

const UpdateUser=async(role:string,id:string,data:Partial<User>)=>{
    const {status}=data
    const statusvalue=['suspend',"activate"]
    if(role!=='Admin'){
        throw new Error("get all users only admin")
    }
    const existuser=await prisma.user.findUniqueOrThrow({
        where:{id}
    })
     if (existuser.status == status) {
        throw new Error("user status already up to date")
    }

    if(status && !statusvalue.includes(status)){
        throw new Error("please check your status,status will be suspend and activate ")
    }
    const result =await prisma.user.update({
        where:{
            id
        },
        data:{
            status
        }
    })
    return result
}
export const UserService={
    getAllUser,
    UpdateUser
}