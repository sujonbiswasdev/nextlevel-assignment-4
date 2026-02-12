import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { providerController } from "./provider.controller";

const router=Router()
router.post('/provider/profile',auth([UserRoles.Provider]),providerController.createProvider)
router.put('/providers/update',auth([UserRoles.Provider]),providerController.UpateProviderProfile)
router.get('/provider/own',auth([UserRoles.Provider]),providerController.getOwnProviderProfile)
// public
router.get('/providers',providerController.gelAllprovider)
router.get('/providers/:id',providerController.getProviderWithMeals)


export const providerRouter={router}