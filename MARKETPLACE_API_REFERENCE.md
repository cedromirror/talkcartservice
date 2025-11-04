# 🔌 MARKETPLACE API REFERENCE

**Base URL**: `http://localhost:8000/api/marketplace`  
**Authentication**: Bearer token required for private endpoints

---

## 🛒 SHOPPING CART ENDPOINTS

### Get User's Cart
```
GET /cart
Authentication: Required
Response: { items: [], totalItems: 0, totalPrice: 0 }
```

### Add Product to Cart
```
POST /cart/add
Authentication: Required
Body: { productId: string, quantity: number }
Response: { items: [], totalItems: 0, totalPrice: 0 }
```

### Update Cart Item Quantity
```
PUT /cart/:productId
Authentication: Required
Body: { quantity: number }
Response: { items: [], totalItems: 0, totalPrice: 0 }
```

### Remove Item from Cart
```
DELETE /cart/:productId
Authentication: Required
Response: { items: [], totalItems: 0, totalPrice: 0 }
```

### Clear Cart
```
DELETE /cart
Authentication: Required
Response: { success: true }
```

### Checkout
```
POST /cart/checkout
Authentication: Required
Body: { shippingAddress: object, paymentMethod: string }
Response: { orderId: string, status: string }
```

---

## ⭐ PRODUCT REVIEWS ENDPOINTS

### Get Product Reviews
```
GET /products/:productId/reviews?page=1&limit=10
Authentication: Optional
Response: { reviews: [], pagination: {} }
```

### Get Review Statistics
```
GET /products/:productId/reviews/stats
Authentication: Optional
Response: { averageRating: 4.5, totalReviews: 100, ratingDistribution: {} }
```

### Submit Review
```
POST /products/:productId/reviews
Authentication: Required
Body: { rating: 1-5, title: string, comment: string }
Response: { _id: string, rating: 5, title: string, comment: string }
```

### Mark Review as Helpful
```
POST /reviews/:reviewId/helpful
Authentication: Required
Response: { helpfulVotes: 10 }
```

### Delete Review
```
DELETE /reviews/:reviewId
Authentication: Required
Response: { success: true }
```

---

## 💡 RECOMMENDATIONS ENDPOINTS

### Get Personalized Recommendations
```
GET /recommendations/:userId?limit=6
Authentication: Optional
Response: [{ _id: string, name: string, price: number, ... }]
```

---

## 📊 VENDOR ANALYTICS ENDPOINTS

### Get Current Vendor Analytics
```
GET /vendor/analytics
Authentication: Required
Response: {
  totalSales: 100,
  totalRevenue: 5000,
  totalOrders: 50,
  averageRating: 4.5,
  totalReviews: 200,
  totalProducts: 25,
  topProducts: [],
  orderStatus: { pending: 5, completed: 40, cancelled: 5 }
}
```

### Get Specific Vendor Analytics
```
GET /vendor/:vendorId/analytics
Authentication: Required (Admin)
Response: { same as above }
```

---

## 🚚 SHIPPING ENDPOINTS

### Create Shipping Record
```
POST /shipping
Authentication: Required
Body: {
  orderId: string,
  shippingAddress: object,
  shippingMethod: 'standard|express|overnight|pickup',
  carrier: 'fedex|ups|usps|dhl|local'
}
Response: { _id: string, status: 'pending', trackingNumber: string }
```

### Get Shipping Details
```
GET /shipping/:shippingId
Authentication: Required
Response: { _id: string, status: string, trackingNumber: string, ... }
```

### Update Shipping Status
```
PATCH /shipping/:shippingId
Authentication: Required
Body: {
  status: 'shipped|in_transit|delivered|failed',
  trackingNumber: string,
  trackingEvent: { status: string, location: string, description: string }
}
Response: { _id: string, status: string, trackingEvents: [] }
```

---

## 📦 INVENTORY ENDPOINTS

### Get Product Inventory
```
GET /inventory/:productId
Authentication: Required
Response: {
  _id: string,
  totalStock: 100,
  availableStock: 80,
  reservedStock: 20,
  reorderLevel: 10,
  lowStockAlert: false
}
```

### Create Inventory Record
```
POST /inventory
Authentication: Required
Body: { productId: string, totalStock: number, reorderLevel: 10, sku: string }
Response: { _id: string, totalStock: 100, availableStock: 100 }
```

### Update Inventory Stock
```
PATCH /inventory/:productId
Authentication: Required
Body: { quantity: number, type: 'add|remove', reason: string }
Response: { _id: string, totalStock: 120, availableStock: 100 }
```

---

## 🔄 RETURNS & REFUNDS ENDPOINTS

### Request Return
```
POST /returns
Authentication: Required
Body: {
  orderId: string,
  items: [{ productId: string, quantity: number, price: number, reason: string }],
  reason: string
}
Response: { _id: string, status: 'requested', refund: { amount: 100 } }
```

### Get Return Details
```
GET /returns/:returnId
Authentication: Required
Response: { _id: string, status: string, refund: {}, items: [] }
```

### Approve Return
```
PATCH /returns/:returnId/approve
Authentication: Required (Vendor)
Response: { _id: string, status: 'approved', approvedDate: string }
```

### Reject Return
```
PATCH /returns/:returnId/reject
Authentication: Required (Vendor)
Body: { reason: string }
Response: { _id: string, status: 'rejected', rejectionReason: string }
```

### Process Refund
```
PATCH /returns/:returnId/refund
Authentication: Required (Vendor)
Body: { transactionId: string }
Response: { _id: string, status: 'refunded', refund: { status: 'processed' } }
```

---

## 🔐 AUTHENTICATION

All private endpoints require:
```
Authorization: Bearer <token>
```

Token obtained from login endpoint:
```
POST /auth/login
Body: { email: string, password: string }
Response: { token: string, user: {} }
```

---

## ❌ ERROR RESPONSES

### 400 Bad Request
```json
{ "success": false, "error": "Invalid product ID" }
```

### 401 Unauthorized
```json
{ "success": false, "error": "Authentication required" }
```

### 403 Forbidden
```json
{ "success": false, "error": "Unauthorized" }
```

### 404 Not Found
```json
{ "success": false, "error": "Product not found" }
```

### 500 Server Error
```json
{ "success": false, "error": "Internal server error" }
```

---

## 📝 NOTES

- All timestamps are in ISO 8601 format
- All prices are in the specified currency (default: USD)
- Pagination defaults: page=1, limit=10
- All endpoints return `{ success: boolean, data: object, message: string }`
- Rate limiting: 100 requests per minute per IP
- CORS enabled for frontend domain

---

**Last Updated**: 2025-10-25  
**API Version**: 1.0

