# 🛒 Payment Flow Implementation Guide

## Overview

This document outlines the complete payment flow implementation for the TalkCart marketplace, from order creation through delivery and payment confirmation.

---

## Complete Flow Diagram

```
CUSTOMER JOURNEY:
┌─────────────────────────────────────────────────────────────────┐
│ 1. SHOPPING CART                                                │
│    ├─ Browse products                                          │
│    ├─ Add items to cart                                        │
│    └─ Review cart items & total                                │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. CHECKOUT (CartSummary Component)                             │
│    ├─ Enter shipping address                                   │
│    │  ├─ Full Name                                            │
│    │  ├─ Email                                                │
│    │  ├─ Street Address                                       │
│    │  ├─ City                                                 │
│    │  ├─ State/Province                                       │
│    │  ├─ Country                                              │
│    │  └─ Zip Code                                             │
│    │                                                          │
│    └─ Enter delivery contact phone                            │
│       └─ Vendor will use this to contact during delivery      │
│                                                               │
│    🔘 Order Created in Backend                               │
│       Status: "pending"                                       │
│       PaymentStatus: "pending"                                │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. PAYMENT SELECTION (/marketplace/payment?orderId=...)        │
│    ├─ Order Summary Display                                    │
│    │  ├─ Items list                                          │
│    │  ├─ Total amount                                        │
│    │  └─ Shipping address                                    │
│    │                                                          │
│    └─ Payment Method Selection 📱                             │
│       ├─ 📱 Mobile Money (INSTANT)                           │
│       │  └─ Redirect to Flutterwave payment gateway          │
│       │                                                       │
│       ├─ 💰 Bank Transfer (1-2 HOURS)                        │
│       │  └─ Manual confirmation via reference               │
│       │                                                       │
│       └─ 🏠 Cash on Delivery (PAY LATER)                     │
│          └─ Vendor collects payment on delivery             │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. PAYMENT CONFIRMATION                                         │
│                                                                 │
│ Mobile Money / Bank Transfer Path:                             │
│ ├─ POST /api/marketplace/orders/{orderId}/confirm-payment      │
│ ├─ Order Status: "pending" ➜ "paid" ✅                        │
│ ├─ PaymentStatus: "pending" ➜ "confirmed"                     │
│ ├─ 📧 Notification sent to vendor                             │
│ └─ User redirected to order details                           │
│                                                                 │
│ Cash on Delivery Path:                                         │
│ ├─ Status remains "pending" until vendor confirms              │
│ └─ Vendor confirms after receiving cash                        │
│    ├─ POST /api/marketplace/orders/{orderId}/confirm-cod-payment│
│    ├─ Order Status: "pending" ➜ "paid" ✅                    │
│    └─ PaymentStatus: "pending" ➜ "confirmed"                 │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. ORDER STATUS PAGE (/marketplace/orders/{id})                 │
│    ├─ Shows Order Number                                       │
│    ├─ Shows Payment Status: ✅ PAID                            │
│    ├─ Shows Order Progress:                                    │
│    │  ├─ ✅ Order Placed                                      │
│    │  ├─ ✅ Payment Confirmed                                 │
│    │  ├─ ⏳ Processing                                        │
│    │  ├─ ⏳ Shipped                                           │
│    │  └─ ⏳ Delivered                                         │
│    └─ Shipping details displayed                              │
│       ├─ Address                                              │
│       ├─ Contact phone                                        │
│       └─ Tracking info (when available)                       │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. VENDOR DASHBOARD                                             │
│    ├─ 📊 See incoming PAID orders                              │
│    │  └─ Filter by status: "paid" ✅                          │
│    │                                                          │
│    ├─ 📞 Vendor receives customer's delivery phone            │
│    │  └─ Can contact to arrange delivery                     │
│    │                                                          │
│    ├─ Mark as Processing                                      │
│    │  └─ Status: "paid" ➜ "processing"                       │
│    │     └─ Vendor starts preparing order                    │
│    │                                                          │
│    ├─ Add Tracking Number                                     │
│    │  └─ When order ships                                    │
│    │                                                          │
│    └─ Mark as Delivered                                       │
│       └─ Final confirmation                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features Implemented

### 1. ✅ Order Creation with Contact Phone
**File:** `backend/routes/marketplace.js` (POST `/api/marketplace/cart/checkout`)

```javascript
// Order is created with:
{
  orderNumber: "ORD-{timestamp}-{random}",
  status: "pending",           // Initial status
  paymentStatus: "pending",    // Payment not confirmed yet
  paymentMethod: "mobile_money",
  shippingAddress: {
    name: String,
    email: String,
    phone: String,            // 👈 Delivery contact phone
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  }
}
```

### 2. ✅ Payment Method Selection
**File:** `frontend/pages/marketplace/payment.tsx`

Three payment methods available:

#### Mobile Money (Instant)
- Status changes immediately to "paid"
- Vendor receives notification
- Uses Flutterwave gateway

#### Bank Transfer (1-2 Hours)
- Status changes immediately to "paid" 
- User provides reference number
- Vendor receives notification

#### Cash on Delivery (Manual)
- Status remains "pending" until vendor confirms
- Vendor will call customer using the delivery phone number
- Vendor confirms payment after collecting cash

### 3. ✅ Backend Payment Confirmation Endpoints

#### Endpoint 1: Payment Confirmation (Mobile Money / Bank Transfer)
```http
POST /api/marketplace/orders/{orderId}/confirm-payment
Content-Type: application/json

{
  "paymentMethod": "mobile_money"  // or "bank_transfer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "paid",
    "paymentStatus": "confirmed",
    "paymentConfirmedAt": "2025-01-20T10:30:00Z",
    "orderNumber": "ORD-..."
  }
}
```

**Side Effects:**
- ✅ Order status changed from "pending" to "paid"
- ✅ PaymentStatus changed to "confirmed"
- ✅ Vendor receives notification: "Payment Received for Order ORD-..."
- ✅ paymentConfirmedAt timestamp set

#### Endpoint 2: Cash on Delivery Confirmation (Vendor)
```http
POST /api/marketplace/orders/{orderId}/confirm-cod-payment
Content-Type: application/json

{}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "paid",
    "paymentStatus": "confirmed",
    "paymentConfirmedAt": "2025-01-20T10:30:00Z"
  }
}
```

**Side Effects:**
- ✅ Only vendor can confirm COD payments
- ✅ Called after vendor receives cash from customer
- ✅ Order status: "pending" → "paid"

#### Endpoint 3: Get Order Details
```http
GET /api/marketplace/orders/{orderId}
```

**Returns full order with payment status**

### 4. ✅ Frontend Payment Flow

**Step-by-Step:**

1. **Cart Page** → User adds items and proceeds to checkout
2. **CartSummary Component** → Collects shipping address & delivery phone
3. **Payment Page** → Shows order summary & payment method selection
4. **Confirm Payment** → Calls appropriate endpoint based on method selected
5. **Order Details** → Shows order with "Paid" status and progress tracker

### 5. ✅ Order Status Progression

```
pending → paid → processing → shipped → delivered
         ✅      (Vendor)     (Vendor)   (Vendor)
      (Auto)     starts        ships    confirms
              preparation   package    delivery
```

---

## Database Schema Updates

### Order Model Changes

```javascript
// NEW FIELDS ADDED:
paymentStatus: {
  type: String,
  enum: ['pending', 'confirmed', 'failed'],
  default: 'pending'
},

paymentConfirmedAt: Date,  // When payment was confirmed

// UPDATED ENUM:
status: {
  enum: [
    'pending',       // Order created, awaiting payment
    'paid',          // 👈 NEW - Payment confirmed
    'processing',    // Vendor preparing order
    'shipped',       // Order in transit
    'delivered',     // Delivered to customer
    'completed',     // All done
    'cancelled',
    'refunded'
  ]
}

// PAYMENT METHODS ADDED:
paymentMethod: {
  enum: [
    'stripe',
    'flutterwave',
    'crypto',
    'nft',
    'mobile_money',        // 👈 NEW
    'bank_transfer',       // 👈 NEW
    'cash_on_delivery'     // 👈 NEW
  ]
}
```

---

## Frontend Components

### 1. Payment Page Component
**File:** `frontend/pages/marketplace/payment.tsx`

**Features:**
- Displays order summary (items, total, shipping address)
- Radio button selection for payment method
- Method-specific instructions
- Confirm button for payment
- Error handling and loading states

### 2. Updated Order Details Page
**File:** `frontend/pages/marketplace/orders/[id].tsx`

**New Status Display:**
- Shows payment status badge
- Updated progress stepper includes "Payment Confirmed" step
- Color coding: "paid" = green ✅

### 3. Updated Cart Page
**File:** `frontend/pages/marketplace/cart.tsx`

**Change:**
- Redirects to `/marketplace/payment?orderId={...}` after checkout
- No longer redirects directly to order details

---

## Vendor Dashboard Integration

### Vendor Can Now:

1. **View "Paid" Orders**
   - Filter/query orders with status = "paid"
   - See customer's delivery contact phone number
   - Prepare order for shipping

2. **Confirm COD Payments**
   - After customer pays in cash
   - Call endpoint: POST `/marketplace/orders/{orderId}/confirm-cod-payment`
   - Automatically transitions order to "processing"

3. **Manage Order Status**
   - paid → processing (start preparing)
   - processing → shipped (add tracking info)
   - shipped → delivered (confirm delivery)

---

## API Testing Guide

### Test Mobile Money Payment

```bash
# 1. Create order through checkout
POST /api/marketplace/cart/checkout
{
  "shippingAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Kigali",
    "state": "Kigali",
    "country": "Rwanda",
    "zipCode": "00000"
  },
  "paymentMethod": "mobile_money",
  "contactPhone": "+250 788 123 456"
}

# 2. Confirm payment
POST /api/marketplace/orders/{orderId}/confirm-payment
{
  "paymentMethod": "mobile_money"
}

# 3. Verify order status changed to "paid"
GET /api/marketplace/orders/{orderId}
# Response should show: status: "paid", paymentStatus: "confirmed"
```

### Test Cash on Delivery

```bash
# 1. Create order (same as above, but paymentMethod: "cash_on_delivery")

# 2. Customer receives order, pays vendor cash

# 3. Vendor confirms payment
POST /api/marketplace/orders/{orderId}/confirm-cod-payment
{}

# 4. Verify status is now "paid"
```

---

## Payment Flow Summary Table

| Step | Status Before | Action | Status After | Triggered By |
|------|--------------|--------|-------------|------------|
| 1 | - | Create order | pending | Customer checkout |
| 2a | pending | Confirm mobile/bank | **paid** | Customer confirmation |
| 2b | pending | Vendor confirms COD | **paid** | Vendor after cash |
| 3 | paid | Vendor marks processing | processing | Vendor |
| 4 | processing | Vendor ships order | shipped | Vendor + tracking |
| 5 | shipped | Delivery confirmed | delivered | Vendor |
| 6 | delivered | Order completed | completed | System/automatic |

---

## Notifications to Vendor

When a payment is confirmed (Mobile Money / Bank Transfer), vendor receives:

```
Title: "Payment Received"
Message: "Payment confirmed for order ORD-XXXXX. Amount: USD 150.00"
Type: "payment_confirmed"
```

**Vendor can then:**
- Prepare the order immediately
- Contact customer using phone number provided
- Mark as "processing" when ready to ship

---

## Error Handling

### Common Error Scenarios

1. **Order Already Paid**
   - Trying to confirm payment twice
   - Response: 200 with message "Order is already paid"

2. **Invalid Order ID**
   - Returns: 400 Bad Request

3. **Unauthorized Access**
   - User trying to confirm payment for someone else's order
   - Returns: 403 Forbidden

4. **Payment Method Mismatch**
   - Trying to call COD endpoint on non-COD order
   - Returns: 400 Bad Request

---

## Security Considerations

✅ **Implemented:**
- User authentication required (authenticateTokenStrict)
- Order ownership verification
- Phone number validation (regex)
- Payment status immutability (prevents double-payment)

📝 **TODO in Production:**
- Webhook verification for Flutterwave
- PCI compliance for payment data
- Encrypted payment details storage
- Rate limiting on payment endpoints

---

## Future Enhancements

1. **Email Notifications**
   - Send confirmation email to customer
   - Notify vendor via email of new paid orders

2. **SMS Notifications**
   - Customer receives SMS with order number
   - Vendor receives SMS when payment confirmed

3. **Payment Gateway Integration**
   - Full Flutterwave webhook implementation
   - MTN Mobile Money integration
   - Airtel Money integration

4. **Refund Handling**
   - Process refunds for cancelled orders
   - Partial refunds for damaged items

5. **Analytics**
   - Track payment success rate
   - Monitor average payment confirmation time
   - Revenue by payment method

---

## Files Modified/Created

### Backend
- ✅ `backend/models/Order.js` - Added payment fields & status
- ✅ `backend/routes/marketplace.js` - Added payment endpoints

### Frontend
- ✅ `frontend/pages/marketplace/payment.tsx` - NEW payment page
- ✅ `frontend/pages/marketplace/cart.tsx` - Updated redirect
- ✅ `frontend/pages/marketplace/orders/[id].tsx` - Added 'paid' status
- ✅ `frontend/src/components/marketplace/CartSummary.tsx` - Updated method

---

## Testing Checklist

- [ ] Create order with all required fields
- [ ] Verify order status is "pending" and paymentStatus is "pending"
- [ ] Test Mobile Money payment confirmation
- [ ] Verify status changed to "paid"
- [ ] Verify vendor notification created
- [ ] Test Bank Transfer payment confirmation
- [ ] Test Cash on Delivery flow
- [ ] Verify vendor can confirm COD payment
- [ ] Test order details page shows "paid" status
- [ ] Test order progress shows payment step
- [ ] Test error cases (already paid, unauthorized, etc)

---

## Deployment Notes

1. **Database Migration**
   ```
   - No migration needed for MongoDB (schema update automatically applied)
   - New orders will have payment fields
   - Existing orders won't be affected
   ```

2. **Environment Variables**
   ```
   - Ensure FLW_SECRET_KEY is set for Flutterwave
   - Update webhook endpoints if using webhooks
   ```

3. **Testing Order of Steps**
   ```
   1. Deploy backend changes first
   2. Test backend endpoints with Postman
   3. Deploy frontend changes
   4. Test complete flow end-to-end
   ```

---

## Support & Troubleshooting

### Order status stuck on "pending"
- Check if payment confirmation endpoint was called
- Verify order ID is correct
- Check user authentication

### Vendor notification not appearing
- Verify Notification model exists
- Check vendor ID in product
- Check browser notifications are enabled

### Payment method not showing in dropdown
- Verify paymentMethod enum includes the method
- Clear browser cache
- Check payment.tsx component is loaded

---

**Implementation Date:** January 2025  
**Status:** ✅ Complete and Ready for Testing  
**Next Steps:** Integration testing & production deployment