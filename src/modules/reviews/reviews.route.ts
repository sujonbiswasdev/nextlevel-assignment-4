import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { ReviewsController } from "./reviews.controller";

const router = Router()
router.post('/meals/:id/reviews', auth([Roles.Customer]), ReviewsController.CreateReviews)
router.put("/review/:reviewid", auth([Roles.Customer, Roles.Admin]), ReviewsController.updateReview)
router.delete("/review/:reviewid", auth([Roles.Customer, Roles.Admin]), ReviewsController.deleteReview)
router.get("/review/:reviewid", ReviewsController.getReviewByid)
router.patch("/review/:reviewId/moderate",auth([Roles.Admin]), ReviewsController.moderateReview)
export const ReviewsRouter = { router }