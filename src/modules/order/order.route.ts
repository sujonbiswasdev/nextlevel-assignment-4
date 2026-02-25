import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { OrderController } from "./order.controller";

const router=Router()
router.post('/orders',auth([UserRoles.Customer]),OrderController.createOrder)
router.get('/orders/meals/:id/status',auth([UserRoles.Customer]),OrderController.customerOrderStatusTrack)
router.get('/myorders/status',auth([UserRoles.Customer]),OrderController.CustomerRunningAndOldOrder)
router.get('/orders/all',auth([UserRoles.Admin]),OrderController.getAllOrder)
router.get('/orders',auth([UserRoles.Customer,UserRoles.Provider]),OrderController.getOwnmealsOrder)
router.patch('/provider/orders/:id',auth([UserRoles.Provider,UserRoles.Customer]),OrderController.UpdateOrderStatus)
router.get('/orders/:id',auth([UserRoles.Customer]),OrderController.getSingleOrder)
export const OrderRouter={router}