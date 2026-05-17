import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRoutes from "./router/authRoutes.js";
import productRouter from "./router/productRoutes.js";
import adminRoutes from "./router/adminRoutes.js";
import createTables from "./database/createTables.js";
import Stripe from "stripe";

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
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

    // Handle the event
    if(event.type === "payment_intent.succeded"){
        const payment_client_secret = event.data.object
    }

});


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/uploads",
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/admin", adminRoutes);

createTables();

console.log(new Date());

app.use(errorMiddleware);

export default app;