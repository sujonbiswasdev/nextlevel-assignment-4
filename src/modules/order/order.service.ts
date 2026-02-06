import { Order, Orderitem } from "../../../generated/prisma/client";
import { OrderWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const CreateOrder = async (mealid:string,payload: Omit<Order & Orderitem, 'id' | 'createdAt' | 'customerId'>, customerId: string) => {
    const existingUser = await prisma.user.findUniqueOrThrow({
        where: {
            id: customerId
        }
    })
    const existmeal=await prisma.meal.findUnique({where:{id:mealid},include:{provider:true}})
    if (existingUser.role !== "Customer") {
        throw new Error("order create only Customer")
    }
    if (!existingUser) {
        throw new Error("customer not found")
    }

    const order = await prisma.order.create({
        data: {
            customerId,
            providerId: existmeal?.provider.id!,
            orderitem:{create:[
                {
                    price:Number(existmeal?.price),
                    quantity:Number(payload.quantity),
                    mealId:mealid,
                    
                }
            ]},
            status:payload.status,
            totalPrice:Number(existmeal?.price)*Number(payload.quantity),
            address:payload.address

        },
        include:{
            orderitem:true,
            customer:true
        }
    })

    return order
}

const getOwnmealsOrder = async (userid: string) => {
    const existingUser = await prisma.user.findUniqueOrThrow({
        where: { id: userid },
        include:{
            provider:true
        },
    })

    const ownproviderorder=await prisma.providerProfile.findUnique({
        where:{
            id:existingUser.provider?.id as string
        },
        include:{
            orders:{
                orderBy:{createdAt:"desc"},
                include:{
                    orderitem:true
                }
            },
        },
        
    })


    return ownproviderorder
}

const UpdateOrderStatus = async (id: string, data: Partial<Order>, role: string) => {
    console.log(role)
    const { status } = data;
    const statusValue = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]
    if (!statusValue.includes(status as string)) {
        throw new Error("please check your status")
    }
    const existingOrder = await prisma.order.findUnique({ where: { id } })

    if (existingOrder?.status == status) {
        throw new Error("Order status already up to date")
    }
    if(role=='Customer' && status!=='CANCELLED'){
        throw new Error("Customer can status change CANCELLED")
    }
     if (role == 'Customer' && status=='CANCELLED') {
            const result = await prisma.order.update({
                where: {
                    id
                },
                data: {
                    status
                }
            })
            return result
    }

    if(role=='Provider' && status==='CANCELLED'){
        throw new Error("please check your role and status")
    }

    if (role == 'Provider') {
        if (status == 'PLACED' || status == 'PREPARING' || status == 'READY' || status == 'DELIVERED') {
            const result = await prisma.order.update({
                where: {
                    id
                },
                data: {
                    status
                }
            })
            return result
        }

    }

   

}



const getAllorder = async (role:string) => {
    if (role !== 'Admin') {
        throw new Error("view all order only Admin")
    }
    const result = await prisma.order.findMany({include:{
        orderitem:true
    },orderBy:{createdAt:'desc'
    }})
    return result
}


const customerOrderStatusTrack = async (mealid:string,userid:string) => {
    const orderitem=await prisma.orderitem.findMany({
        where:{
            mealId:mealid,
            order:{
                customerId:userid
            },
        },
        include:{
            order:{
                include:{
                    customer:true,
                    orderitem:{orderBy:{createdAt:"desc"}}
                }
            }
        }
    })

    return orderitem
}


const CustomerRunningAndOldOrder = async (userid:string,status:string) => {
    const andConditions:any[]=[]
     let message = ''
     let currentStatus = status
    if(status=='DELIVERED'){
        andConditions.push({status:status})
       message='Recent order information retrieved successfully.',
       currentStatus=status
    }

      if(status=='CANCELLED'){
        andConditions.push({status:status})
       message='CANCELLED order information retrieved successfully.',
       currentStatus=status
    }

    if(status=='PLACED' || status=='PREPARING' || status=='READY'){
       
        andConditions.push({status:status})
       message='running order retrieved successfully.',
       currentStatus=status
    }
    const orderitem=await prisma.order.findMany({
        where:{
           customerId:userid,
            AND:andConditions
        },
        include:{
          orderitem:{orderBy:{createdAt:"desc"}},
        }
    })

    return {
        data:orderitem,
        message,
        currentStatus
    }
}

const getSingleOrder = async (id:string) => {
    const result = await prisma.order.findUniqueOrThrow({where:{id},include:{orderitem:true}})
    return result
}


export const ServiceOrder = {
    CreateOrder,
    getOwnmealsOrder,
    UpdateOrderStatus,
    getAllorder,
    customerOrderStatusTrack,
    CustomerRunningAndOldOrder,
    getSingleOrder
}