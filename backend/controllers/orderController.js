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
    const items = Array.isArray(orderItems) ? orderItems : JSON.stringify(orderItems);

    if(!items || items.length === 0){
        return next(new ErrorHandler("No item in cart", 400));
    }

    const productIds = items.map((item) => item.productId);
    const {rows: products} = await database.query(`SELECT id, price, stock, name FROM products WHERE id = ANY($1::uuid[])`, [productIds]);

    let total_price = 0;
    const values = [];
    const placeholders = [];

    items.forEach((item, index) => {
        const product = products.find(p=> p.id === item.productId);

        if(!product){
            return next(new ErrorHandler(`Product not found for ID: ${item.productId}`, 404));
        }

        if(item.quantity > product.stock){
            return next (new ErrorHandler(`Only ${product.stock} units available for product: ${product.name}`, 400));
        }

        const itemTotal = product.price * item.quantity;
        total_price += itemTotal;

        values.push(null, product.id, item.quantity, product.price, item.product.images[0].url || "");

        const offset = index * 6;

        placeholders.push('($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})');

    });

    const tax_price = 0.008;
    const shipping_price = 2;
    total_price = Math.round(total_price + total_price * tax_price + shipping_price);

    const orderResult = await database.query(`INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price) VALUES ($1, $2, $3, $4) RETURNING *`, [req.user.id, total_price, tax_price, shipping_price]);

    const orderId = orderResult.rows[0].id;

    for(let i = 0; i < values.length; i += 6){
        values[i] = orderId;
    }

    await database.query(`INSERT INTO order_items (order_id, product_id, quantity, price, image, title) VALUES ${placeholders.join(", ")} RETURNING * `, values);

    await database.query(`INSERT INTO shipping_info (order_id, full_name, state, city, country, address, pincode, phone) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING * `, [orderId, full_name, state, city, country, address, pincode, phone]);

    const paymentResponse = await generatePaymentIntent(orderId, total_price);

    if(!paymentResponse.success){
        return next(new ErrorHandler("Payment Failed. Try again", 500));
    }

    res.status(200).json({
        success: true,
        message: "Order placed Successfully. Please proceed to payment.",
        paymentIntent: paymentResponse.clientSecret, 
        total_price, 
    });
});