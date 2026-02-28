import z from "zod";
import { Order, Orderitem } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { formatZodIssues } from "../../utils/handleZodError";

const CreateOrder = async (payload: Omit<Order & Orderitem, 'id' | 'createdAt' | 'customerId'>, customerId: string) => {

    const orderData = z.object({
        items: z.array(z.object({
            mealId: z.string(),
            quantity: z.number().min(1),
            price: z.number().min(0)
        })).min(1),
        phone:z.string(),
        address: z.string(),
        first_name:z.string().optional(),
        last_name:z.string().optional()

    });
    const parseData = orderData.safeParse(payload)
    if (!parseData.success) {
        return {
            success: false,
            message: `your provided data is invalid`,
            data: formatZodIssues(parseData.error)
        }
    }

    const mealsData = await prisma.meal.findUnique({ where: { id:parseData.data.items[0].mealId }, include: { provider: { select: { id: true } } } })
    
    if (!mealsData) {
        throw new Error('meals data not found')
    }
    const result = await prisma.order.create({
        data: {
            customerId: customerId,
            providerId: mealsData!.provider!.id!,
            address:parseData.data.address,
            phone:parseData.data.phone,
            first_name:parseData.data.first_name,
            last_name:parseData.data.last_name,
            orderitem: {
                createMany: {
                    data: parseData.data.items.map((item) => ({
                        mealId: item.mealId,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            },
            totalPrice: parseData.data.items.reduce((sum, item) =>
                sum + (item.price * item.quantity), 0
            ),
        },
        include: {
            orderitem: {
                include: {
                    meal: {
                        select: {
                            meals_name: true,
                            cuisine: true,
                            price: true
                        }
                    }
                }
            },
            provider: true
        }
    })

    return {
        success: true,
        message: `your order has been created sucessfully`,
        result
    }
}

const getOwnmealsOrder = async (userid: string) => {
    const existingUser = await prisma.user.findUnique({
        where: { id: userid },
        include: { provider: true }
    })
    if (existingUser?.role == 'Customer') {
        const result = await prisma.order.findMany({
            where: {
                customerId: userid,
            },
            include: {
                orderitem: {
                    include: {
                        meal: true
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        return {
            success: true,
            message: `your own meals orders retrieve successfully`,
            result
        }
    }

    if (existingUser?.role == 'Provider') {
        const result = await prisma.order.findMany({
            where: {
                providerId: existingUser.provider?.id
            },
            include: {
                orderitem: {
                    include: {
                        meal: true
                    }
                }
            }
        })

        return {
            success: true,
            message: `your own meals orders retrieve successfully`,
            result
        }
    }
}

const UpdateOrderStatus = async (id: string, data: Partial<Order>, role: string) => {
    console.log(role, 'roledata')
    const { status } = data;
    console.log(status, 'status')
    const statusValue = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]
    if (!statusValue.includes(status as string)) {
        throw new Error("please check your status or provider your status")
    }
    const existingOrder = await prisma.order.findUnique({ where: { id } })
    console.log(existingOrder, 'existing order')

    if (existingOrder?.status == status) {
        throw new Error("Order status already up to date")
    }
    if (role == 'Customer' && status !== 'CANCELLED') {
        throw new Error("Customer can status change CANCELLED")
    }
    if (role == 'Customer' && status == 'CANCELLED') {
        if (existingOrder?.status == 'DELIVERED' || existingOrder?.status == 'PREPARING' || existingOrder?.status == 'READY') {
            throw new Error("you cannot change because status already running")
        }
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
        throw new Error("CANCELLED only Customer Change")
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
        message: `retrieve all order successfully`,
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

    const result = await prisma.order.findUniqueOrThrow({
        where: { id }, include: {
            orderitem: {
                select: {
                    meal: true,
                    orderId: true,
                    price: true,
                    quantity: true
                }, orderBy: { createdAt: 'desc' }
            }
        }
    })
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