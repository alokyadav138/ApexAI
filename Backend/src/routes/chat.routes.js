import { Router } from "express";
import upload from "../middleware/upload.middleware.js";
import {
    sendMessage,
    getChats,
    getMessages,
    deleteChat,
    regenerateMessage,
    updateMessageFeedback
} from "../controllers/chat.controllers.js";

import { authUser } from "../middleware/auth.middleware.js";

const chatRouter = Router();

chatRouter.post(
    "/message",
    authUser,
    upload.single("file"),
    sendMessage
);

chatRouter.get("/", authUser, getChats);

chatRouter.get("/:chatId/messages", authUser, getMessages);

chatRouter.delete("/delete/:chatId", authUser, deleteChat);

chatRouter.post("/:messageId/regenerate", authUser, regenerateMessage);

chatRouter.patch("/:messageId/feedback", authUser, updateMessageFeedback);

export default chatRouter;