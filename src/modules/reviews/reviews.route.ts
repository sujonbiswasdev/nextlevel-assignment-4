import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { ReviewsController } from "./reviews.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createReviewsData, moderateData, updateReviewsData } from "./reviews.validation";

const router = Router()
router.post('/meal/:id/reviews', auth([UserRoles.Customer]),validateRequest(createReviewsData), ReviewsController.CreateReviews)
router.put("/review/:reviewid", auth([UserRoles.Customer]),validateRequest(updateReviewsData), ReviewsController.updateReview)
router.delete("/review/:reviewid", auth([UserRoles.Customer, UserRoles.Admin]), ReviewsController.deleteReview)
router.get("/reviews", ReviewsController.getAllreviews)
router.get("/review/:reviewid", ReviewsController.getReviewByid)
router.patch("/review/:reviewid/moderate",auth([UserRoles.Admin]),validateRequest(moderateData), ReviewsController.moderateReview)
export const ReviewsRouter = { router }