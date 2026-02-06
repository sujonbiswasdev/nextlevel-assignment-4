import { Router } from "express";
import { Roles } from "../../middleware/auth.const";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";

const router=Router()

router.get("/admin/users",auth([Roles.Admin]),UserController.GetAllUsers)
router.patch("/admin/users/:id",auth([Roles.Admin]),UserController.UpdateUser)

router.get("/profile/:id",auth([Roles.Customer,Roles.Admin,Roles.Provider]),UserController.getCustomerProfile)

router.put("/customer/profile/:id",auth([Roles.Customer]),UserController.UpateCustomerProfile)
router.put("/admin/profile/:id/role",auth([Roles.Admin]),UserController.UpdateRoleUsers)
router.delete("/customer/profile/:id",auth([Roles.Customer]),UserController.DeleteCustomerProfile)
export const UserRouter={router}