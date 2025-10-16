# CartFlow Backend Services API Reference

This document lists all backend services, their default ports, base routes and available endpoints with expected request data shapes (from validators). If a service uses environment variable `PORT`, the default value shown below is used when `PORT` is not set.

## Services

### Auth Service
- Location: `backend/auth-service`
- Default port: 3000 (override with `PORT` env)
- Base routes:
  - `/api/auth`
  - `/api/address`

Endpoints (auth):

- POST `/api/auth/register`
  - Body (JSON):
    - name: string (3-50) - required
    - email: string (email) - required
    - password: string (min 6) - required
    - role: string (`user` | `seller`) - required

- POST `/api/auth/login`
  - Body (JSON):
    - email: string (email) - required
    - password: string (min 6) - required

- GET `/api/auth/refresh`
- GET `/api/auth/logout`
- GET `/api/auth/profile/me` (protected)

Endpoints (address): (all protected)

- GET `/api/address/` - Returns addresses for authenticated user
- POST `/api/address/add`
  - Body (JSON):
    - street: string (max 100) - required
    - city: string (max 50) - required
    - state: string (max 50) - required
    - zip: string (max 20) - required
    - country: string (max 50) - required

- PATCH `/api/address/update/:id`
  - Body (JSON): any of the address fields (street, city, state, zip, country, isDefault)
  - Params: `id` (address id)

- DELETE `/api/address/delete/:id`
  - Params: `id` (address id)

---

### Cart Service
- Location: `backend/cart-service`
- Default port: 3002 (override with `PORT` env)
- Base route: `/api/cart`

All cart endpoints are protected (require authentication).

- GET `/api/cart/` - Get current user's cart
- POST `/api/cart/add`
  - Body (JSON):
    - productId: string (24-hex) - required
    - quantity: integer >=1 - optional

- PATCH `/api/cart/update`
  - Body (JSON):
    - productId: string (24-hex) - required
    - quantity: integer >=1 - required

- DELETE `/api/cart/remove/:itemId`
  - Params: `itemId`: string (24-hex) - required

- DELETE `/api/cart/clear` - Clear user's cart

---

### Order Service
- Location: `backend/order-service`
- Default port: 3003 (override with `PORT` env)
- Base route: `/api/order`

All order endpoints are protected.

- GET `/api/order/me/` - List orders for authenticated user
- GET `/api/order/me/:orderId`
  - Params validation: `orderId` string (24-hex) - required

- POST `/api/order/create`
  - Body (JSON): shipping address (see address schema in Auth Service)

- PATCH `/api/order/update/:orderId`
  - Body (JSON): address fields to update
  - Params: `orderId` (24-hex)

- PATCH `/api/order/order-status/:orderId`
  - Body (JSON):
    - status: one of `pending`, `confirmed`, `shipped`, `delivered`, `cancelled` (required)
  - Params: `orderId` (24-hex)

- PATCH `/api/order/payment-status/:orderId` - update payment status (controller handled)
- PATCH `/api/order/cancel/:orderId` - cancel order (params validated)

---

### Payment Service
- Location: `backend/payment-service`
- Default port: 3002 (override with `PORT` env)
- Base route: `/api/payment`

All payment endpoints are protected.

- GET `/api/payment/create/:orderId`
  - Params validation expects `orderId` (24-hex)
- POST `/api/payment/verify/:orderId` - verify payment for order
- GET `/api/payment/me` - list payments for authenticated user
- GET `/api/payment/me/:paymentId` - get payment by id

---

### Product Service
- Location: `backend/product-service`
- Default port: 3000 (override with `PORT` env)
- Base route: `/api/product`

Public endpoints:
- GET `/api/product/` - get all products
- GET `/api/product/:id` - get product by id

Protected endpoints (require authentication):
- POST `/api/product/decrease-stock`
  - Body (JSON):
    - productId: string (24 hex) - required
    - quantity: integer >=1 - required

- POST `/api/product/increase-stock`
  - Body (JSON): same as decrease-stock

Restricted to sellers/admin (access control applies):
- GET `/api/product/seller/me` - get products for authenticated seller
- POST `/api/product/add` (multipart/form-data)
  - Fields:
    - name: string
    - description: string
    - priceAmount: number
    - priceCurrency: string (USD|EUR|INR)
    - media: file (image) - required
    - stock: number (optional)

- PATCH `/api/product/update/:id` (multipart/form-data) - update product fields/media
- DELETE `/api/product/delete/:id` - delete product by id

---

### Seller Service
- Location: `backend/seller-service`
- Default port: 3005 (override with `PORT` env)

This service currently exposes a root endpoint and uses sockets; check `src/sockets/socket.server.js` for socket events. No public REST routes were found under `/api/*` in the repository.

---

### AiBuddy Service
- Location: `backend/aiBuddy-service`
- Default port: 3005 (override with `PORT` env)

This service exposes a root endpoint and includes agent/tools that interact with product/cart URLs. See `src/agent/tools/product-tools.js` for the JSON schema used by some tools.

---

## Notes & assumptions
- Ports listed use the service's `src/config/config.js` default values when `PORT` isn't provided via environment variables. If you use `.env` files or system env variables, those override the defaults.
- Request field shapes are taken from Joi/Zod validators found in `src/validators` where available. Controllers may accept additional optional fields not present in validators.
- Authentication: most routes use a `protect` middleware which expects a valid authentication token (check each service's `src/middleware/auth.middleware.js` for details).

## How to run (per-service)
From each service folder, install dependencies and start the server. Example (PowerShell):

```powershell
cd backend/auth-service; npm install; npm start
cd backend/cart-service; npm install; npm start
```

Repeat for other services; check each service's `package.json` `scripts` for exact start commands.

---

If you'd like, I can:
- Generate example curl/postman requests for each endpoint.
- Add OpenAPI/Swagger definitions.
- Extract socket event documentation from `seller-service` and `aiBuddy-service`.
