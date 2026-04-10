import z from "zod";

export const CreateproviderData = z.object({
    restaurantName: z.string(),
    address: z.string(),
    description: z.string().optional(),
    image: z.string().optional()
  }).strict();



 export const UpdateproviderData = z.object({
      restaurantName: z.string().optional(),
      address: z.string().optional(),
      description: z.string().optional(),
      image: z.string().min(8).optional(),
    }).strict()