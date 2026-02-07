import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { OrderController } from "./order.controller";

const router=Router()
router.post('/meals/:id/orders',auth([UserRoles.Customer]),OrderController.createOrder)
router.get('/customer/meals/:id/myorders',auth([UserRoles.Customer]),OrderController.customerOrderStatusTrack)
router.get('/customer/meals/myorders',auth([UserRoles.Customer]),OrderController.CustomerRunningAndOldOrder)
router.get('/orders/:id',auth([UserRoles.Customer]),OrderController.getSingleOrder)
router.get('/orders',auth([UserRoles.Customer]),OrderController.getOwnmealsOrder)
router.put('/provider/orders/:id',auth([UserRoles.Provider,UserRoles.Customer]),OrderController.UpdateOrderStatus)
router.get('/orders/all',auth([UserRoles.Admin]),OrderController.getAllOrder)

export const OrderRouter={router}