import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { providerController } from "./provider.controller";

const router=Router()
router.post('/profile',auth([Roles.Provider]),providerController.createProvider)

export const providerRouter={router}