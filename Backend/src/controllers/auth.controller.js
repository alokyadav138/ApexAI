import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mail.service.js";


const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
};
/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body {username, email, password}
 */
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const existingEmail = await userModel.findOne({ email });

        if (existingEmail) {
            if (existingEmail.verified) {
                return res.status(400).json({
                    success: false,
                    err: "User already exists",
                    message: "User already exists"
                });
            }

            const emailVerificationToken = jwt.sign(
                { email: existingEmail.email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            await sendMail({
                to: existingEmail.email,
                subject: "Verify your BAT-AI account",
                html: `
                    <h2>Hello ${existingEmail.username},</h2>
                    <p>Please verify your email address.</p>
                    <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">
                        Verify Email
                    </a>
                `
            });

            return res.status(200).json({
                success: true,
                message: "Verification email sent again. Please check your inbox."
            });
        }

        const existingUsername = await userModel.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({
                success: false,
                err: "Username already exists"
            });
        }

        const user = await userModel.create({
            username,
            email,
            password
        });

        const emailVerificationToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        await sendMail({
            to: user.email,
            subject: "Welcome to BAT-AI - Verify Your Email",
            html: `
                <h2>Hello ${user.username},</h2>
                <p>Thank you for registering at BAT-AI.</p>
                <p>Please verify your email address:</p>
                <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">
                    Verify Email
                </a>
                <p>Welcome to BAT-AI!</p>
            `
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed",
            err: error.message
        });
    }
}

/**
 * @desc Login a user
 * @route POST /api/auth/login
 * @access Public   
 */

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        });
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email address",
            success: false,
            err: "Email not verified"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
res.cookie("token", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
});

    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
    const userId = req.user.id;
 
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    res.status(200).json({
        success: true,
        user
    });

}

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query {token}
 */
export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({
            email: decoded.email
        });

        if (!user) {
            return res.status(400).send("User not found");
        }

        if (!user.verified) {
            user.verified = true;
            await user.save();
        }

        return res.send(`
            <html>
                <body style="text-align:center; padding:50px; font-family:Arial;">
                    <h1>Email Verified Successfully!</h1>
                    <p>Your BAT-AI account is now verified.</p>
                    <a href="${process.env.FRONTEND_URL}/login">
                        Login to BAT-AI
                    </a>
                </body>
            </html>
        `);

    } catch (error) {
        console.error("Email verification error:", error.message);

        return res.status(400).send(`
            <h2>Invalid or expired verification link.</h2>
            <p>Please request a new verification email.</p>
        `);
    }
}

export async function logout(req, res) {
 res.clearCookie("token", cookieOptions);

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}