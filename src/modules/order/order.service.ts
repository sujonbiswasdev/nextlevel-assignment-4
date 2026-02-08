import z from "zod";
import { Order, Orderitem } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { formatZodIssues } from "../../utils/handleZodError";

const CreateOrder = async (mealid: string, payload: Omit<Order & Orderitem, 'id' | 'createdAt' | 'customerId'>, customerId: string) => {

    const orderData = z.object({
        address: z.string(),
        quantity: z.number().default(0)
    });
    const parseData = orderData.safeParse(payload)
    if (!parseData.success) {
        return {
            success: false,
            message: `your provided data is invalid`,
            data: formatZodIssues(parseData.error)
        }
    }


    const existingUser = await prisma.user.findUniqueOrThrow({
        where: {
            id: customerId
        }
    })
    if (!existingUser) {
        throw new Error("customer user not found")
    }
    const mealsData = await prisma.meal.findUnique({ where: { id: mealid }, include: { provider: { select: { id: true } } } })
    if (!mealsData) {
        throw new Error('meals data not found')
    }
    const result = await prisma.order.create({
        data: {
            customerId: existingUser.id,
            providerId: mealsData!.provider!.id!,
            orderitem: {
                create: [
                    {
                        price: Number(mealsData!.price),
                        quantity: parseData.data.quantity,
                        mealId: mealid,

                    }
                ]
            },
            totalPrice: Number(mealsData!.price) * Number(parseData.data.quantity),
            address: parseData.data.address

        },
        include: {
            orderitem: true
        }
    })

    return {
        sucess: true,
        message: `your order has been created sucessfully`,
        result
    }
}

const getOwnmealsOrder = async (userid: string) => {
    const result = await prisma.user.findUniqueOrThrow({
        where: { id: userid },
        include: {
            orders: {
                include: {
                    orderitem: {select:{orderId:true,quantity:true,meal:{select:{id:true,meals_name:true,description:true,isAvailable:true,category_name:true}},price:true},orderBy:{createdAt:"desc"}},
                },
                orderBy:{
                    createdAt:"desc"
                }
            }
        },

    })

    return {
        sucess: true,
        message:`your own meals orders retrieve successfully`,
        result
    }
}

const UpdateOrderStatus = async (id: string, data: Partial<Order>, role: string) => {
    console.log(role)
    const { status } = data;
    const statusValue = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]
    if (!statusValue.includes(status as string)) {
        throw new Error("please check your status")
    }
    const existingOrder = await prisma.order.findUniqueOrThrow({ where: { id } })
    if (existingOrder?.status == status) {
        throw new Error("Order status already up to date")
    }
    if (role == 'Customer' && status !== 'CANCELLED') {
        throw new Error("Customer can status change CANCELLED")
    }
    if (role == 'Customer' && status == 'CANCELLED') {
        const result = await prisma.order.update({
            where: {
                id
            },
            data: {
                status
            }
        })
        return {
            sucess: true,
            message: result ? `update order status successfully` : `update order status fail`,
            result
        }
    }

    if (role == 'Provider' && status === 'CANCELLED') {
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
            return {
                sucess: true,
                message: result ? `update order status successfully` : `update order status fail`,
                result
            }
        }

    }



}



const getAllorder = async (role: string) => {
    if (role !== 'Admin') {
        throw new Error("view all order only Admin")
    }
    const result = await prisma.order.findMany({
        include: {
            orderitem: true
        }, orderBy: {
            createdAt: 'desc'
        }
    })
    return {
        sucess: true,
        message:`retrieve all order successfully`,
        result
    }
}


const customerOrderStatusTrack = async (mealid: string, userid: string) => {
    const result = await prisma.order.findMany({
        include: {
            orderitem: {
                where: {
                    mealId: mealid
                },
                select: {
                    mealId: true,
                    price: true,
                    quantity: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },

        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return {
        sucess: true,
        message: result ? `customer order status track sucessfully` : `customer order status track fail`,
        result
    }
}


const CustomerRunningAndOldOrder = async (userid: string, status: string) => {
    const andConditions: any[] = []
    let message = 'customer running and old order retrieve successfully'
    let currentStatus = status
    if (status == 'DELIVERED') {
        andConditions.push({ status: status })
        message = 'Recent order information retrieved successfully.',
            currentStatus = status
    }
    if (status == 'CANCELLED') {
        andConditions.push({ status: status })
        message = 'CANCELLED order information retrieved successfully.',
            currentStatus = status
    }

    if (status == 'PLACED' || status == 'PREPARING' || status == 'READY') {

        andConditions.push({ status: status })
        message = 'running order retrieved successfully.',
            currentStatus = status
    }
    const result = await prisma.order.findMany({
        where: {
            customerId: userid,
            AND: andConditions
        },
        include: {
            orderitem: { orderBy: { createdAt: "desc" } },
        }
    })

    return {
        sucess: true,
        message,
        result
    }
}

const getSingleOrder = async (id: string) => {

    const result = await prisma.order.findUniqueOrThrow({ where: { id }, include: { orderitem: {select:{
        meal:true,
        orderId:true,
        price:true,
        quantity:true
    },orderBy:{createdAt:'desc'}}} })
    return {
        sucess: true,
        message: `single order retrieve sucessfully`,
        result
    }
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