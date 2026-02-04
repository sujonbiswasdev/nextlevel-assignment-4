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

const getUserOrder = async (userid: string) => {
    const existingUser = await prisma.user.findUniqueOrThrow({
        where: { id: userid }
    })
    if (existingUser.role !== 'Provider') {
        throw new Error("user order get only Provider")
    }
    const result = await prisma.user.findUniqueOrThrow({
        where: {
            id: userid
        },
        include: {
            orders: true
        }
    })
    return result

}

const UpdateOrder = async (id: string, data: Partial<Order>, role: string) => {
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





export const ServiceOrder = {
    CreateOrder,
    getUserOrder,
    UpdateOrder
}