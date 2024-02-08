import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getSingleChat,
} from "../controllers/messageController.js";

const router = Router();

router.route("/send").post(authMiddleware, sendMessage);
router.route("/single/:chatId").get(authMiddleware, getSingleChat);

export default router;
