import { Order } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const CreateOrder = async (payload: Omit<Order, 'id' | 'createdAt' | 'customerId'>, customerId: string) => {
    const existingUser = await prisma.user.findUniqueOrThrow({
        where: {
            id: customerId
        }
    })
    if (existingUser.role !== "Customer") {
        throw new Error("order create only Customer")
    }
    if (!existingUser) {
        throw new Error("customer not found")
    }

    const order = await prisma.order.create({
        data: {
            customerId,
            providerId: payload.providerId,
            status: payload.status,
            totalPrice: payload.totalPrice,
            quantity: payload.quantity,
            address: payload.address
        }
    })

    return order
}

const getUserOrder = async (customerid: string) => {
    const result = await prisma.order.findMany({
        where: {
            customerId: customerid
        }
    })
    return result
}

const getSingleOrder = async (id: string) => {
    const result = await prisma.order.findUniqueOrThrow({
        where: {
            id
        }
    })
    return result
}

const UpdateOrder = async (id: string, data: Partial<Order>, userid: string) => {
    const { status } = data;
    const getuser = await prisma.user.findUnique({
        where: {
            id: userid
        }
    })
    if (getuser?.id !== userid) {
        throw new Error("order userid and user id doesn't match")
    }
    const existorder = await prisma.order.findUniqueOrThrow({
        where: {
            id
        }
    })
    if (!existorder) {
        throw new Error('order not found')
    }
    if (existorder.status == status) {
        throw new Error("order status already up to date")
    }

    if (getuser.role == 'Customer') {

        if (status == "CANCELLED") {
            await prisma.order.update({
                where: {
                    id: id
                },
                data
            })
            const getorder = await prisma.order.findUnique({
                where: {
                    id
                },
                include: { customer: true, provider: true }
            })
            return getorder
        } else {
            throw new Error("Customer order update only CANCELLED")
        }
    }

    if (getuser.role == 'Provider' && status === 'CANCELLED') {
        throw new Error("you are doesn't status change CANCELLED")
    }
    await prisma.order.update({
        where: {
            id: id
        },
        data
    })

    const getorder = await prisma.order.findUnique({
        where: {
            id
        },
        include: { customer: true, provider: true }
    })
    return getorder


}


const ViewAllorders=async(role:string)=>{
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

export const ServiceOrder = {
    CreateOrder,
    getUserOrder,
    getSingleOrder,
    UpdateOrder,
    ViewAllorders
}