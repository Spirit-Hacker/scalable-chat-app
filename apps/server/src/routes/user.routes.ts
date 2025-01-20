import { Router } from "express";
import { registerUser, loginUser, getAllUsers, logout, refreshAccessToken, uploadProfilePicture } from "../controllers/user.controller";
import { verifyUserAccessToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// unsecured routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/getAllUsers").get(verifyUserAccessToken, getAllUsers);
router.route("/logout").post(verifyUserAccessToken, logout);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("/uploadPicture").post(verifyUserAccessToken, upload.single("profilePhoto"), uploadProfilePicture);

export default router;