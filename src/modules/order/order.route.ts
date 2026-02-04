import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { OrderController } from "./order.controller";

const router=Router()
router.post('/orders',auth([Roles.Customer]),OrderController.createOrder)

export const OrderRouter={router}