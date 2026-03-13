import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { providerController } from "./provider.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { CreateproviderData, UpdateproviderData } from "./provider.validation";

const router=Router()
router.post('/provider/profile',auth([UserRoles.Provider]),validateRequest(CreateproviderData),providerController.createProvider)
router.put('/providers/update',auth([UserRoles.Provider]),validateRequest(UpdateproviderData),providerController.UpateProviderProfile)
router.get('/providers',providerController.gelAllprovider)
router.get('/providers/:id',providerController.getProviderWithMeals)
export const providerRouter={router}