import { Router } from "express";
import { UserRoles } from "../../middleware/auth.const";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";

const router=Router()

router.get("/admin/users",auth([UserRoles.Admin]),UserController.GetAllUsers)
router.patch("/admin/users/:id",auth([UserRoles.Admin]),UserController.UpdateUserStatus)

router.get("/profile/:id",auth([UserRoles.Customer,UserRoles.Admin,UserRoles.Provider]),UserController.getCustomerProfile)

router.put("/customer/profile/:id",auth([UserRoles.Customer]),UserController.UpateCustomerProfile)
router.put("/admin/profile/:id/role",auth([UserRoles.Admin]),UserController.UpdateRoleUsers)
router.delete("/customer/profile/:id",auth([UserRoles.Customer]),UserController.DeleteCustomerProfile)
export const UserRouter={router}