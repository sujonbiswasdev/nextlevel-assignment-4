import { v6 as uuidv6 } from 'uuid';
import { Order, Orderitem } from "../../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { formatZodIssues } from "../../utils/handleZodError";
import { CreateorderData } from "./order.validation";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { ICreateorderData } from "./order.interface";
import { OrderWhereInput } from "../../../../generated/prisma/models";
import { parseDateForPrisma } from "../../utils/parseDate";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";

const CreateOrder = async (payload: ICreateorderData, email: string) => {
  const exisUser=await prisma.user.findUnique({
    where:{
      email:email
    }
  })
  const customerId=exisUser?.id
  const mealItem = payload.items.find((i) => i.mealId);

  if (!mealItem) {
    throw new AppError(400, "MealId is required");
  }

  const existingMeal = await prisma.meal.findUnique({
    where: {
      id: mealItem.mealId,
    },
  });

  if (!existingMeal) {
    throw new AppError(
      status.NOT_FOUND,
      `Meal with id (${mealItem.mealId}) does not exist.`
    );
  }

  try {
    const isFree = Number(existingMeal.deliverycharge) === 0;
    const finalPayment = isFree ? "PAID" : "UNPAID";
    const deliveryCharge = isFree ? 0 : existingMeal.deliverycharge;

    const result = await prisma.$transaction(async (tx) => {
      // ✅ MUST use tx here
      const orderData = await tx.order.create({
        data: {
          customerId: customerId as string, // ensure not undefined
          providerId: existingMeal.providerId,
          address: payload.address,
          phone: payload.phone,
          paymentStatus: finalPayment,
          first_name: payload.first_name ?? null,
          last_name: payload.last_name ?? null,
          orderitem: {
            createMany: {
              data: payload.items.map((item) => ({
                mealId: item.mealId,
                price: existingMeal.price,
                quantity: item.quantity,
              })),
            },
          },
          totalPrice:
            existingMeal.price *
            payload.items.reduce((acc, item) => acc + item.quantity, 0),
        },
      });
 

      // ✅ যদি free হয়, Stripe লাগবে না
      if (isFree) {
        return {
          orderData,
          paymentData: null,
          paymentUrl: null,
        };
      }

      const transactionId = String(uuidv6());

      const paymentData = await tx.payment.create({
        data: {
          orderId: orderData.id,
          amount: deliveryCharge,
          transactionId,
          mealId: existingMeal.id,
          userId: customerId as string, // ensure string, not undefined
        },
      });
 

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: {
                name: `Meal: ${existingMeal.meals_name}`,
              },
              unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderId: orderData.id,
          paymentId: paymentData.id,
        },
        payment_intent_data: {
          metadata: {
            orderId: orderData.id,
            paymentId: paymentData.id,
          },
        },

        // ✅ FIXED URL
        success_url: `${envVars.FRONTEND_URL}/payment-success?orderId=${orderData.id}&paymentId=${paymentData.id}`,
        cancel_url: `${envVars.FRONTEND_URL}/payment-cancel?orderId=${orderData.id}&paymentId=${paymentData.id}`,
      });

      console.log("Stripe URL:", session.url); // 🔥 debug

      return {
        orderData,
        paymentData,
        paymentUrl: session.url,
      };
    });

    return {
      order: result.orderData,
      payment: result.paymentData,
      paymentUrl: result.paymentUrl,
    };
  } catch (error) {
    console.error(error);
    throw new AppError(500, "Something went wrong, please try again");
  }
};

const getOwnmealsOrder = async (
  email?:string,
  data?: Record<string, any>,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?:string | undefined
) => {


  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { provider: true },
  });
  if (!existingUser) {
    return {
      success: false,
      message: "User not found",
      result: null,
    };
  }

  const andConditions: OrderWhereInput[]  = [];

  if (search) {
    const orConditions: any[] = [];
    orConditions.push(
      {
        first_name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        last_name: {
          contains: search,
          mode: "insensitive",
        },
      },
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }

  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status,
      },
    });
  }
  if (data?.totalPrice) {
    andConditions.push({
      totalPrice: {
        gte: 0,
        lte: Number(data.price),
      },
    });
  }

  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (existingUser?.role == "Customer") {
    const result = await prisma.order.findMany({
      where: {
        customerId: existingUser.id,
        AND:andConditions
      },
      include: {
        orderitem: {
          include: {
            meal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: `your own meals orders retrieve successfully`,
      result,
    };
  }

  if (existingUser?.role == "Provider") {
    const result = await prisma.order.findMany({
      take: limit,
      skip,
      where: {
        providerId: existingUser.provider?.id,
        AND:andConditions
      },
      include: {
        orderitem: {
          include: {
            meal: true,
          },
        },
      },
    });
    let total = 0;
    if (existingUser?.role === "Provider") {
      total = await prisma.order.count({
        where: {
          providerId: existingUser.provider?.id,
          AND: andConditions,
        },
      });
    } else if (existingUser?.role === "Customer") {
      total = await prisma.order.count({
        where: {
          customerId: existingUser.id,
          AND: andConditions,
        },
      });
    }
    return {
      result,
      pagination: {
        total,
        page,
        limit,
        totalpage: Math.ceil(total / (limit || 1)),
      },
    };
  }
};

const UpdateOrderStatus = async (
  id: string,
  data: Partial<Order>,
  role: string,
) => {
  const { status } = data;
  const statusValue = [
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!statusValue.includes(status as string)) {
    throw new AppError(400, "invalid status value");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError(404, "no order found for this id");
  }

  if (existingOrder?.status == status) {
    throw new AppError(409, `order already ${status}`);
  }
  if (role == "Customer" && status !== "CANCELLED") {
    throw new AppError(400, "Customer can only change status to CANCELLED");
  }
  if (role == "Customer" && status == "CANCELLED") {
    if (
      existingOrder?.status == "DELIVERED" ||
      existingOrder?.status == "PREPARING" ||
      existingOrder?.status == "READY"
    ) {
      throw new AppError(
        400,
        `you can't cancel order when order status is ${existingOrder.status}`,
      );
    }
    const result = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    return result;
  }

  if (role == "Provider" && status === "CANCELLED") {
    return "CANCELLED only Customer Change";
  }

  if (role == "Provider") {
    if (
      status == "PLACED" ||
      status == "PREPARING" ||
      status == "READY" ||
      status == "DELIVERED"
    ) {
      const result = await prisma.order.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
      return {
        success: true,
        message: `update order status successfully`,
        result,
      };
    }
  }
};

const getAllorder = async (role: string) => {
  if (role !== "Admin") {
    return "view all order only Admin";
  }
  const result = await prisma.order.findMany({
    include: {
      orderitem: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const customerOrderStatusTrack = async (mealid: string, userid: string) => {
  const existingOrder = await prisma.order.findMany({
    where: {
      customerId: userid,
      orderitem: {
        some: {
          mealId: mealid,
        },
      },
    },
  });
  if (existingOrder.length === 0) {
    throw new AppError(status.NOT_FOUND, "no order found for this meal");
  }
  console.log(existingOrder, "data");

  // const result = await prisma.order.findMany({
  //     include: {
  //         orderitem: {
  //             where: {
  //                 mealId: mealid
  //             },
  //             select: {
  //                 mealId: true,
  //                 price: true,
  //                 quantity: true
  //             },
  //             orderBy: {
  //                 createdAt: 'desc'
  //             }
  //         },

  //     },
  //     orderBy: {
  //         createdAt: 'desc'
  //     }
  // })
  // console.log(result,'dd')
  return {
    success: true,
    message: `customer order status track successfully`,
    result: existingOrder,
  };
};

const CustomerRunningAndOldOrder = async (userid: string, status: string) => {
  const andConditions: any[] = [];
  let message = "customer running and old order retrieve successfully";
  let currentStatus = status;
  if (status == "DELIVERED") {
    andConditions.push({ status: status });
    ((message = "Recent order information retrieved successfully."),
      (currentStatus = status));
  }
  if (status == "CANCELLED") {
    andConditions.push({ status: status });
    ((message = "CANCELLED order information retrieved successfully."),
      (currentStatus = status));
  }

  if (status == "PLACED" || status == "PREPARING" || status == "READY") {
    andConditions.push({ status: status });
    ((message = "running order retrieved successfully."),
      (currentStatus = status));
  }
  const result = await prisma.order.findMany({
    where: {
      customerId: userid,
      AND: andConditions,
    },
    include: {
      orderitem: { orderBy: { createdAt: "desc" } },
    },
  });

  return {
    success: true,
    message,
    result,
  };
};

const getSingleOrder = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      orderitem: {
        select: {
          meal: true,
          orderId: true,
          price: true,
          quantity: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "no order found for this id");
  }
  return {
    success: true,
    message: `single order retrieve successfully`,
    result,
  };
};

export const ServiceOrder = {
  CreateOrder,
  getOwnmealsOrder,
  UpdateOrderStatus,
  getAllorder,
  customerOrderStatusTrack,
  CustomerRunningAndOldOrder,
  getSingleOrder,
};
