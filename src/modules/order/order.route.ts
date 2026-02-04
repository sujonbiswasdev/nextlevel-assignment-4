import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { OrderController } from "./order.controller";

const router=Router()
router.post('/orders',auth([Roles.Customer]),OrderController.createOrder)
router.get('/orders',auth([Roles.Provider]),OrderController.getUserOrder)
router.put('/orders/:id',auth([Roles.Provider]),OrderController.UpdateOrder)

export const OrderRouter={router}