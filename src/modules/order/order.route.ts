import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { OrderController } from "./order.controller";

const router=Router()
router.post('/orders',auth([Roles.Customer]),OrderController.createOrder)
router.get('/orders',auth([Roles.Customer]),OrderController.getUserOrder)
router.get('/orders/:id',auth([Roles.Customer]),OrderController.getSigleOrder)

router.put('/provider/orders/:id',auth([Roles.Customer,Roles.Provider]),OrderController.UpdateOrder)

router.get('/admin/orders',auth([Roles.Admin]),OrderController.ViewAllorders)

export const OrderRouter={router}