import z from "zod";

export const signupValidation = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  image: z.string().optional(),
  bgimage: z.string().optional(),
  phone: z.string(),
  role: z.string(),
  restaurantName: z.string(),
  address: z.string(),
  description: z.string(),
});
export const updateValidation = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  image: z.string().optional(),
  bgimage: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  restaurantName: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});