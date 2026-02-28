import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { ReviewsController } from "./reviews.controller";

const router = Router()
router.post('/meals/:id/reviews', auth([UserRoles.Customer]), ReviewsController.CreateReviews)
router.put("/review/:reviewid", auth([UserRoles.Customer, UserRoles.Admin]), ReviewsController.updateReview)
router.delete("/review/:reviewid", auth([UserRoles.Customer, UserRoles.Admin]), ReviewsController.deleteReview)
router.get("/reviews", ReviewsController.getAllreviews)
router.get("/review/:reviewid", ReviewsController.getReviewByid)
router.patch("/review/:reviewId/moderate",auth([UserRoles.Admin]), ReviewsController.moderateReview)
export const ReviewsRouter = { router }