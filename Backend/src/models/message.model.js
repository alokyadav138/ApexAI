import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["user", "ai"],
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        feedback: {
            type: String,
            enum: ["none", "like", "dislike"],
            default: "none"
        },

        attachment: {
            name: String,
            mimeType: String,
            size: Number,
            extractedText: String
        }
    },
    { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;