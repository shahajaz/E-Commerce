# 🛍️ AI-Powered Full Stack E-Commerce Platform

> A production-ready AI-powered E-Commerce platform built using **React, Node.js, Express.js, PostgreSQL, Gemini AI, and Stripe** with modern architecture, secure authentication, intelligent product recommendations, and online payment integration.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node](https://img.shields.io/badge/Node.js-22-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql)
![Stripe](https://img.shields.io/badge/Stripe-Payment-purple?logo=stripe)
![Gemini](https://img.shields.io/badge/Google-Gemini-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 🚀 Live Demo

### 🌐 Frontend
https://your-frontend-link.vercel.app

### ⚙ Backend API
https://your-api-link.onrender.com

---

# 📸 Screenshots

> Replace these images with your own screenshots.

| Home | Product |
|-------|----------|
| ![](screenshots/home.png) | ![](screenshots/product.png) |

| Cart | Checkout |
|-------|----------|
| ![](screenshots/cart.png) | ![](screenshots/checkout.png) |

| AI Recommendation | Admin Dashboard |
|-------|----------|
| ![](screenshots/ai.png) | ![](screenshots/admin.png)|

---

# 📖 Project Overview

This project is a modern AI-powered Full Stack E-Commerce application inspired by platforms like Amazon and Flipkart.

The application enables users to browse products, search intelligently using AI, securely authenticate, manage shopping carts, place orders, complete payments via Stripe, and receive AI-powered product recommendations generated using Google's Gemini API.

The project follows industry-standard backend architecture with REST APIs, JWT authentication, PostgreSQL relational database, and scalable code organization.

---

# ✨ Features

## 👤 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Logout

---

## 🛒 Shopping

- Browse Products
- Product Details
- Category Filtering
- Product Search
- Add to Cart
- Remove from Cart
- Update Quantity
- Wishlist (Optional)
- Order Summary

---

## 🤖 AI Features

Powered by **Google Gemini API**

- AI Product Recommendations
- Smart Product Description Generation
- AI Search Suggestions
- Personalized Shopping Experience

---

## 💳 Payments

Integrated with **Stripe**

- Secure Checkout
- Payment Gateway
- Payment Success Page
- Payment Failure Handling
- Order Confirmation

---

## 📦 Orders

- Place Order
- View Order History
- Order Details
- Payment Status
- Order Tracking Ready Architecture

---

## 👨‍💼 Admin Features

- Dashboard
- Add Product
- Edit Product
- Delete Product
- Manage Orders
- Manage Users
- View Sales Data

---

# 🏗️ Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Context API / Redux
- Tailwind CSS
- React Icons

---

## Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma / pg
- JWT Authentication
- bcrypt
- Multer
- Stripe SDK
- Gemini API

---

## Database

PostgreSQL

Tables
- Users
- Products
- Categories
- Cart
- Orders
- Order Items
- Payments

---

# 📂 Folder Structure

```
AI-ECommerce
│
├── client
│   ├── public
│   ├── src
│   │
│   ├── assets
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── hooks
│   ├── context
│   ├── services
│   ├── utils
│   ├── App.jsx
│   └── main.jsx
│
├── server
│
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── uploads
│   └── server.js
│
├── screenshots
│
├── README.md
│
└── package.json
```

---

# ⚙ System Architecture

```
                User
                  │
                  ▼
          React Frontend
                  │
      REST API Requests
                  │
                  ▼
         Express.js Server
                  │
      ┌───────────┼────────────┐
      │           │            │
      ▼           ▼            ▼
 PostgreSQL    Gemini AI    Stripe
 Database        API         Payment
```

---

# 🔄 Application Workflow

```
User

↓

Browse Products

↓

Search Products

↓

AI Recommendation

↓

Add to Cart

↓

Checkout

↓

Stripe Payment

↓

Order Created

↓

Database Updated

↓

Order History
```

---

# 🔐 Authentication Flow

```
Register

↓

Password Hashing

↓

Store User

↓

Login

↓

JWT Generated

↓

Protected Routes

↓

Authenticated Requests
```

---

# 💳 Payment Flow

```
Cart

↓

Checkout

↓

Stripe Session

↓

Payment

↓

Webhook / Success

↓

Order Saved

↓

Payment Confirmation
```

---

# 🤖 AI Recommendation Flow

```
User Views Product

↓

Send Product Context

↓

Gemini API

↓

AI Recommendation Generated

↓

Display Suggested Products
```

---

# 🗄 Database Schema

```
Users

id
name
email
password
created_at

↓

Products

id
title
description
price
stock
image

↓

Orders

id
user_id
total_price
payment_status

↓

Order_Items

id
order_id
product_id
quantity

↓

Payments

id
order_id
stripe_payment_id
status
```

---

# 🔌 REST APIs

## Authentication

```
POST   /api/auth/register

POST   /api/auth/login

GET    /api/auth/profile
```

---

## Products

```
GET    /api/products

GET    /api/products/:id

POST   /api/products

PUT    /api/products/:id

DELETE /api/products/:id
```

---

## Cart

```
GET    /api/cart

POST   /api/cart

DELETE /api/cart/:id
```

---

## Orders

```
POST   /api/orders

GET    /api/orders

GET    /api/orders/:id
```

---

## Payments

```
POST   /api/payment/create-session

POST   /api/payment/webhook
```

---

## AI

```
POST /api/ai/recommend

POST /api/ai/generate-description
```

---

# 🛠 Installation

Clone Repository

```bash
git clone https://github.com/yourusername/AI-ECommerce.git
```

Go to project

```bash
cd AI-ECommerce
```

Install frontend

```bash
cd client
npm install
```

Install backend

```bash
cd ../server
npm install
```

---

# ▶ Running Project

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=5000

DATABASE_URL=

JWT_SECRET=

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=

GEMINI_API_KEY=
```

---

# 📈 Performance Highlights

- Optimized REST APIs
- Modular Folder Structure
- Reusable Components
- Secure Authentication
- Clean Code Architecture
- Responsive UI
- AI Assisted Shopping
- Fast PostgreSQL Queries
- Stripe Secure Payments

---

# 🚀 Future Improvements

- Docker Support
- Redis Caching
- RabbitMQ
- Elasticsearch
- Product Reviews
- Wishlist
- Coupons
- Admin Analytics
- Recommendation Engine using Embeddings
- Email Notifications
- Inventory Management
- CI/CD Pipeline
- AWS Deployment
- Microservices Architecture

---

# 📚 What I Learned

- Building scalable REST APIs
- Authentication with JWT
- PostgreSQL Database Design
- Payment Gateway Integration
- AI API Integration
- Full Stack Architecture
- Clean Folder Structure
- Error Handling
- Secure Backend Development
- Production Ready Deployment

---

# 👨‍💻 Author

**Mohammad Ajaz Shah**

Full Stack Developer

LinkedIn:
https://linkedin.com/in/yourprofile

Portfolio:
https://yourportfolio.com

GitHub:
https://github.com/yourusername

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It motivates me to build more production-ready full-stack projects.

---

# 📜 License

