import jwt from "jsonwebtoken";
import catchAsync from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import database from "../database/db.js";

// Authentication Middleware
export const isAuthenticated = catchAsync(async (req, res, next) => {

    // Support cookies & Bearer token
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // No token
    if (!token) {
        return next(
            new ErrorHandler(
                "Please login to access this resource",
                401
            )
        );
    }

    let decodedData;

    try {
        decodedData = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );
    } catch (error) {
        return next(
            new ErrorHandler(
                "Invalid or expired token",
                401
            )
        );
    }

    // Find user
    const user = await database.query(
        "SELECT * FROM users WHERE id = $1 LIMIT 1",
        [decodedData.id]
    );

    // User not found
    if (user.rowCount === 0) {
        return next(
            new ErrorHandler(
                "User not found",
                404
            )
        );
    }

    // Attach user to request
    req.user = user.rows[0];

    next();
});


// Role Authorization Middleware
const roleMiddleware = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return next(
                new ErrorHandler(
                    "User not authenticated",
                    401
                )
            );
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user.role}) is not allowed to access this resource`,
                    403
                )
            );
        }

        next();
    };
};


// Export BOTH names
export const authorizeRoles = roleMiddleware;
export const authorizedRoles = roleMiddleware;