import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import productRouter from './router/productRoutes.js';
import adminRouter from "./router/adminRoutes.js";
import createTables from "./database/createTables.js";
import Stripe from "stripe";
import orderRouter from './router/orderRoutes.js';
import authRouter from "./router/authRoutes.js";

const app = express();

config({ path: "./config/config.env" });

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.post("/api/v1/webhook", express.raw({ type: "application/json" }), async(req, res) => {
    const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (error) {
            return res.status(400).send(`Webhook Error: ${error.message || error}`);
        }

    // Handle the event
    if(event.type === "payment_intent.succeded"){
        const payment_client_secret = event.data.object;

        try{
            // Finding and Updating Payments
            const updatedPaymentStatus = "Paid";
            const paymentTaleUpdateResult = await database.query('UPDATE payments SET payment_status = $1 WHERE payment_intent_id = $2 RETURNING *', [updatedPaymentStatus, payment_client_secret]);

            const orderTableUpdateResult = await database.query(`UPDATE orders SET paid_at = NOW() WHERE id = $1 RETURNING *`,[paymentTaleUpdateResult.rows[0].order_id]);

            const orderId = paymentTaleUpdateResult.rows[0].order_id;

            const {rows: orderItems} = await database.query(`SELECT product_id, quantity FROM order_items WHERE order_id = $1`, [orderId]);

            //For each order item, update the stock of the corresponding product    
            for(const item of orderItems){
                await database.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [item.quantity, item.product_id]);
            }
        } catch (error) {
            return res.status(500).send(`Error updating paid_at timestamp in orders table`);
        }
    }
    res.status(200).send({received: true});

});


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/uploads",
}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/order", orderRouter);

createTables();

console.log(new Date());

app.use(errorMiddleware);

export default app;