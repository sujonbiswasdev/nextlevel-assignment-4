import { Order } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const CreateOrder=async(payload: Omit<Order, 'id' | 'createdAt' | 'customerId'>,customerId:string)=>{
   const existingUser=await prisma.user.findUniqueOrThrow({
    where:{
        id:customerId
    }
   })
   if(existingUser.role!=="Customer"){
    throw new Error("order create only Customer")
   }
   if(!existingUser){
    throw new Error("customer not found")
   }

    const order = await prisma.order.create({
    data:{
        customerId,
        providerId:payload.providerId,
        status:payload.status,
        totalPrice:payload.totalPrice,
        quantity:payload.quantity,
        address:payload.address
    }
   })

   return order
}





export const ServiceOrder={
    CreateOrder
}