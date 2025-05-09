import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllUsers).post(registerUser);
router.post("/login", authUser);
router.delete("/logout", logoutUser);

// Add route for getting a specific user's profile
router.get("/profile/:id", protect, getUserProfile);
router.put("/profile/:id", protect, updateUserProfile);
router.delete("/profile/:id", protect, deleteUserProfile);

export default router;
