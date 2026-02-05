import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { OrderController } from "./order.controller";

const router=Router()
router.post('/meals/:id/orders',auth([Roles.Customer]),OrderController.createOrder)
router.get('/orders',auth([Roles.Provider]),OrderController.getUserOrder)
router.put('/provider/orders/:id',auth([Roles.Provider,Roles.Customer]),OrderController.UpdateOrder)
router.get('/orders/all',auth([Roles.Admin]),OrderController.getAllOrder)

export const OrderRouter={router}