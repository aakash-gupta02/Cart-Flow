# ❤Auth Routes

### POST `/register`
- Registers a new user.
- Body: User registration data (validated).

### POST `/login`
- Authenticates a user and returns tokens.
- Body: User login data (validated).
- Rate limited (20 requests).

### GET `/refresh`
- Refreshes authentication tokens.

### GET `/logout`
- Logs out the current user.

### GET `/profile/me`
- Returns the authenticated user's profile.
- Requires authentication.

## Address Routes (Protected)

All routes require authentication.

### GET `/`
- Retrieves the authenticated user's addresses.

### POST `/add`
- Adds a new address for the user.
- Body: Address data (validated).

### PATCH `/update/:id`
- Updates an existing address by ID.
- Body: Address update data (validated).

### DELETE `/delete/:id`
- Deletes an address by ID.



---

## 🧡Cart Routes (Protected)

All routes require authentication.

### GET `/cart/`
- Retrieves the authenticated user's cart.

### POST `/cart/add`
- Adds a product to the cart.
- Body: `{ productId, quantity }` (validated).

### PATCH `/cart/update`
- Updates the quantity of a product in the cart.
- Body: `{ productId, quantity }` (validated).

### DELETE `/cart/remove/:itemId`
- Removes an item from the cart by item ID.

### DELETE `/cart/clear`
- Clears all items from the cart.

--- 


## 💙Product Routes

All product routes require authentication and appropriate roles unless otherwise specified.

### GET `/products/`
- Retrieves all products.
- Public route.

### GET `/products/:id`
- Retrieves a product by its ID.
- Public route.

### GET `/products/seller/me`
- Retrieves all products listed by the authenticated seller.
- Requires authentication as seller or admin.

### POST `/products/add`
- Adds a new product.
- Requires authentication as seller or admin.
- Body: Product data (validated).
- Accepts image upload.

### PATCH `/products/update/:id`
- Updates an existing product by ID.
- Only the product owner (seller) can update.
- Body: Product update data (validated).
- Accepts image upload.

### DELETE `/products/delete/:id`
- Deletes a product by ID.
- Only the product owner (seller) or admin can delete.
- Requires authentication.