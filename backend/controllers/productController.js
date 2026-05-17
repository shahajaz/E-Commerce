import catchAsync from "../middlewares/catchAsyncErrors.js";
import database from "../database/db.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { v2 as cloudinary } from "cloudinary";
import { getAIrecommendation } from "../utils/getAIrecommendation.js";


// ✅ CREATE PRODUCT
export const createProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, category, stock } = req.body;

    const created_by = req.user.id;

    if (!name || !description || !price || !category || !stock) {
        return next(
            new ErrorHandler(
                "Please provide complete product details",
                400
            )
        );
    }

    let uploadedImages = [];

    if (req.files && req.files.images) {
        const images = Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images];

        const uploadPromises = images.map((image) =>
            cloudinary.uploader.upload(image.tempFilePath, {
                folder: "ShopSphere_Product_Images",
                width: 1000,
                crop: "scale",
            })
        );

        const results = await Promise.all(uploadPromises);

        uploadedImages = results.map((result) => ({
            url: result.secure_url,
            public_id: result.public_id,
        }));
    }

    const product = await database.query(
        `
        INSERT INTO products
        (name, description, price, category, stock, created_by, images)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            name,
            description,
            price / 283,
            category,
            stock,
            created_by,
            JSON.stringify(uploadedImages),
        ]
    );

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: product.rows[0],
    });
});



// ✅ FETCH ALL PRODUCTS
export const fetchAllProducts = catchAsync(async (req, res, next) => {
    const { availability, category, price, rating, search } = req.query;

    const page = parseInt(req.query.page) || 1;

    const limit = 10;
    const offset = (page - 1) * limit;

    const conditions = [];
    let values = [];
    let index = 1;

    // ✅ Availability Filter
    if (availability === "in_stock") {
        conditions.push("p.stock > 5");
    } 
    
    else if (availability === "limited_stock") {
        conditions.push("p.stock > 0 AND p.stock <= 5");
    } 
    
    else if (availability === "out_of_stock") {
        conditions.push("p.stock = 0");
    }

    // ✅ Price Filter
    if (price) {
        const [minPrice, maxPrice] = price.split("-");

        if (minPrice && maxPrice) {
            conditions.push(
                `p.price BETWEEN $${index} AND $${index + 1}`
            );

            values.push(minPrice, maxPrice);

            index += 2;
        }
    }

    // ✅ Category Filter
    if (category) {
        conditions.push(`p.category ILIKE $${index}`);

        values.push(`%${category}%`);

        index++;
    }

    // ✅ Rating Filter
    if (rating) {
        conditions.push(`p.rating >= $${index}`);

        values.push(rating);

        index++;
    }

    // ✅ Search Filter
    if (search) {
        conditions.push(
            `(p.name ILIKE $${index} OR p.description ILIKE $${index})`
        );

        values.push(`%${search}%`);

        index++;
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // ✅ Count Total Products
    const totalProductsResult = await database.query(
        `
        SELECT COUNT(*) 
        FROM products p
        ${whereClause}
        `,
        values
    );

    const totalProducts = parseInt(
        totalProductsResult.rows[0].count
    );

    // ✅ Main Query
    const query = `
        SELECT 
            p.*,
            COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r
        ON p.id = r.product_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT $${index}
        OFFSET $${index + 1}
    `;

    values.push(limit);
    values.push(offset);

    const result = await database.query(query, values);

    // ✅ New Products
    const newProductsQuery = `
        SELECT 
            p.*,
            COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r
        ON p.id = r.product_id
        WHERE p.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 8
    `;

    const newProductsResult = await database.query(
        newProductsQuery
    );

    // ✅ Top Rated Products
    const topRatedProductsQuery = `
        SELECT 
            p.*,
            COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r
        ON p.id = r.product_id
        WHERE p.rating >= 4.5
        GROUP BY p.id
        ORDER BY p.rating DESC
        LIMIT 8
    `;

    const topRatedProductsResult = await database.query(
        topRatedProductsQuery
    );

    res.status(200).json({
        success: true,
        products: result.rows,
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        newProducts: newProductsResult.rows,
        topRatedProducts: topRatedProductsResult.rows,
    });
});



// ✅ FETCH SINGLE PRODUCT
export const fetchSingleProduct = catchAsync(
    async (req, res, next) => {
        const { productId } = req.params;

        const result = await database.query(
            `
            SELECT 
                p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'review_id', r.id,
                            'rating', r.rating,
                            'comment', r.comment,
                            'reviewer',
                            json_build_object(
                                'id', u.id,
                                'name', u.name,
                                'avatar', u.avatar
                            )
                        )
                    ) FILTER (WHERE r.id IS NOT NULL),
                    '[]'
                ) AS reviews
            FROM products p
            LEFT JOIN reviews r
            ON p.id = r.product_id
            LEFT JOIN users u
            ON r.user_id = u.id
            WHERE p.id = $1
            GROUP BY p.id
            `,
            [productId]
        );

        if (result.rows.length === 0) {
            return next(
                new ErrorHandler("Product not found", 404)
            );
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product: result.rows[0],
        });
    }
);



// ✅ UPDATE PRODUCT
export const updateProduct = catchAsync(
    async (req, res, next) => {
        const { productId } = req.params;

        const {
            name,
            description,
            price,
            category,
            stock,
        } = req.body;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return next(
                new ErrorHandler(
                    "Please provide complete product details",
                    400
                )
            );
        }

        const product = await database.query(
            "SELECT * FROM products WHERE id = $1",
            [productId]
        );

        if (product.rows.length === 0) {
            return next(
                new ErrorHandler("Product not found", 404)
            );
        }

        const result = await database.query(
            `
            UPDATE products
            SET
                name = $1,
                description = $2,
                price = $3,
                category = $4,
                stock = $5
            WHERE id = $6
            RETURNING *
            `,
            [
                name,
                description,
                price / 283,
                category,
                stock,
                productId,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct: result.rows[0],
        });
    }
);



// ✅ DELETE PRODUCT
export const deleteProduct = catchAsync(
    async (req, res, next) => {
        const { productId } = req.params;

        const product = await database.query(
            `
            DELETE FROM products
            WHERE id = $1
            RETURNING *
            `,
            [productId]
        );

        if (product.rows.length === 0) {
            return next(
                new ErrorHandler("Product not found", 404)
            );
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product: product.rows[0],
        });
    }
);



// ✅ POST PRODUCT REVIEW
export const postProductReview = catchAsync(
    async (req, res, next) => {
        const { productId } = req.params;

        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return next(
                new ErrorHandler(
                    "Please provide rating and comment",
                    400
                )
            );
        }

        // ✅ Purchase Verification
        const purchaseCheckQuery = `
            SELECT oi.product_id
            FROM order_items oi
            JOIN orders o
            ON o.id = oi.order_id
            JOIN payments p
            ON p.order_id = o.id
            WHERE o.buyer_id = $1
            AND oi.product_id = $2
            AND p.payment_status = 'paid'
            LIMIT 1
        `;

        const { rows } = await database.query(
            purchaseCheckQuery,
            [req.user.id, productId]
        );

        if (rows.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only review products you have purchased",
            });
        }

        const product = await database.query(
            "SELECT * FROM products WHERE id = $1",
            [productId]
        );

        if (product.rows.length === 0) {
            return next(
                new ErrorHandler("Product not found", 404)
            );
        }

        const isAlreadyReviewed = await database.query(
            `
            SELECT *
            FROM reviews
            WHERE product_id = $1
            AND user_id = $2
            `,
            [productId, req.user.id]
        );

        let review;

        // ✅ Update Existing Review
        if (isAlreadyReviewed.rows.length > 0) {
            review = await database.query(
                `
                UPDATE reviews
                SET rating = $1,
                    comment = $2
                WHERE product_id = $3
                AND user_id = $4
                RETURNING *
                `,
                [
                    rating,
                    comment,
                    productId,
                    req.user.id,
                ]
            );
        }

        // ✅ Create Review
        else {
            review = await database.query(
                `
                INSERT INTO reviews
                (product_id, user_id, rating, comment)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `,
                [
                    productId,
                    req.user.id,
                    rating,
                    comment,
                ]
            );
        }

        // ✅ Recalculate Rating
        const allReviews = await database.query(
            `
            SELECT AVG(rating) AS avg_rating
            FROM reviews
            WHERE product_id = $1
            `,
            [productId]
        );

        const newAvgRating =
            allReviews.rows[0].avg_rating || 0;

        const updatedProduct = await database.query(
            `
            UPDATE products
            SET rating = $1
            WHERE id = $2
            RETURNING *
            `,
            [newAvgRating, productId]
        );

        res.status(200).json({
            success: true,
            message: "Review submitted successfully",
            review: review.rows[0],
            product: updatedProduct.rows[0],
        });
    }
);



// ✅ DELETE REVIEW
export const deleteReview = catchAsync(
    async (req, res, next) => {
        const { productId } = req.params;

        const review = await database.query(
            `
            DELETE FROM reviews
            WHERE product_id = $1
            AND user_id = $2
            RETURNING *
            `,
            [productId, req.user.id]
        );

        if (review.rows.length === 0) {
            return next(
                new ErrorHandler("Review not found", 404)
            );
        }

        // ✅ Recalculate Rating
        const allReviews = await database.query(
            `
            SELECT AVG(rating) AS avg_rating
            FROM reviews
            WHERE product_id = $1
            `,
            [productId]
        );

        const newAvgRating =
            allReviews.rows[0].avg_rating || 0;

        const updatedProduct = await database.query(
            `
            UPDATE products
            SET rating = $1
            WHERE id = $2
            RETURNING *
            `,
            [newAvgRating, productId]
        );

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            review: review.rows[0],
            product: updatedProduct.rows[0],
        });
    }
);



// ✅ AI FILTERED PRODUCTS
export const fetchAIFilteredProducts = catchAsync(
    async (req, res, next) => {
        const { userPrompt } = req.body;

        if (!userPrompt) {
            return next(
                new ErrorHandler(
                    "Please provide a prompt for AI filtering",
                    400
                )
            );
        }

        const filterKeywords = (query) => {
            const stopWords = new Set([
                "the",
                "they",
                "them",
                "then",
                "i",
                "we",
                "you",
                "he",
                "she",
                "it",
                "is",
                "a",
                "an",
                "of",
                "and",
                "or",
                "to",
                "for",
                "from",
                "on",
                "who",
                "whom",
                "why",
                "when",
                "which",
                "with",
                "this",
                "that",
                "in",
                "at",
                "by",
                "be",
                "not",
                "was",
                "were",
                "has",
                "have",
                "had",
            ]);

            return query
                .toLowerCase()
                .replace(/[^\w\s]/g, "")
                .split(/\s+/)
                .filter(
                    (word) => !stopWords.has(word)
                )
                .map((word) => `%${word}%`);
        };

        const keywords = filterKeywords(userPrompt);

        // ✅ Basic Filtering
        const result = await database.query(
            `
            SELECT *
            FROM products
            WHERE
                name ILIKE ANY($1)
                OR description ILIKE ANY($1)
                OR category ILIKE ANY($1)
            LIMIT 200
            `,
            [keywords]
        );

        const filteredProducts = result.rows;

        if (filteredProducts.length === 0) {
            return res.status(200).json({
                success: true,
                message:
                    "No products found matching the prompt",
                products: [],
            });
        }

        // ✅ AI Filtering
        const { success, products } =
            await getAIrecommendation(
                req,
                res,
                userPrompt,
                filteredProducts
            );

        res.status(200).json({
            success,
            message:
                "AI filtered products fetched successfully",
            products,
        });
    }
);
