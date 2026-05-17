import { createUserTable } from '../models/userTable.js';
import { createProductsTable } from '../models/productTable.js';
import { createOrdersTable } from '../models/ordersTable.js';
import { createOrderItemTable } from '../models/orderItemsTable.js';
import { createPaymentsTable } from '../models/paymentsTable.js';
import { createProductReviewsTable } from '../models/productReviewsTable.js';
import { createShippingInfoTable } from '../models/shippinginfoTable.js';

export const createTables = async () => {
    try {
        console.log("Creating tables...");

        await createUserTable();
        console.log("Users table ready");

        await createProductsTable(); // ✅ FIXED (plural)
        console.log("Products table ready");

        await createProductReviewsTable();
        console.log("Product reviews table ready");

        await createOrdersTable();
        console.log("Orders table ready");

        await createOrderItemTable();
        console.log("Order items table ready");

        await createShippingInfoTable();
        console.log("Shipping info table ready");

        await createPaymentsTable();
        console.log("Payments table ready");

        console.log("All tables created successfully");

    } catch (error) {
        console.error("Error creating tables:", error);
        process.exit(1);
    }
};