import { Router } from "express";
import { allUsers } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/").get(authMiddleware, allUsers);

export default router;
