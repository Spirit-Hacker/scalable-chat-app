import { Router } from "express";
import { registerUser, loginUser, getAllUsers, logout, refreshAccessToken } from "../controllers/user.controller";
import { verifyUserAccessToken } from "../middlewares/verifyUserAccessToken";

const router = Router();

// unsecured routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/getAllUsers").get(verifyUserAccessToken, getAllUsers);
router.route("/logout").post(verifyUserAccessToken, logout);
router.route("/refreshAccessToken").post(refreshAccessToken);

export default router;