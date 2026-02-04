import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { ReviewsController } from "./reviews.controller";

const router=Router()
router.post('/meals/:id/reviews',auth([Roles.Customer]),ReviewsController.CreateReviews)

export const ReviewsRouter={router}