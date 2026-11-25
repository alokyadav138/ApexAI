import express from "express";
import cookieparser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";


const app= express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieparser());
app.use(morgan("dev"));

app.get("/",(req,res)=>{
    res.json({message: "Server is running"});
});

app.use("/api/chats", chatRouter);
app.use("/api/auth", authRouter);

export default app;