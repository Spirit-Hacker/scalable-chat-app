import { Router } from "express";
import { verifyUserAccessToken } from "../middlewares/auth.middleware";
import { getMessages, storeMessage } from "../controllers/messages.controller";

const router = Router();

router.route("/sendMessage/:id").post(storeMessage);
router.route("/getAllMessages/:id").get(verifyUserAccessToken, getMessages);

export default router;