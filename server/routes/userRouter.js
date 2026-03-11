import { Router } from "express";
import { allUsers, userCount } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/").get(authMiddleware, allUsers);
router.route("/count").get(userCount);

export default router;
