import { Router } from "express";
import { register, login, user } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/user", authMiddleware, user);

export default router;
