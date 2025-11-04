# 💼 Payment Flow - Architecture & Visual Flows

Complete visual documentation of the payment flow architecture and all user journeys.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TALKCART PAYMENT SYSTEM                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐          ┌──────────────────────┐          ┌──────────┐
│   FRONTEND (Next)   │          │  BACKEND (Node)      │          │ DATABASE │
├─────────────────────┤          ├──────────────────────┤          │ (MongoDB)│
│                     │          │                      │          │          │
│ Payment Page        │──POST──→ │ /confirm-payment     │──→───────│ Order    │
│ (payment.tsx)       │  method  │ /confirm-cod-payment │          │ Users    │
│                     │  + orderId                      │          │ Products │
│ Vendor Dashboard    │──GET────→ │ /vendor/orders       │←─────────│ Notif's  │
│ (vendor-orders.tsx) │          │ /vendor/stats        │          │          │
│                     │──PUT────→ │ /orders/{id}/status  │          │          │
│ Order Details       │  tracking                       │          │          │
│ (orders/[id].tsx)   │          │ + notifications      │          │          │
│                     │←─SOCKET─→ │ (real-time updates)  │          │          │
└─────────────────────┘          └──────────────────────┘          └──────────┘
        ▲                                ▲                              ▲
        │ JWT Token                      │ Authentication              │ Queries
        │ in Headers                     │ + Authorization             │ Indexing
        │                                │ + Validation                │ Caching
        └────────────────────────────────┘                             └─────────
```

---

## 🎯 Complete Payment Flow - Step by Step

### PHASE 1: ORDER CREATION
```
Customer
  │
  ├─→ Browse Marketplace
  │     └─→ Add product to cart
  │
  └─→ Checkout
      │
      ├─→ Enter Shipping Address
      │   ├─ Full Name
      │   ├─ Email
      │   ├─ Phone ⭐ (critical for COD)
      │   ├─ Street Address
      │   ├─ City, State, Zip
      │   └─ Country
      │
      └─→ Create Order
          │
          └─→ Backend: Create Order
              └─→ Status: "pending"
              └─→ Payment Status: "pending"
              └─→ Save Order to DB
              └─→ Generate Order Number
              └─→ Redirect to Payment Page
```

**Database State:**
```javascript
Order {
  _id: ObjectId,
  orderNumber: "ORD-2025-001234",
  userId: customerId,
  items: [...products...],
  status: "pending",
  paymentStatus: "pending",
  shippingAddress: {
    name: "John Doe",
    phone: "+1234567890",
    address: "123 Main St",
    ...
  }
}
```

---

### PHASE 2: PAYMENT METHOD SELECTION

```
Payment Page (/marketplace/payment?orderId=xxx)
│
├─→ Display Three Payment Methods:
│
├─ Option 1: MOBILE MONEY 📱
│   ├─ Icon: Smartphone
│   ├─ Badge: "INSTANT"
│   ├─ Description: "Fast and secure via Flutterwave, MTN, Airtel..."
│   ├─ Process: Customer uses mobile money app
│   └─ Confirmation: Immediate
│
├─ Option 2: BANK TRANSFER 💰
│   ├─ Icon: Credit Card
│   ├─ Badge: "1-2 HOURS"
│   ├─ Description: "Direct bank transfer from your banking app"
│   ├─ Process: Customer transfers from their bank
│   └─ Confirmation: 1-2 hours verification
│
└─ Option 3: CASH ON DELIVERY 🏠
    ├─ Icon: Dollar Sign
    ├─ Badge: "PAY LATER"
    ├─ Description: "Pay when order arrives"
    ├─ Process: Vendor collects on delivery
    └─ Confirmation: Vendor confirms after collection
```

---

### PHASE 3: PAYMENT CONFIRMATION

```
┌──────────────────────────────────────────────────────────────────┐
│                  PAYMENT CONFIRMATION LOGIC                      │
└──────────────────────────────────────────────────────────────────┘

Scenario A: MOBILE MONEY / BANK TRANSFER
────────────────────────────────────────
Customer clicks "Confirm Payment"
          │
          ├─→ Frontend: POST /confirm-payment
          │   └─ Payload: {paymentMethod: "mobile_money"}
          │
          └─→ Backend Processing:
              │
              ├─ Validate: Order exists
              ├─ Validate: Order belongs to user (auth)
              ├─ Validate: Not already paid
              │
              ├─→ Update Order:
              │   ├─ paymentStatus = "confirmed"
              │   ├─ paymentConfirmedAt = NOW
              │   ├─ status = "paid" ⭐ IMMEDIATE
              │   └─ Save to DB
              │
              ├─→ Create Notification for VENDOR:
              │   ├─ Type: "payment_confirmed"
              │   ├─ Title: "Payment Received"
              │   ├─ Message: "Payment confirmed for order ORD-xxx. Amount: $100"
              │   └─ UserId: vendorId
              │
              └─→ Response to Frontend:
                  └─ {success: true, order: {...updated order...}}

Result: Order instantly moves to "PAID" status ✅


Scenario B: CASH ON DELIVERY
──────────────────────────────
Customer clicks "Confirm Payment"
          │
          └─→ Backend Processing:
              │
              ├─ Create Order as "pending"
              ├─ paymentStatus = "pending"
              ├─ status = "pending" (NOT paid yet!)
              │
              └─→ Notify VENDOR:
                  └─ Message: "New order received. Customer will pay COD."

[Later...]
Vendor receives cash from customer
          │
          └─→ Vendor clicks "Confirm COD Payment"
              │
              └─→ Backend: POST /confirm-cod-payment
                  │
                  ├─ Validate: Order is COD
                  ├─ Update: status = "paid"
                  ├─ Update: paymentStatus = "confirmed"
                  ├─ Update: paymentConfirmedAt = NOW
                  │
                  └─→ Notify CUSTOMER:
                      └─ "Payment confirmed by vendor"

Result: Order status changes to "PAID" after vendor confirms 🎯
```

---

## 📊 ORDER STATUS FLOW DIAGRAM

```
                        ORDER LIFECYCLE
                        ═══════════════

        ┌─────────────────────────────────────────────────────┐
        │          CUSTOMER SIDE EVENTS                        │
        └─────────────────────────────────────────────────────┘

 1️⃣  PENDING                    [Payment awaiting]
    └─→ Added to cart
    └─→ Checkout completed
    └─→ Order created
    └─→ Waiting for payment

        ↓ (Payment Confirmed)
        
 2️⃣  PAID                       [Money Received ✅]
    └─→ Payment confirmed
    └─→ Notification sent to vendor
    └─→ Vendor can now process
    └─→ Vendor dashboard shows paid orders

        ↓ (Vendor Actions Next)
        
        ┌─────────────────────────────────────────────────────┐
        │          VENDOR SIDE EVENTS                          │
        └─────────────────────────────────────────────────────┘

 3️⃣  PROCESSING                 [Preparing items]
    └─→ Vendor picks items
    └─→ Vendor packs order
    └─→ Customer notified: "Order being prepared"

        ↓ (Vendor adds tracking)
        
 4️⃣  SHIPPED                    [On the way 🚚]
    └─→ Vendor uploads tracking number
    └─→ Vendor selects carrier (DHL, FedEx, etc.)
    └─→ Vendor sets estimated delivery
    └─→ Customer sees tracking info
    └─→ Customer notified: "Order shipped! Tracking: ABC123"
    └─→ Progress bar moves to "Shipped"

        ↓ (Delivery arrives)
        
 5️⃣  DELIVERED                  [Arrived ✓]
    └─→ Vendor confirms delivery
    └─→ Customer can confirm receipt
    └─→ Customer notified: "Order delivered!"

        ↓ (Final stage)
        
 6️⃣  COMPLETED                  [Done 🎉]
    └─→ Vendor marks completed
    └─→ Order can be reviewed/rated
    └─→ No further changes allowed


Optional Exit States:
│
├─ CANCELLED
│   └─→ Anytime before shipped
│   └─→ Refund initiated
│
└─ REFUNDED
    └─→ Money returned to customer
```

---

## 🔄 Customer Order Journey - Timeline

```
TIME        CUSTOMER ACTION          SYSTEM STATE          NOTIFICATION
────────────────────────────────────────────────────────────────────────

T=0min      Adds to cart             Order: PENDING        None
            Checkouts with           PaymentStatus:        
            shipping info            PENDING

T=1min      Selects payment          
            method                   

T=2min      Clicks "Confirm          Order: PAID           ✉️ To Vendor:
            Payment"                 PaymentStatus:        "Payment Received
                                     CONFIRMED             Order ORD-xxx
                                     paymentConfirmedAt:   Amount: $100"
                                     2025-01-15 10:02

T=5min      [Customer waits]         [Vendor processing]

T=30min     [Customer receives       Order: PROCESSING     ✉️ To Customer:
            notification]                                  "Order being
                                                           prepared"

T=2hrs      [Vendor ships]           Order: SHIPPED        ✉️ To Customer:
                                     trackingNumber:       "Order shipped!
                                     "TRK123456789"        Tracking: TRK123456789"
                                     carrier: "DHL"        
                                     estimatedDelivery:    
                                     2025-01-17

T=3days     [Order arrives]          Order: DELIVERED      ✉️ To Customer:
            Customer receives                              "Order delivered!"
            package

T=3days+    [Vendor completes]       Order: COMPLETED      ✉️ To Customer:
            Order marked done                              "Order completed"

T=5days     [Customer can review]    Review available      Can leave rating
```

---

## 💾 DATABASE STATE AT EACH PHASE

### Phase 1: After Order Creation
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  orderNumber: "ORD-2025-001234",
  userId: ObjectId("user123"),
  items: [
    {
      productId: ObjectId("product456"),
      name: "Laptop",
      price: 999.99,
      quantity: 1,
      currency: "USD"
    }
  ],
  totalAmount: 999.99,
  currency: "USD",
  paymentMethod: "mobile_money",
  status: "pending",
  paymentStatus: "pending",
  shippingAddress: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  createdAt: "2025-01-15T10:00:00Z",
  updatedAt: "2025-01-15T10:00:00Z"
}
```

### Phase 2: After Payment Confirmation
```javascript
{
  ...previous fields...
  status: "paid",              // ⭐ CHANGED
  paymentStatus: "confirmed",  // ⭐ CHANGED
  paymentConfirmedAt: "2025-01-15T10:02:30Z",  // ⭐ NEW
  updatedAt: "2025-01-15T10:02:30Z"
}
```

### Phase 3: After Vendor Updates to "Shipped"
```javascript
{
  ...previous fields...
  status: "shipped",           // ⭐ CHANGED
  trackingNumber: "TRK123456789",  // ⭐ NEW
  carrier: "DHL",                  // ⭐ NEW
  shippedAt: "2025-01-15T11:30:00Z",  // ⭐ NEW
  estimatedDelivery: "2025-01-17T15:00:00Z",  // ⭐ NEW
  updatedAt: "2025-01-15T11:30:00Z"
}
```

### Phase 4: After Delivery
```javascript
{
  ...previous fields...
  status: "delivered",         // ⭐ CHANGED
  deliveredAt: "2025-01-17T14:45:00Z",  // ⭐ NEW
  updatedAt: "2025-01-17T14:45:00Z"
}
```

### Phase 5: Completed
```javascript
{
  ...previous fields...
  status: "completed",         // ⭐ CHANGED
  completedAt: "2025-01-17T16:00:00Z",  // ⭐ NEW
  updatedAt: "2025-01-17T16:00:00Z"
}
```

---

## 🎨 Frontend Component Interaction

```
┌────────────────────────────────────────────────────────────────┐
│                    FRONTEND COMPONENTS                         │
└────────────────────────────────────────────────────────────────┘

CUSTOMER FLOW:
──────────────
Layout
  ├─ Header [Auth, Notifications]
  │
  ├─ Cart Component
  │   └─ Shows items to checkout
  │   └─ Button → /marketplace/payment?orderId=xxx
  │
  ├─ Payment Page (payment.tsx)
  │   ├─ Order Summary Card (sticky)
  │   │   ├─ Items list
  │   │   ├─ Total amount
  │   │   └─ Shipping address preview
  │   │
  │   ├─ Payment Methods Section
  │   │   ├─ RadioGroup component
  │   │   │   ├─ Mobile Money radio
  │   │   │   ├─ Bank Transfer radio
  │   │   │   └─ Cash on Delivery radio
  │   │   │
  │   │   └─ Conditional Details Panel
  │   │       ├─ If Mobile Money: Show Flutterwave QR info
  │   │       ├─ If Bank Transfer: Show account details
  │   │       └─ If COD: Show vendor will collect message
  │   │
  │   └─ Confirm Button
  │       └─ Calls: api.confirmPayment(orderId, method)
  │
  └─ Order Details Page (orders/[id].tsx)
      ├─ Order Header
      │   ├─ Order ID
      │   └─ Status Badge
      │
      ├─ Order Items Section
      │   └─ List of purchased items
      │
      ├─ Order Progress Section ⭐
      │   └─ Stepper (Material-UI)
      │       ├─ Order Placed ✓
      │       ├─ Payment Confirmed ✓ (shows after payment)
      │       ├─ Processing
      │       ├─ Shipped
      │       ├─ Delivered
      │       └─ Completed
      │
      ├─ Shipping Information Section
      │   ├─ Delivery Address
      │   ├─ Contact Phone
      │   └─ Tracking Info (if shipped)
      │       ├─ Tracking Number
      │       ├─ Carrier
      │       └─ Est. Delivery Date
      │
      ├─ Order Summary Card
      │   ├─ Order ID
      │   ├─ Order Date
      │   ├─ Status
      │   ├─ Payment Method
      │   ├─ Payment Status
      │   └─ Total Amount
      │
      └─ Actions
          ├─ Track Order button
          ├─ Download Invoice button
          └─ Continue Shopping button


VENDOR FLOW:
────────────
Layout
  ├─ Header [Auth, Notifications, Seller Hub]
  │
  └─ Vendor Orders Dashboard (vendor-orders.tsx)
      ├─ Statistics Cards Section
      │   ├─ Total Orders: [count]
      │   ├─ Paid Orders: [count] ⭐
      │   ├─ Processing: [count]
      │   └─ Total Revenue: [amount]
      │
      ├─ Filters
      │   ├─ Status dropdown (All, Paid, Processing, Shipped, Delivered)
      │   └─ Payment Status dropdown (All, Pending, Confirmed)
      │
      ├─ Orders Table
      │   ├─ Order Number (sortable)
      │   ├─ Customer Name
      │   ├─ Customer Phone ⭐ (visible for COD contact)
      │   ├─ Amount
      │   ├─ Currency
      │   ├─ Status (chip with color)
      │   ├─ Payment Status
      │   ├─ Created Date
      │   └─ Actions
      │       ├─ View button
      │       └─ Update Status button
      │
      └─ Status Update Dialog
          ├─ Current Status: [display]
          ├─ New Status: [dropdown with valid transitions]
          │
          ├─ Conditional Fields:
          │   └─ If Status = "shipped":
          │       ├─ Tracking Number input
          │       ├─ Carrier dropdown
          │       └─ Est. Delivery date picker
          │
          ├─ Notes textarea
          │
          └─ Update / Cancel buttons
```

---

## 🔐 Security & Validation Layers

```
REQUEST FLOW WITH SECURITY CHECKS:

Client Request
    │
    ├─→ [1] JWT Token Validation
    │   └─ Token present in Authorization header?
    │   └─ Token not expired?
    │   └─ Token signature valid?
    │   └─ Extracts userId
    │
    ├─→ [2] Route-Level Authorization
    │   └─ Is this a vendor-only endpoint?
    │   └─ User role check (vendor/customer)
    │   └─ User.role === 'vendor'?
    │
    ├─→ [3] Resource Ownership Validation
    │   └─ Does order belong to this user?
    │   └─ user.userId === order.userId?
    │   └─ For vendors: Does vendor own products in this order?
    │
    ├─→ [4] Input Validation
    │   └─ OrderId: Valid MongoDB ObjectId format?
    │   └─ Status: Valid enum value?
    │   └─ Date fields: Valid ISO date format?
    │   └─ Numbers: Positive and reasonable?
    │
    ├─→ [5] Business Logic Validation
    │   └─ Status transition valid? (pending → paid → processing...)
    │   └─ Order not already completed/cancelled?
    │   └─ Order not already paid? (prevent double-payment)
    │   └─ Tracking fields required for "shipped"?
    │
    └─→ [6] Database Operation
        └─ Atomic update
        └─ Return updated document
        └─ Transaction support for multi-step operations
```

---

## 📈 Notification Flow

```
VENDOR NOTIFICATIONS:
──────────────────────
Payment Confirmed Event
    │
    └─→ Backend: POST /confirm-payment
        │
        ├─ Get vendor ID from first product in order
        │
        ├─ Create Notification Document:
        │   {
        │     userId: vendorId,
        │     type: "payment_confirmed",
        │     title: "Payment Received",
        │     message: "Payment confirmed for order ORD-xxx. Amount: $100",
        │     orderId: order._id,
        │     read: false,
        │     createdAt: NOW
        │   }
        │
        └─→ Frontend Real-time:
            ├─ WebSocket event or polling
            ├─ Badge updates (red dot on notifications icon)
            ├─ Notification appears in notification center
            └─ Toast notification (optional)


CUSTOMER NOTIFICATIONS:
──────────────────────
Status Update Event
    │
    └─→ Backend: PUT /orders/{id}/status
        │
        ├─ Determine notification message based on status:
        │   ├─ "processing": "Your order is being prepared for shipment"
        │   ├─ "shipped": "Your order is on the way! Tracking: ABC123"
        │   ├─ "delivered": "Your order has been delivered!"
        │   └─ "completed": "Your order has been completed"
        │
        ├─ Create Notification Document:
        │   {
        │     userId: order.userId,
        │     type: "order_shipped",
        │     title: "Order Shipped",
        │     message: "Your order is on the way! Tracking: ABC123",
        │     orderId: order._id,
        │     read: false,
        │     createdAt: NOW
        │   }
        │
        └─→ Frontend Real-time:
            ├─ WebSocket event or polling
            ├─ Badge updates
            ├─ Notification appears in center
            └─ User sees updated tracking info
```

---

## 🌐 API Endpoint Architecture

```
PAYMENT FLOW ENDPOINTS:

POST /api/marketplace/orders/:orderId/confirm-payment
├─ Purpose: Confirm digital payment (Mobile Money, Bank Transfer)
├─ Auth: JWT Required
├─ Ownership: User must own the order
├─ Body: { paymentMethod: "mobile_money" | "bank_transfer" }
├─ Response: { success: true, order: {...} }
└─ Side Effects: 
    ├─ order.status = "paid"
    ├─ order.paymentStatus = "confirmed"
    └─ Send vendor notification

POST /api/marketplace/orders/:orderId/confirm-cod-payment
├─ Purpose: Vendor confirms COD payment after receiving cash
├─ Auth: JWT Required
├─ Role: Vendor only
├─ Body: {}
├─ Response: { success: true, order: {...} }
└─ Side Effects:
    ├─ order.status = "paid"
    ├─ order.paymentStatus = "confirmed"
    └─ Send customer notification

GET /api/marketplace/vendor/orders
├─ Purpose: Retrieve vendor's orders (with customer details)
├─ Auth: JWT Required
├─ Role: Vendor only
├─ Query: ?status=paid&paymentStatus=confirmed&page=1&limit=20
├─ Response: { success: true, data: { orders: [...], total, pages } }
└─ Projection: 
    ├─ Includes: userId (displayName, email), items (name, price, qty)
    └─ Shows: shippingAddress.phone ⭐

PUT /api/marketplace/orders/:orderId/status
├─ Purpose: Update order status (vendor only)
├─ Auth: JWT Required
├─ Role: Vendor only
├─ Body: { 
│   status: "processing|shipped|delivered|completed",
│   trackingNumber?: "TRK123",
│   carrier?: "DHL",
│   estimatedDelivery?: "2025-01-17"
│ }
├─ Response: { success: true, order: {...} }
└─ Validations:
    ├─ Status transition valid
    ├─ Tracking required if status="shipped"
    └─ Vendor owns products in order

GET /api/marketplace/vendor/stats
├─ Purpose: Get vendor's order statistics
├─ Auth: JWT Required
├─ Role: Vendor only
├─ Response: { total, paid, processing, revenue: {...} }
└─ Performance:
    ├─ Aggregation pipeline on orders
    └─ Can be cached (5 min TTL)
```

---

## 📱 Response Examples

### Success Response (Payment Confirmed)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-2025-001234",
    "status": "paid",
    "paymentStatus": "confirmed",
    "paymentConfirmedAt": "2025-01-15T10:02:30Z",
    "totalAmount": 999.99,
    "currency": "USD",
    "items": [{...}],
    "shippingAddress": {...}
  },
  "message": "Payment confirmed successfully"
}
```

### Error Response (Unauthorized)
```json
{
  "success": false,
  "error": "Only vendors can update order status",
  "code": 403
}
```

### Error Response (Invalid Transition)
```json
{
  "success": false,
  "error": "Cannot transition from completed to processing",
  "code": 400
}
```

---

**✅ Complete Architecture Documented**

This architecture is scalable, secure, and production-ready.
