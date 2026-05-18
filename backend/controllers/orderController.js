import ErrorHandler from "../middlewares/errorMiddlewares.js";
import catchAsync from "../middlewares/catchAsyncErrors.js";
import database from "../database/db.js";
import { generatePaymentIntent} from "../utils/generatePaymentIntent.js";

export const placeNewOrder = catchAsync(async (req, res, next) => {
    const {
        full_name,
        state,
        city,
        country,
        address,
        pincode,
        phone,
        orderItems,
    } = req.body;
    
    if (
        !full_name ||
        !state ||
        !city ||
        !country ||
        !address ||
        !pincode ||
        !phone ||
        !orderItems
    ) {
        return next(
            new ErrorHandler("Please fill all required shipping details", 400)
        );
    }
    const items = Array.isArray
});