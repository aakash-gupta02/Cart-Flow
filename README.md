# 🧩 CartFlow — Full Stack Microservices-Based E-Commerce System

**Developed by:** Aakash Gupta
**Architecture:** Microservices
**Stack:** Node.js, Express.js, MongoDB, Redis, Socket.io, Razorpay API, React + Next.js + Tailwind (Frontend)

---

## 🚀 Overview

**CartFlow** is a full-stack e-commerce system engineered with **microservices architecture**, designed for **scalability, modularity, and independent service deployment**.

Each service (auth, product, order, payment, cart, seller, admin, AI buddy) runs independently — ensuring better maintainability and allowing future scaling of any specific module without impacting the rest of the system.

The backend prioritizes **clean architecture**, **centralized error handling**, and **standardized API responses**, while the frontend offers a **smooth, fast experience** with **Zustand**, **TanStack Query**, and **Next.js 14 App Router**.

---

## 🏗️ System Architecture

**Microservices Used:**

| Service              | Purpose                                                          | Highlights                                                             |
| -------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Auth Service**     | Handles user registration, login, token management, address CRUD | JWT-based authentication, validation, secure token flow                |
| **Seller Service**   | Dedicated panel for sellers to manage products and orders        | Redis caching, authentication middleware, clean controller separation  |
| **Product Service**  | Manages product creation, image uploads, and catalog retrieval   | Multer for image handling, structured validators                       |
| **Cart Service**     | Manages cart operations and quantity updates                     | External service communication, clean cache integration                |
| **Order Service**    | Handles order creation, tracking, and history                    | Inter-service communication, order validation, clean utility structure |
| **Payment Service**  | Integrates Razorpay for secure online payments                   | Razorpay config, transaction tracking, secure callbacks                |
| **Admin Service**    | Admin-level control for sellers, users, and product management   | Redis cache, global validations, rate-limiting                         |
| **AI Buddy Service** | AI-powered product finder and cart assistant                     | Agent-tool design pattern, socket connection, prompt-to-action system  |

---

## ⚙️ Backend Design Principles

✅ **Highly Modular Codebase**
Each service has its own controllers, middleware, validators, and utils — ensuring **no tight coupling**.

✅ **Centralized Error Handling**
All services use a shared pattern for `AppError`, `catchAsync`, and `errorHandler` to ensure consistent responses.

✅ **Clean Folder Structure**
Each microservice follows a consistent pattern:

```
└── 📁backend
    └── 📁admin-service
        └── 📁docs
            ├── seller-docs.md
        └── 📁src
            └── 📁config
                ├── config.js
                ├── redis.db.js
            └── 📁controllers
                ├── admin.controller.js
            └── 📁middleware
                ├── auth.middleware.js
                ├── errorHandler.js
                ├── rateLimit.middleware.js
                ├── validate.js
            └── 📁routes
                ├── admin.routes.js
            └── 📁utils
                ├── AppError.js
                ├── cache.js
                ├── catchAsync.js
                ├── externalServices.js
                ├── response.js
            └── 📁validators
            ├── app.js
        ├── server.js
    └── 📁aiBuddy-service
        └── 📁docs
            ├── aiBuddy.md
        └── 📁src
            └── 📁agent
                └── 📁agents
                    ├── product-agent.js
                └── 📁tools
                    ├── product-tools.js
            └── 📁config
                ├── config.js
            └── 📁middleware
                ├── auth.middleware.js
                ├── errorHandler.js
                ├── rateLimit.middleware.js
                ├── validate.js
            └── 📁models
                ├── cart.model.js
            └── 📁sockets
                ├── socket.server.js
            └── 📁utils
                ├── AppError.js
                ├── catchAsync.js
                ├── response.js
                ├── token.js
            └── 📁validators
                ├── cart.Validation.js
            ├── app.js
        ├── server.js
    └── 📁auth-service
        └── 📁docs
            ├── docs-auth.md
            ├── LOGIN-IMPLEMENTATION-SUMMARY.md
            ├── README-Testing.md
        └── 📁src
            └── 📁config
                ├── config.js
                ├── db.js
            └── 📁controllers
                ├── address.controller.js
                ├── auth.controller.js
            └── 📁middleware
                ├── auth.middleware.js
                ├── errorHandler.js
                ├── rateLimit.middleware.js
                ├── validate.js
            └── 📁models
                ├── user.model.js
            └── 📁routes
                ├── address.route.js
                ├── auth.routes.js
            └── 📁utils
                ├── AppError.js
                ├── catchAsync.js
                ├── response.js
                ├── token.js
            └── 📁validators
                ├── addressValidator.js
                ├── authValidator.js
            ├── app.js
        ├── .env
        ├── server.js
    └── 📁cart-service
        └── 📁docs
            ├── cart-docs.md
        └── 📁src
            └── 📁config
                ├── config.js
                ├── db.js
            └── 📁controllers
                ├── cart.controller.js
            └── 📁middleware
                ├── auth.middleware.js
                ├── errorHandler.js
                ├── rateLimit.middleware.js
                ├── validate.js
            └── 📁models
                ├── cart.model.js
            └── 📁routes
                ├── cart.route.js
            └── 📁utils
                ├── AppError.js
                ├── catchAsync.js
                ├── externalService.js
                ├── response.js
                ├── token.js
            └── 📁validators
                ├── cart.Validation.js
            ├── app.js
        ├── server.js
    └── 📁docs
        ├── API-Docs.md
        ├── README.md
    └── 📁order-service
        └── 📁docs
            ├── order-docs.md
        └── 📁src
            └── 📁config
                ├── config.js
                ├── db.js
            └── 📁controllers
                ├── order.controller.js
            └── 📁middleware
                ├── auth.middleware.js
                ├── errorHandler.js
                ├── rateLimit.middleware.js
                ├── validate.js
            └── 📁models
                ├── order.model.js
            └── 📁routes
                ├── order.route.js
            └── 📁utils
                ├── AppError.js
                ├── catchAsync.js
                ├── externalServices.js
                ├── order.util.js
                ├── response.js
                ├── token.js
            └── 📁validators
                ├── addressValidator.js
                ├── order.validator.js
            ├── app.js
        ├── server.js
    └── 📁payment-service
        └── 📁docs
            ├── payment-docs.md
        └── 📁src
            └── 📁config
                ├── config.js
                ├── db.js
                ├── razorpay.config.js
            └── 📁controllers
                ├── payment.controller.js
            └── 📁middleware
                ├── auth.middleware.js
                ├── errorHandler.js
                ├── rateLimit.middleware.js
                ├── validate.js
            └── 📁models
                ├── payment.model.js
            └── 📁routes
                ├── payment.route.js
            └── 📁utils
                ├── AppError.js
                ├── catchAsync.js
                ├── externalService.js
                ├── response.js
                ├── token.js
            └── 📁validators
                ├── cart.Validation.js
            ├── app.js
        ├── server.js
    └── 📁product-service
        └── 📁docs
            ├── product-docs.md
        └── 📁src
            └── 📁config
                ├── config.js
                ├── db.js
            └── 📁controller
                ├── product.controller.js
            └── 📁middleware
                ├── auth.middleware.js
                ├── errorHandler.js
                ├── multer.middleware.js
                ├── rateLimit.middleware.js
                ├── validate.js
            └── 📁models
                ├── product.model.js
            └── 📁routes
                ├── product.routes.js
            └── 📁utils
                ├── AppError.js
                ├── catchAsync.js
                ├── response.js
                ├── token.js
            └── 📁validators
                ├── product.validator.js
            ├── app.js
        ├── server.js
    └── 📁seller-service
        └── 📁docs
            ├── seller-docs.md
        └── 📁src
            └── 📁config
                ├── config.js
                ├── db.js
                ├── redis.db.js
            └── 📁controller
                ├── seller.controller.js
            └── 📁middleware
                ├── auth.middleware.js
                ├── errorHandler.js
                ├── rateLimit.middleware.js
                ├── validate.js
            └── 📁routes
                ├── seller.routes.js
            └── 📁utils
                ├── AppError.js
                ├── cache.js
                ├── catchAsync.js
                ├── externalServices.js
                ├── response.js
            └── 📁validators
            ├── app.js
        ├── server.js
    ├── .env
    ├── gateway-README.md
    ├── main.js
    ├── package-lock.json
    └── package.json
```

✅ **Scalable & Maintainable**
Each service can be deployed, tested, and scaled independently.

✅ **Redis & Cache Layers**
Integrated in seller and admin services for performance optimization.

✅ **Rate Limiting + Validation Middleware**
Protects APIs from abuse and ensures reliable inputs.

✅ **Inter-Service Communication Ready**
Utils like `externalService.js` handle communication between microservices via REST or future message brokers (Kafka/RabbitMQ).

---

## 💡 Tech Stack

### 🖥 Backend

* Node.js, Express.js
* MongoDB + Mongoose
* Redis
* JWT Authentication
* Razorpay API Integration
* Socket.io (Real-time updates)
* RESTful Microservice APIs

### 💻 Frontend

* **Next.js 15 (App Router)**
* **React + Zustand + Shadcn UI**
* **TailwindCSS**
* **Axios (with Token-based Auth Middleware)**

The frontend is designed for **multiple dashboards**:

* **User Dashboard:** Product browsing, cart, checkout, order tracking
* **Seller Dashboard:** Product and order management
* **Admin Dashboard:** Platform-wide monitoring and management

Each dashboard is dynamically loaded using **route-based middleware** and **role checks** powered by cookies + Zustand state.

---

## 🧠 AI Integration

**AI Buddy Service**

* Uses agent-tool design to act as an AI shopping assistant.
* Handles user prompts like *“Find me Nike shoes and add to cart”*.
* Fetches results, filters products, and interacts with the cart service.
* Future-ready for LLM (Gemini / GPT) integration.

---

## 📁 Docs Included

Each service has detailed API documentation in `/docs`, e.g.:

* `auth-service/docs/docs-auth.md`
* `order-service/docs/order-docs.md`
* `product-service/docs/product-docs.md`
* `payment-service/docs/payment-docs.md`

`gateway-README.md` describes service orchestration at the API gateway level.

---

## 🧩 Key Features

* 🔐 Secure JWT-based Authentication
* 🛍️ Seller & Buyer Separation
* 💳 Razorpay Payment Integration
* ⚡ Redis Caching & Rate Limiting
* 🔁 Reusable Middleware & Utilities
* 🧱 Modular Microservice Design
* 🧭 Centralized Response Format
* 🧠 AI Assistant for Smart Cart
* 🧑‍💻 Clean Admin, Seller & User Dashboards (Frontend)

---

## 🔮 Future Enhancements

* Service-to-service communication via Message Queue (Kafka / RabbitMQ)
* Docker containerization for all services
* Kubernetes orchestration for scaling
* GraphQL API Gateway
* AI-enhanced product recommendation engine

---

## 🧾 Summary

> **CartFlow** isn’t just a project — it’s a full-blown architecture designed to show how **enterprise-grade modular systems** should be built using Node.js and Next.js.
> The focus isn’t on complexity — it’s on **clarity, scalability, and clean structure**, making it easy for any new developer to onboard or extend the system.


