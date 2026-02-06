import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { OrderController } from "./order.controller";

const router=Router()
router.post('/meals/:id/orders',auth([Roles.Customer]),OrderController.createOrder)
router.get('/customer/meals/:id/myorders',auth([Roles.Customer]),OrderController.customerOrderStatusTrack)
router.get('/customer/meals/myorders',auth([Roles.Customer]),OrderController.CustomerRunningAndOldOrder)
router.get('/customer/myorders/:id',auth([Roles.Customer]),OrderController.getSingleOrder)
router.get('/orders/own',auth([Roles.Provider]),OrderController.getOwnmealsOrder)
router.put('/provider/orders/:id',auth([Roles.Provider,Roles.Customer]),OrderController.UpdateOrderStatus)
router.get('/orders/all',auth([Roles.Admin]),OrderController.getAllOrder)

export const OrderRouter={router}