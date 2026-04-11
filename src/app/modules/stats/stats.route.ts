import express from "express";
import { StatsController } from "./stats.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../../generated/prisma/enums";


const router = express.Router();

router.get(
  "/stats",
  auth([Role.Admin, Role.Provider]),
  StatsController.getDashboardStatsData
);

export const StatsRoutes = router;