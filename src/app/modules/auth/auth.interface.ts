import { createUserSchema, updateValidation } from "./auth.validation";
import z from "zod";

export type ISignupData = z.infer<typeof createUserSchema>;
export type IUpdateUserData = z.infer<typeof updateValidation>;