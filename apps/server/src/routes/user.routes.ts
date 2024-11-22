import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/user.controller";
import { verifyUserAccessToken } from "../middlewares/verifyUserAccessToken";

const router = Router();

// unsecured routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/getAllUsers").get(verifyUserAccessToken, getAllUsers);

export default router;