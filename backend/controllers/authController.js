import ErrorHandler from "../middlewares/errorMiddlewares.js";
import catchAsync from "../middlewares/catchAsyncErrors.js";
import database from "../database/db.js";
import bcrypt from "bcryptjs";
import { sendToken } from "../utils/jwtToken.js";
import crypto from "crypto";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js";

export const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    const normalizedEmail = email.toLowerCase();

    if (password.length < 8 || password.length > 20) {
        return next(new ErrorHandler("Password must between 8 and 20 characters", 400));
    }

    const isAlreadyRegistered = await database.query(
        "SELECT * FROM users WHERE email = $1",
        [normalizedEmail]
    );

    if (isAlreadyRegistered.rows.length > 0) {
        return next(new ErrorHandler("User already registered with this email", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await database.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, normalizedEmail, hashedPassword]
    );

    sendToken(user.rows[0], 201, res, "User registered successfully");
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await database.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (user.rows.length === 0) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.rows[0].password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user.rows[0], 200, res, "Logged in successfully");
});

export const getUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    res.status(200).json({
        success: true,
        user,
    });
});

export const logout = catchAsync(async (req, res, next) => {
    res.status(200)
        .cookie("token", null, {
            expires: new Date(0),
            httpOnly: true,
        })
        .json({
            success: true,
            message: "Logged out successfully",
        });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const { frontendUrl } = req.query;

    let userResult = await database.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (userResult.rows.length === 0) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const user = userResult.rows[0];

    const { hashedToken, resetPasswordExpireTime, resetToken } =
        generateResetPasswordToken();

    await database.query(
        "UPDATE users SET reset_password_token = $1, reset_password_expire = to_timestamp($2) WHERE email = $3",
        [hashedToken, resetPasswordExpireTime / 1000, email]
    );

    const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

    const message = generateEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopSphere Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        await database.query(
            "UPDATE users SET reset_password_token = null, reset_password_expire = null WHERE email = $1",
            [email]
        );

        return next(
            new ErrorHandler("Failed to send email. Please try again later.", 500)
        );
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await database.query(
        "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()",
        [resetPasswordToken]
    );

    if (user.rows.length === 0) {
        return next(
            new ErrorHandler("Invalid or expired password reset token", 400)
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password do not match", 400));
    }

    if (
        req.body.password?.length < 8 ||
        req.body.password?.length > 20 ||
        req.body.confirmPassword?.length < 8 ||
        req.body.confirmPassword?.length > 20
    ) {
        return next(
            new ErrorHandler("Password must between 8 and 20 characters", 400)
        );
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const updatedUser = await database.query(
        "UPDATE users SET password = $1, reset_password_token = null, reset_password_expire = null WHERE id = $2 RETURNING *",
        [hashedPassword, user.rows[0].id]
    );

    sendToken(updatedUser.rows[0], 200, res, "Password reset successfully");
});

export const updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const isMatch = await bcrypt.compare(currentPassword, req.user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Current password is incorrect", 400));
    }

    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    if (currentPassword === newPassword) {
        return next(
            new ErrorHandler("New password must be different from current password", 400)
        );
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;

    if (!passwordRegex.test(newPassword)) {
        return next(
            new ErrorHandler(
                "Password must be 8-20 chars, include uppercase, lowercase, number & special character",
                400
            )
        );
    }

    const saltRounds = process.env.BCRYPT_SALT || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await database.query(
        "UPDATE users SET password = $1 WHERE id = $2",
        [hashedPassword, req.user.id]
    );

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});

export const updateProfile = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    if (name.trim().length === 0 || email.trim().length === 0) {
        return next(new ErrorHandler("Name and email cannot be empty", 400));
    }

    let avatarData = {};
    let user;

    if (req.files && req.files.avatar) {
        const { avatar } = req.files;

        if (req.user?.avatar?.public_id) {
            await cloudinary.uploader.destroy(req.user.avatar.public_id);
        }

        const newProfileImage = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {
                folder: "avatars",
                width: 150,
                crop: "scale",
            }
        );

        avatarData = {
            public_id: newProfileImage.public_id,
            url: newProfileImage.secure_url,
        };

        user = await database.query(
            "UPDATE users SET name = $1, email = $2, avatar = $3 WHERE id = $4 RETURNING *",
            [name, email, avatarData, req.user.id]
        );
    }

    // ✅ crash fix (no logic change)
    if (!user) {
        user = await database.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
            [name, email, req.user.id]
        );
    }

    res.status(200).json({
        success: true,
        user: user.rows[0],
        message: "Profile updated successfully",
    });
});