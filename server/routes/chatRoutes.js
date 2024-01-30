import chalk from "chalk";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getSingleChat,
  getAllChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from "../controllers/chatController.js";

const router = Router();

router.post("/single", authMiddleware, getSingleChat);
router.get("/all", authMiddleware, getAllChats);
router.post("/createGroup", authMiddleware, createGroupChat);
router.put("/renameGroup", authMiddleware, renameGroup);
router.put("/addToGroup", authMiddleware, addToGroup);
router.put("/removeFromGroup", authMiddleware, removeFromGroup);

export default router;
