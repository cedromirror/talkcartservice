# 🎯 Payment Flow - Visual Flow Diagrams

**Purpose:** Understand the complete payment flow with visual diagrams  
**Audience:** Developers, Product Managers, QA  

---

## 🔄 MAIN PAYMENT FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TALKCART PAYMENT FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: SHOPPING & CHECKOUT
════════════════════════════════════════════════════════════════════════════════

Customer                    Frontend                      Backend
─────────                   ────────                      ───────

Browse Products
   │
   └─→ Add to Cart
       │
       └─→ View Cart
           │
           └─→ [Fill Shipping Address & Contact Phone]
               │
               └─→ Click "Complete Order"
                   │
                   └──────────────────→ POST /api/marketplace/orders
                                       ├─ Creates Order
                                       ├─ status: "pending"
                                       ├─ Stores phone number ← KEY!
                                       └─ Returns: orderId
                   ←──────────────────
                   toast: "Proceeding to payment..."
                   │
                   └─→ Redirect to /marketplace/payment?orderId=XYZ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 2: PAYMENT PAGE - METHOD SELECTION
════════════════════════════════════════════════════════════════════════════════

Customer              Frontend                Backend
─────────             ────────                ───────

Payment page loads
   │
   └─→ GET /api/marketplace/orders/:orderId
       ←─── Returns: Order object with items, total, etc.
   │
   ├─ Shows three payment methods:
   │  │
   │  ├─ 📱 MOBILE MONEY (INSTANT) ← Fastest
   │  │  └─ Flutterwave, MTN, Airtel
   │  │
   │  ├─ 💰 BANK TRANSFER (1-2 HOURS)
   │  │  └─ Direct bank transfer
   │  │
   │  └─ 🏠 CASH ON DELIVERY (PAY LATER)
   │     └─ Vendor confirms after receiving
   │
   └─→ Customer selects ONE method

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 3: PAYMENT CONFIRMATION
════════════════════════════════════════════════════════════════════════════════

BRANCH A: DIGITAL PAYMENTS (Mobile Money or Bank Transfer)
───────────────────────────────────────────────────────────

Customer                Frontend                Backend
─────────               ────────                ───────

Click "Confirm Payment"
   │
   └──────────→ POST /confirm-payment
               ├─ paymentMethod: "mobile_money" OR "bank_transfer"
               │
               └─────────────────────→ ✅ Validates:
                                       ├─ User owns order?
                                       ├─ Order exists?
                                       ├─ Not already paid?
                                       │
                                       └─ ✅ Updates Order:
                                          ├─ status: "PAID" ← GREEN BADGE
                                          ├─ paymentStatus: "confirmed"
                                          ├─ paymentConfirmedAt: NOW
                                          │
                                          └─ 📢 Creates Notification:
                                             ├─ To: Vendor
                                             ├─ Type: "payment_confirmed"
                                             └─ Message: "Payment received for order #XYZ"
               ←──────────────────────
   │
   ├─ toast.success("Payment confirmed! 🎉")
   │
   └─→ Wait 1.5 seconds
       │
       └─→ Redirect to /marketplace/orders/[orderId]
           │
           └─→ Order Details Page
               ├─ Status Badge: PAID (GREEN) ✓
               ├─ Payment Status: "confirmed" ✓
               ├─ Payment Method: "mobile_money" ✓
               └─ Progress Stepper: Payment Confirmed ✓


BRANCH B: CASH ON DELIVERY (COD)
─────────────────────────────────

Customer                Frontend                Backend
─────────               ────────                ───────

Click "Confirm Order"
   │
   └──────────→ POST /confirm-cod-payment
               │
               └─────────────────────→ ✅ Validates:
                                       ├─ Order exists?
                                       ├─ Payment method is COD?
                                       │
                                       └─ ✅ Updates Order:
                                          ├─ status: "PENDING" ← YELLOW
                                          ├─ paymentStatus: "pending"
                                          │
                                          └─ Ready for vendor
               ←──────────────────────
   │
   └─→ Order created with COD
       │
       └─→ Redirect to Order Details
           ├─ Status: PENDING (waiting for payment)
           └─ Vendor sees order in dashboard with customer PHONE


VENDOR SEES PAID ORDER IN DASHBOARD:
════════════════════════════════════

Vendor               Frontend                Backend
──────               ────────                ───────

Logs in
   │
   └─→ Go to /marketplace/vendor-orders
       │
       └─→ GET /api/marketplace/vendor/orders?status=paid
           │
           ├─────────────────────→ ✅ Backend:
           │                       ├─ Finds products by vendorId
           │                       ├─ Finds orders with those products
           │                       ├─ Filters by status = "paid"
           │                       └─ Returns with customer details
           │
           ←─────────────────────
           │
           └─→ Dashboard shows:
               ├─ Statistics Card:
               │  ├─ Total Orders: 5
               │  ├─ Paid Orders: 3 ← IMPORTANT
               │  ├─ Processing: 1
               │  └─ Total Revenue: $299.97
               │
               └─ Orders Table:
                  ├─ Order #ORD-001
                  │  ├─ Customer: John Doe
                  │  ├─ Amount: $99.99 (GREEN)
                  │  ├─ Status: PAID (GREEN) ✓
                  │  ├─ Phone: +1-234-567-8900 ← VENDOR CAN CALL!
                  │  ├─ Address: 123 Main St...
                  │  └─ Button: [Update Status]
                  │
                  ├─ Order #ORD-002
                  │  ├─ ... (same structure)
                  │
                  └─ ... (more orders)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 4: VENDOR ORDER MANAGEMENT
════════════════════════════════════════════════════════════════════════════════

Vendor                Frontend                Backend
──────                ────────                ───────

View Paid Order
   │
   └─→ Click [Update Status] button
       │
       └─→ Dialog opens:
           ├─ Current Status: PAID
           ├─ Next Status Options: [processing, cancelled]
           └─ Select: "processing"
               │
               └─→ Click [Update]
                   │
                   └─────────────→ PUT /api/marketplace/orders/:id/status
                                   ├─ Validates:
                                   │  ├─ User is vendor?
                                   │  ├─ Owns products in order?
                                   │  ├─ Valid transition? (paid→processing OK)
                                   │  │
                                   │  └─ Updates:
                                   │     ├─ status: "PROCESSING"
                                   │     │
                                   │     └─ 📢 Notification:
                                   │        ├─ To: Customer
                                   │        ├─ Message: "Your order is being prepared"
                   ←────────────────
                   │
                   └─→ Order updated!
                       toast: "Order updated to processing"
                       │
                       └─→ Table refreshes
                           └─ Status badge: PROCESSING (BLUE)


Vendor Prepares Package...
    │
    └─→ Click [Update Status] again
        │
        └─→ Dialog:
            ├─ Current Status: PROCESSING
            ├─ Next Status Options: [shipped, cancelled]
            └─ Select: "shipped"
                │
                └─→ New fields appear!
                    ├─ Tracking Number: [TRK123456789] ← REQUIRED
                    ├─ Carrier: [FedEx ▼] ← DROPDOWN
                    ├─ Est. Delivery: [2025-01-25] ← DATE PICKER
                    │
                    └─→ Click [Update]
                        │
                        └──────────→ PUT /api/marketplace/orders/:id/status
                                     ├─ status: "shipped"
                                     ├─ trackingNumber: "TRK123456789"
                                     ├─ carrier: "FedEx"
                                     ├─ estimatedDelivery: "2025-01-25"
                                     ├─ shippedAt: NOW
                                     │
                                     └─ 📢 Customer Notification:
                                        ├─ Message: "On the way!"
                                        ├─ Tracking: TRK123456789 ← SHOWN TO CUSTOMER
                                        └─ Est. Delivery: Jan 25
                        ←──────────


        CUSTOMER SEES UPDATE:
        ════════════════════

        Customer gets notification:
            "Your order is on the way! Tracking: TRK123456789"
                │
                └─→ Views order page
                    └─ Status: SHIPPED (BLUE)
                       Progress Stepper shows "Shipped" ✓
                       │
                       └─→ NEW SECTION APPEARS:
                           "Shipping Information"
                           ├─ Tracking Number: TRK123456789
                           ├─ Carrier: FedEx
                           ├─ Est. Delivery: Jan 25, 2025
                           └─ Can click to track at FedEx.com


Vendor After Delivery...
    │
    └─→ Click [Update Status] again
        │
        └─→ Dialog:
            ├─ Current Status: SHIPPED
            ├─ Next Status: [delivered, cancelled]
            └─ Select: "delivered"
                │
                └─────────────→ PUT /api/marketplace/orders/:id/status
                                ├─ status: "delivered"
                                ├─ deliveredAt: NOW
                                │
                                └─ 📢 Customer Notification:
                                   └─ Message: "Your order delivered!"
                ←─────────────


        CUSTOMER FINAL UPDATE:
        ═════════════════════

        Order page:
            ├─ Status: DELIVERED (GREEN) ✓
            ├─ Progress Stepper: COMPLETE ✓
            │  ├─ Order Placed ✓
            │  ├─ Payment Confirmed ✓
            │  ├─ Processing ✓
            │  ├─ Shipped ✓
            │  └─ Delivered ✓
            │
            └─ Can leave review/rating

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📊 STATUS TRANSITION DIAGRAM

```
                        COMPLETE ORDER LIFECYCLE

    ┌──────────┐
    │ PENDING  │  ← Order created, waiting for payment
    └────┬─────┘
         │
    ┌────▼─────────────────┐
    │ Customer Pays?        │
    └────┬─────────────────┘
         │
    ┌────▼─────┐
    │  PAID    │  ← Payment confirmed! ✓
    └────┬─────┘     (Digital: Automatic)
         │           (COD: Vendor confirms)
         │
    ┌────▼──────────────────────┐
    │ Vendor Updates Status?     │
    └────┬──────────────────────┘
         │
    ┌────▼─────────────┐
    │  PROCESSING      │  ← Vendor preparing package
    └────┬─────────────┘
         │
    ┌────▼──────────────────────────────────────┐
    │ Vendor adds Tracking & Ships Package      │
    └────┬──────────────────────────────────────┘
         │
    ┌────▼──────────┐
    │  SHIPPED      │  ← In transit ✓ Customer can track
    └────┬──────────┘     (Tracking Number + Est. Delivery)
         │
    ┌────▼──────────────────────────────┐
    │ Package Arrives at Customer Door  │
    └────┬──────────────────────────────┘
         │
    ┌────▼──────────┐
    │  DELIVERED    │  ← At destination ✓
    └────┬──────────┘
         │
    ┌────▼──────────────┐
    │  COMPLETED       │  ← All done! ✓
    │  (Final State)   │     Customer can review/rate
    └──────────────────┘


    POSSIBLE CANCELLATIONS:
    ══════════════════════

    From PENDING:   PENDING → CANCELLED
    From PAID:      PAID → CANCELLED
    From PROCESSING: PROCESSING → CANCELLED
    From SHIPPED:   SHIPPED → CANCELLED (rare, in transit)


    POSSIBLE REFUNDS:
    ═════════════════

    COMPLETED → REFUNDED (if customer requests return)
    DELIVERED → REFUNDED (if customer requests return)
```

---

## 💳 PAYMENT METHOD FLOW COMPARISON

```
PAYMENT METHOD COMPARISON MATRIX
════════════════════════════════════════════════════════════════════

┌──────────────────┬──────────────┬──────────────┬──────────────┐
│ Feature          │ Mobile Money │ Bank Trans.  │ COD          │
├──────────────────┼──────────────┼──────────────┼──────────────┤
│ Speed            │ ⚡ INSTANT   │ ⏱️ 1-2 hrs  │ 🏠 On Delivery│
│                  │              │              │              │
│ Payment When     │ Now          │ Now (verified│ Later        │
│                  │              │ 1-2 hrs)     │              │
│                  │              │              │              │
│ Who Confirms     │ ✓ Automatic  │ ✓ Automatic  │ Vendor only  │
│                  │   (System)   │   (System)   │ after cash   │
│                  │              │              │              │
│ Order Status     │ paid ✓       │ paid ✓       │ pending (then│
│ After Confirm    │              │              │ vendor→paid) │
│                  │              │              │              │
│ Customer Phone   │ ✓ Stored     │ ✓ Stored     │ ✓ Stored     │
│ Visibility       │ For vendor   │ For vendor   │ For vendor   │
│                  │              │              │              │
│ Vendor Action    │ Prepare &    │ Prepare &    │ Call customer│
│                  │ Ship         │ Ship         │ Arrange time │
│                  │              │              │              │
│ Best For         │ Urban areas  │ Corporate    │ Rural areas  │
│                  │ with service │ payments     │ No courier   │
│                  │              │              │              │
└──────────────────┴──────────────┴──────────────┴──────────────┘


DECISION TREE:
══════════════

                    Customer Places Order
                            │
                            ↓
                 Select Payment Method?
                   /         |         \
                  /          |          \
                 /           |           \
        Has Phone    Prefers Bank    Prefers Pay
        & Internet   Transfer?       on Delivery?
          /                |               \
         /                 |                \
        ✓ Mobile        ✓ Bank          ✓ COD
        Money           Transfer         (No payment now)
         │                 │                │
         ↓                 ↓                ↓
    Confirm        Confirm via        Order Created
    Instantly       Bank App          (Pending)
         │                 │                │
         ↓                 ↓                ↓
    Order Status:    Order Status:    Order Status:
    PAID (Green)     PAID (Green)     PENDING (Yellow)
         │                 │                │
         ↓                 ↓                ↓
    Vendor sees     Vendor sees     Vendor Calls
    in dashboard    in dashboard    Customer
         │                 │                │
         ↓                 ↓                ↓
    Prepares       Prepares         Arranges
    & Ships        & Ships          Pickup Time
         │                 │                │
         ↓                 ↓                ↓
    Customer       Customer         Vendor
    tracks         tracks           Confirms
    order          order            Cash
         │                 │                │
         ↓                 ↓                ↓
    Delivery       Delivery         Order→PAID
         │                 │                │
         ↓                 ↓                ↓
    ✓ Order      ✓ Order      ✓ Process
    Complete     Complete     Normally
```

---

## 🔐 SECURITY FLOW

```
AUTHENTICATION & AUTHORIZATION
═══════════════════════════════════════════════════════════════

User Request
    │
    └─→ All endpoints require JWT Token
        │
        └─→ authenticateTokenStrict middleware
            │
            ├─ Extract token from header
            ├─ Verify token signature
            ├─ Get userId from token
            │
            └─→ Attach req.user = { userId, role }


AUTHORIZATION BY ENDPOINT:
═══════════════════════════

1. POST /orders/:id/confirm-payment
   └─ Requirement: Order belongs to authenticated user
      Check: order.userId === req.user.userId
      Response: 403 if not owner

2. POST /orders/:id/confirm-cod-payment
   └─ Requirement: User authenticated
      Check: Token is valid
      Response: 403 if not authenticated

3. GET /vendor/orders
   └─ Requirement: User is vendor
      Check: user.role === 'vendor'
      Response: 403 if not vendor

4. PUT /orders/:id/status
   └─ Requirements:
      ├─ User is vendor: user.role === 'vendor'
      ├─ Vendor owns products in order
      └─ Status transition is valid
      Response: 403 if not authorized, 400 if invalid transition

5. GET /vendor/stats
   └─ Requirement: User is vendor
      Check: user.role === 'vendor'
      Response: 403 if not vendor


VALIDATION LAYERS:
═══════════════════

REQUEST VALIDATION:
    ├─ ObjectId format validation
    ├─ Enum value validation (status, paymentMethod)
    ├─ Date format validation
    └─ Required fields check


BUSINESS LOGIC VALIDATION:
    ├─ Order exists?
    ├─ User owns order?
    ├─ Status transition valid?
    ├─ Payment not double-processed?
    ├─ Vendor owns products?
    └─ Phone number valid format?


RESPONSE VALIDATION:
    ├─ Return only needed fields
    ├─ Never return sensitive data
    └─ Include appropriate error messages
```

---

## 🔄 DATA FLOW DIAGRAM

```
REQUEST JOURNEY THROUGH SYSTEM
═══════════════════════════════════════════════════════════════

Customer's Browser
    │
    │ POST /marketplace/orders/:id/confirm-payment
    │ {
    │   headers: { Authorization: "Bearer JWT_TOKEN" },
    │   body: { paymentMethod: "mobile_money" }
    │ }
    │
    ├─→ [Frontend API Library] (frontend/src/lib/api.ts)
    │   ├─ confirmPayment(orderId, paymentMethod)
    │   ├─ Add JWT token to headers
    │   ├─ Send POST request
    │   │
    │
    ├─→ [Network] (HTTP)
    │   │
    │   ├─→ [Backend Server]
    │
    │       ├─→ [Middleware]
    │       │   └─ authenticateTokenStrict
    │       │       ├─ Extract & verify JWT
    │       │       ├─ Get userId from token
    │       │       └─ Attach to req.user
    │       │
    │       ├─→ [Route Handler]
    │       │   └─ POST /orders/:orderId/confirm-payment
    │       │       ├─ Validate ObjectId
    │       │       ├─ Check user owns order
    │       │       ├─ Check not already paid
    │       │       │
    │       │       └─→ [Database Layer]
    │       │           ├─ Order.findById(orderId)
    │       │           ├─ Order.save()
    │       │           │
    │       │           └─→ [MongoDB]
    │       │               ├─ Find order document
    │       │               ├─ Update fields:
    │       │               │  ├─ status: "paid"
    │       │               │  ├─ paymentStatus: "confirmed"
    │       │               │  └─ paymentConfirmedAt: NOW
    │       │               └─ Save document
    │       │
    │       ├─→ [Notification Service]
    │       │   └─ Notification.create()
    │       │       ├─ Find vendor (from product)
    │       │       ├─ Create notification record
    │       │       └─ Store in database
    │       │
    │       └─→ [Response Handler]
    │           ├─ Build response:
    │           │  ├─ success: true
    │           │  ├─ message: "Payment confirmed"
    │           │  └─ data: updated order
    │           └─ Send response
    │
    │
    ├─← [Network] (HTTP Response)
    │   │
    ├─← [Frontend API Response Handler]
    │   ├─ Parse JSON response
    │   ├─ Check success flag
    │   ├─ Show toast notification
    │   └─ Redirect to order page
    │
    └─→ Customer sees "PAID" order ✓
```

---

## 📱 COMPONENT INTERACTION MAP

```
FRONTEND COMPONENT INTERACTION
═════════════════════════════════════════════════════════════

                        ┌─────────────────┐
                        │   Layout.tsx    │
                        │  (Header, Nav)  │
                        └────────┬────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
        ┌────────▼────────┐  ┌──▼──────────┐  ┌──▼──────────┐
        │  Cart.tsx       │  │ Payment.tsx │  │ Orders/[id]  │
        │                 │  │             │  │  .tsx        │
        │ ┌─────────────┐ │  │ ┌─────────┐ │  │ ┌──────────┐ │
        │ │ Add Item    │ │  │ │ 3 Methods│ │  │ │ Tracking │ │
        │ │ View Cart   │ │  │ │ Confirm  │ │  │ │ Status   │ │
        │ │ Checkout    │ │  │ │ Payment  │ │  │ │ Progress │ │
        │ └─────────────┘ │  │ └─────────┘ │  │ └──────────┘ │
        └────────┬────────┘  └──┬──────────┘  └──┬───────────┘
                 │              │                 │
                 └──────────────┬────────────────┘
                                │
                        ┌───────▼────────┐
                        │ api.ts (lib)   │
                        │                │
                        │ marketplace: { │
                        │ getVendorOrders│
                        │ updateOrderStat│
                        │ confirmPayment │
                        │ confirmCODPay  │
                        │ ...            │
                        │ }              │
                        └────────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼──────┐         ┌───────▼──────┐
            │ Marketplace  │         │ Orders       │
            │ Routes       │         │ Routes       │
            │              │         │              │
            │ /orders      │         │ /orders/:id  │
            │ /confirm-pay │         │ /status      │
            │ /vendor/*    │         │ /vendor/*    │
            └──────────────┘         └──────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Backend Routes       │
                    │  marketplace.js         │
                    │                         │
                    │ POST /confirm-payment   │
                    │ GET /vendor/orders      │
                    │ PUT /orders/:id/status  │
                    │ GET /vendor/stats       │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Database Models        │
                    │                         │
                    │ Order Model             │
                    │ Product Model           │
                    │ User Model              │
                    │ Notification Model      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     MongoDB             │
                    │  (Persistent Storage)   │
                    └─────────────────────────┘


VENDOR-ORDERS.TSX SPECIFIC FLOW:
════════════════════════════════

    Vendor Dashboard
            │
    ┌───────▼────────┐
    │ vendor-orders  │
    │ .tsx           │
    └───┬────────┬───┘
        │        │
        ├─→ getVendorOrders()  ──→ GET /vendor/orders
        │                          └─→ Returns paid orders
        │
        ├─→ getVendorStats()    ──→ GET /vendor/stats
        │                          └─→ Returns statistics
        │
        └─→ updateOrderStatus() ──→ PUT /orders/:id/status
                                    └─→ Updates with tracking

    When Vendor Clicks Update:
            │
            └─→ Dialog Opens
                ├─ Display current status
                ├─ Show valid next statuses
                ├─ If status="shipped":
                │  ├─ Show tracking number field
                │  ├─ Show carrier dropdown
                │  └─ Show date picker
                │
                └─→ On Submit:
                    └─ updateOrderStatus(id, {status, tracking})
                       ├─ Call backend
                       ├─ Refresh orders list
                       ├─ Refresh stats
                       └─ toast.success()
```

---

## 🎬 COMPLETE SEQUENCE DIAGRAM

```
TIME →

Customer  │  Frontend  │  Backend   │  Database │  Vendor
          │            │            │           │
          │            │            │           │
    [1] Browse product           │           │           │
    ─────────────────→           │           │           │
          │            │            │           │           │
    [2] Add to cart               │           │           │
    ─────────────────→            │           │           │
          │            │            │           │           │
    [3] Checkout (fill phone)     │           │           │
    ─────────────────→            │           │           │
          │            │            │           │           │
    [4]              POST /orders
          │            ├──────────────────────→│           │
          │            │            │           │           │
    [5]               ←──────────────────────┤ │           │
          │            │            │ Save order
          │            │            ├──────────→
          │            │            │ Returns  │
          │            │            │←─────────┤
    [6] Redirect to payment page   │           │           │
    ←────────────────┤            │           │           │
          │            │            │           │           │
    [7] Select method & confirm   │           │           │
    ─────────────────→            │           │           │
          │            │            │           │           │
    [8]             POST /confirm-payment      │           │
          │            ├──────────────────────→│           │
          │            │            │           │           │
    [9]               ├─ Validate  │           │           │
          │            ├─ Check own│           │           │
          │            │            │           │           │
    [10]              UPDATE order │           │           │
          │            │            ├──────────→│           │
          │            │            │ status=pay│           │
          │            │            │ paymentSta│ Saved ✓   │
          │            │            │←─────────┤
          │            │            │           │           │
    [11]              CREATE notification     │           │
          │            │            ├──────────→│           │
          │            │            │ For vendor│           │
          │            │            │←─────────┤
          │            │            │           │           │
    [12]               ←──────────────────────┤ │           │
    ├─ Toast success  │            │           │           │
    ├─ Redirect to    │            │           │           │
    │   order page    │            │           │           │
    │    │            │            │           │           │
    │    ├─→ See PAID status       │           │           │
    │            │            │           │           │
    │    ...continues viewing...  │           │           │
    │            │            │           │           │
          │            │            │           │      [13] Vendor
          │            │            │           │           notified
          │            │            │           │    ─────────────
          │            │            │           │           │
          │            │            │           │      [14] Vendor
          │            │            │           │           login
          │            │            │           │      ─────────────
          │            │            │           │           │
          │            │            │           │      [15] Get vendor
          │            │            │           │           orders
          │            │            │           │      ─────────────
          │            │            │           │           │
          │   GET /vendor/orders   │           │           │
          │            ├──────────────────────→│           │
          │            │            │           │           │
          │            ├─ Find vendor products │           │
          │            ├─ Find orders with paid│ Fetch    │
          │            │  status              │ orders
          │            │            ├──────────→
          │            │            │           ├──→  See orders
          │            │            │←─────────┤
          │            ├──────────────────────┤ │           │
          │            │  Returns orders      │           │
          │            ├─ With customer phone │           │
          │            ├─ With address       │           │
          │            ├─ With status        │           │
          │            │            │           │           │
          │    ←────────────────────┤ │           │
          │            │            │           │      [16] View
          │            │            │           │           orders
          │            │            │           │      ─────────────
          │            │            │           │           │
          │            │            │           │           │
          │            │            │           │      [17] Click
          │            │            │           │           Update
          │            │            │           │      ─────────────
          │            │            │           │           │
          │            │            │           │      [18] Fill
          │            │            │           │           tracking
          │            │            │           │      ─────────────
          │            │            │           │           │
          │   PUT /orders/:id/status│           │           │
          │            ├──────────────────────→│           │
          │            │            │           │           │
          │            ├─ Validate vendor     │           │
          │            ├─ Check transition   │           │
          │            │            │           │           │
          │            ├─ UPDATE status      │           │
          │            │  shippedAt, tracking │           │
          │            │  estimatedDelivery  │           │
          │            ├──────────────────────→
          │            │            │ status=ship
          │            │            │ tracking   │ Saved ✓
          │            │            │←─────────┤
          │            │            │           │           │
          │            ├─ CREATE notification │           │
          │            │  For CUSTOMER        │           │
          │            │    (not vendor)     │           │
          │            │            ├──────────→
          │            │            │ Saved     │           │
          │            │            │←─────────┤
          │            │            │           │           │
          │    ←────────────────────┤ │           │
          │            │            │           │           │
    [19] Get notification           │           │           │
    ┌─────────────────→            │           │           │
    │ "On the way!"    │            │           │           │
    │ Tracking: TRK..  │            │           │           │
    │                  │            │           │           │
    [20] View order    │            │           │           │
    ├─ Status: SHIPPED │            │           │           │
    ├─ Tracking info   │            │           │           │
    │ appears          │            │           │           │
    │                  │            │           │           │
    ... (continues through delivery)
```

---

## 🎯 SUMMARY

This visual guide shows:

1. **Main Flow** - Customer → Payment → Vendor Management → Delivery
2. **Status Transitions** - Valid paths through order lifecycle
3. **Payment Comparison** - When to use each payment method
4. **Security Layers** - Authentication and authorization checks
5. **Data Flow** - How requests travel through the system
6. **Component Interaction** - How frontend components communicate
7. **Sequence Diagram** - Time-ordered interaction between all parties

Use these diagrams when:
- Onboarding new developers
- Explaining to stakeholders
- Troubleshooting issues
- Making improvements
- Training support team

---

**Last Updated:** January 20, 2025  
**Status:** Complete & Ready for Reference  
