# 📊 Mobile Money Payment Flow - Visual Guide

## 🔴 BEFORE (Broken)

```
┌─────────────────────────────────────────────────────────────┐
│                    BROKEN FLOW                              │
└─────────────────────────────────────────────────────────────┘

Customer Journey:
├─ 1. Browse marketplace
├─ 2. Add product to cart
├─ 3. Go to checkout
├─ 4. Select "Mobile Money"
├─ 5. Click "Proceed to Payment"
│  
│  ❌ PROBLEM: Direct confirmation
│  └─ No payment to Flutterwave
│     └─ No actual payment processing
│        └─ Order marked as 'paid' anyway
│
└─ 6. See "Payment confirmed"
   └─ Order shows "PAID" in database
      └─ NO MONEY RECEIVED
         └─ 🚨 FRAUD VULNERABILITY

Technology Flow:
  Frontend                           Backend
  ───────────────────────────────────────────
  Click Button
       ↓
  api.post('/confirm-payment')
       ↓ ────────────────────────→ Update order.status = 'paid'
       ↓ ←──────────────────────  Return success
       ↓
  Show success message

Problems:
  ❌ No Flutterwave redirect
  ❌ No actual payment
  ❌ No transaction ID
  ❌ No verification
  ❌ Fraudulent orders
```

---

## ✅ AFTER (Fixed)

```
┌─────────────────────────────────────────────────────────────┐
│                    FIXED FLOW                               │
└─────────────────────────────────────────────────────────────┘

Customer Journey:
├─ 1. Browse marketplace
├─ 2. Add product to cart
├─ 3. Go to checkout
├─ 4. Select "Mobile Money"
├─ 5. Click "Proceed to Payment"
│
├─ 🔐 SECURE: Redirect to Flutterwave
│  └─ 6a. Browser redirects to Flutterwave
│      └─ 6b. Customer sees Flutterwave checkout
│          └─ 6c. Select mobile money provider (MTN, Airtel, etc)
│              └─ 6d. Enter phone number
│                  └─ 6e. Confirm OTP
│                      └─ 6f. Payment processed
│
├─ 7. Flutterwave redirects back
│
├─ ✅ VERIFIED: Payment confirmation
│  └─ 8a. Callback page receives status
│      └─ 8b. Backend verifies with Flutterwave
│          └─ 8c. Order marked as 'paid'
│              └─ 8d. Transaction ID stored
│
└─ 9. See "Payment confirmed" with ✅
   └─ Order shows "COMPLETED"
      └─ TRANSACTION VERIFIED
         └─ 💰 MONEY RECEIVED

Technology Flow:
  Frontend                Backend                   Flutterwave
  ───────────────────────────────────────────────────────────
  Click Button
       ↓
  POST /flutterwave/init
       ├──────────────→ POST to Flutterwave API
       │                    ├──────────────────→ Create session
       │                    ←──────────────────  Return link
       ←──────────────  Return link
       ↓
  window.location.href = link
       └─────────────────────────────────→ Flutterwave Checkout
                                              ├─ Mobile Money
                                              ├─ Cards
                                              ├─ Bank Transfer
                                              └─ Wallets
                                          
                                          Customer pays...
                                          
                                          Redirect with status
       ←──────────────────────────────────  /callback?status=...
       ↓
  Callback page loads
       ↓
  POST /confirm-payment
       ├──────────────→ Verify + Update
       ←──────────────  Success
       ↓
  Show success message
       ↓
  Redirect to order details

Security Checks:
  ✅ Authentication verified
  ✅ User owns order verified
  ✅ Payment status from Flutterwave verified
  ✅ Transaction ID stored
  ✅ Webhook signature verified
  ✅ Duplicate payment prevented
```

---

## 📱 Screen Flow

```
┌────────────────────────────────────────────────────────────┐
│                  PAYMENT PAGE                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Select Payment Method:                                  │
│  ○ Mobile Money                                          │
│  ○ Bank Transfer                                         │
│  ○ Cash on Delivery                                      │
│                                                          │
│  Order Summary                 Amount: $99.99           │
│                                                          │
│  ┌──────────────────────────────────────┐               │
│  │  Proceed to Payment - $99.99         │ ← CLICK      │
│  └──────────────────────────────────────┘               │
│                                                          │
└────────────────────────────────────────────────────────────┘
                            ↓
                         (Redirect)
                            ↓
┌────────────────────────────────────────────────────────────┐
│           MOBILE MONEY FORMAT PAGE                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📱 Mobile Money Payment                                │
│  Order #ORD-001                                         │
│                                                          │
│  Order Summary:                                          │
│  Amount: $99.99                                         │
│                                                          │
│  Steps:                                                 │
│  1. Click "Proceed to Payment"                          │
│  2. Select Mobile Money Provider                        │
│  3. Enter Phone: +256XXXXXXXXX                          │
│  4. Confirm OTP                                         │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │ Proceed to Payment - $99.99          │ ← CLICK     │
│  └──────────────────────────────────────┘              │
│                                                        │
└────────────────────────────────────────────────────────────┘
                            ↓
                    (Flutterwave Init)
                            ↓
┌────────────────────────────────────────────────────────────┐
│         FLUTTERWAVE CHECKOUT (EXTERNAL)                   │
├────────────────────────────────────────────────────────────┤
│  🔒 https://checkout.flutterwave.com/...                │
│                                                          │
│  Flutterwave                                            │
│  Amount: $99.99                                         │
│                                                          │
│  Payment Method:                                        │
│  [MTN] [Airtel] [Vodafone] [Card] [Bank]              │
│    ↓ Select                                            │
│  Enter Phone: [____________]                           │
│  [Proceed]                                             │
│                                                        │
│  → OTP Verification                                   │
│  → Payment Processing                                 │
│  → Payment Complete                                   │
│                                                        │
└────────────────────────────────────────────────────────────┘
                            ↓
                    (Automatic Redirect)
                            ↓
┌────────────────────────────────────────────────────────────┐
│        PAYMENT CALLBACK/PROCESSING PAGE                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Processing your payment...                              │
│  [████████░░░░] 60%                                      │
│                                                          │
│  Verifying with Flutterwave...                          │
│                                                          │
└────────────────────────────────────────────────────────────┘
                            ↓
                    (Confirm Payment)
                            ↓
┌────────────────────────────────────────────────────────────┐
│        PAYMENT SUCCESS PAGE                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ✅ Payment Successful!                                 │
│                                                          │
│  Your payment has been confirmed.                       │
│  You will be redirected to your order details.          │
│                                                          │
│  Order: ORD-001                                         │
│  Amount: $99.99 ✓                                       │
│  Status: PAID ✓                                         │
│  Transaction ID: TXN-123456789 ✓                        │
│                                                          │
│  [View Order Details]                                   │
│                                                          │
└────────────────────────────────────────────────────────────┘
                            ↓
                    (Auto Redirect)
                            ↓
┌────────────────────────────────────────────────────────────┐
│        ORDER DETAILS PAGE                                │
├────────────────────────────────────────────────────────────┤
│                                                          │
│  Order #ORD-001                                        │
│  Status: ✅ COMPLETED                                  │
│  Payment: ✅ PAID                                       │
│  Amount: $99.99                                        │
│  Method: Mobile Money                                  │
│  Transaction: TXN-123456789                            │
│                                                        │
│  Items:                                                │
│  - Product Name x 1                                    │
│                                                        │
│  [Track Delivery] [Download Invoice]                   │
│                                                        │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                   COMPLETE SYSTEM FLOW                       │
└──────────────────────────────────────────────────────────────┘

┌─────────────┐                                    ┌──────────┐
│   Browser   │                                    │ Backend  │
│  (Frontend) │                                    │  Server  │
└──────┬──────┘                                    └────┬─────┘
       │                                                │
       │ 1. User clicks "Proceed to Payment"           │
       │                                                │
       │ 2. POST /api/payments/flutterwave/init       │
       ├───────────────────────────────────────────────→
       │                                                │
       │    Order ID: 123                             │
       │    Amount: 99.99                             │
       │    Customer: user@example.com                │
       │                                                │
       │                      3. Validate request
       │                         Check auth token
       │
       │                      4. POST to Flutterwave API
       │                         ↓
       │                      ┌──────────────────┐
       │                      │  FLUTTERWAVE     │
       │                      │  Payment Gateway │
       │                      └──────────────────┘
       │                         ↑
       │                      Create payment
       │                      Return link
       │
       │                      5. Return response
       │← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
       │
       │ 6. window.location.href = link
       │
       └──────────────────────────────────────────────
                         ↓ REDIRECT TO FLUTTERWAVE
                    ┌──────────────────────┐
                    │ Flutterwave Checkout │
                    │ Mobile Money Form    │
                    │ - Select Provider    │
                    │ - Enter Phone        │
                    │ - Confirm OTP        │
                    │ - Process Payment    │
                    └──────────────────────┘
                         ↓ AUTO REDIRECT
       ┌─────────────┐                          ┌──────────┐
       │   Browser   │                          │ Backend  │
       │ Callback pg │                          │  Server  │
       └──────┬──────┘                          └────┬─────┘
              │                                      │
              │ 7. URL: /callback?status=xxx&tx=xxx │
              │    (Flutterwave sends params)       │
              │                                      │
              │ 8. POST /marketplace/orders/123     │
              │    /confirm-payment                 │
              ├─────────────────────────────────────→
              │                                      │
              │    paymentMethod: mobile_money      │
              │    transactionId: TXN-123           │
              │                                      │
              │                  9. Verify request
              │                     Check auth
              │                     Check ownership
              │                     Verify status
              │
              │                  10. Update Database
              │                     order.status = 'paid'
              │                     order.transactionId = TXN-123
              │                     Save order
              │
              │                  11. Send Notification
              │                     Vendor notification
              │                     Email receipt
              │
              │                  12. Return response
              │← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
              │
              │ 13. Show "Payment Success"
              │
              │ 14. Redirect to order details
              │
              └────────────────────────────────────→
                            (Display order)
                            Status: PAID ✅
```

---

## 💾 Database Changes

```
┌──────────────────────────────────────────────────────────┐
│                    ORDER DOCUMENT                        │
└──────────────────────────────────────────────────────────┘

BEFORE (Broken):
{
  _id: ObjectId("123"),
  orderNumber: "ORD-001",
  userId: "user-456",
  items: [...],
  totalAmount: 99.99,
  currency: "USD",
  paymentMethod: "mobile_money",
  status: "paid" ← ❌ Set without verification
  paymentStatus: "pending",
  transactionId: null,
  paymentConfirmedAt: null
}


AFTER (Fixed):
{
  _id: ObjectId("123"),
  orderNumber: "ORD-001",
  userId: "user-456",
  items: [...],
  totalAmount: 99.99,
  currency: "USD",
  paymentMethod: "mobile_money",
  status: "paid" ← ✅ Set after Flutterwave verification
  paymentStatus: "confirmed",
  transactionId: "FLW-TXN-123456", ← ✅ NEW: Flutterwave ID
  paymentConfirmedAt: ISODate("2024-01-15T10:30:00Z"), ← ✅ NEW
  transactionReference: "123456789" ← ✅ Reference for tracking
}

Database Schema Updates:
├─ transactionId (NEW)
│  └─ Stores Flutterwave transaction ID
│     └─ Used for verification and audit
│
├─ paymentConfirmedAt (NEW)
│  └─ Timestamp when payment confirmed
│     └─ Used for payment tracking
│
└─ transactionReference (UPDATED)
   └─ Now used for all payment methods
      └─ Bank transfers store bank reference
      └─ Mobile money stores Flutterwave ID
```

---

## 🔐 Security Validation Points

```
┌────────────────────────────────────────────────────────┐
│          SECURITY CHECKS AT EACH STEP                 │
└────────────────────────────────────────────────────────┘

1. FLUTTERWAVE INIT REQUEST:
   ✅ User authenticated (JWT token)
   ✅ Order exists in database
   ✅ User owns the order
   ✅ Amount matches order total
   ✅ Currency valid

2. FLUTTERWAVE API CALL:
   ✅ Secret key used (server-side only)
   ✅ HTTPS connection
   ✅ Timeout protection
   ✅ Response validation

3. CALLBACK PROCESSING:
   ✅ User authenticated
   ✅ Order exists
   ✅ User owns order
   ✅ Payment status from Flutterwave verified
   ✅ Duplicate payment check (order not already paid)
   ✅ Webhook signature verified

4. PAYMENT CONFIRMATION:
   ✅ Transaction ID from Flutterwave
   ✅ Payment status verified
   ✅ Order status updated atomically
   ✅ Transaction logged

5. DATABASE INTEGRITY:
   ✅ Indexed lookups for performance
   ✅ Transactional updates
   ✅ Audit trail maintained
   ✅ Timestamp recorded
```

---

## 📊 Timeline

```
Total Flow Duration: 2-5 minutes

Step                      Duration    Status
────────────────────────────────────────────
User on payment page      ∞           ⏳ Waiting
Click "Proceed"           instant     ⚡ Auto
Flutterwave redirect      ~1 sec      ⚡ Auto
Flutterwave UI loads      ~2 sec      👤 User
Select provider           ~5 sec      👤 User
Enter phone               ~10 sec     👤 User
OTP verification          ~1 min      👤 User
Payment processing        ~1 min      🔄 System
Flutterwave confirms      ~2 sec      ⚡ Auto
Redirect to callback      ~1 sec      ⚡ Auto
Callback processes        ~2 sec      ⚡ Auto
Verify with Flutterwave   ~2 sec      🔄 System
Update order              ~1 sec      💾 DB
Show success              instant     ⚡ Auto
────────────────────────────────────────────
TOTAL                     2-5 min     ✅ Done
```

---

## ✨ Success Indicators

```
What to Look For:

1. FIRST CLICK - Redirects to Flutterwave
   ✅ URL changes from your domain
   ✅ Shows https://checkout.flutterwave.com/...
   ✅ See Flutterwave branding

2. PAYMENT PROCESSING - On Flutterwave
   ✅ Can select payment method
   ✅ Can enter phone number
   ✅ Can enter OTP
   ✅ Payment processes

3. CALLBACK - Returns to your site
   ✅ Redirected to callback page
   ✅ Shows "Processing..." message
   ✅ Shows "Payment Successful ✅"

4. FINAL - Order is marked paid
   ✅ Order status: "COMPLETED"
   ✅ Payment status: "confirmed"
   ✅ Transaction ID visible
   ✅ Vendor notified

If ANY of these fail, check troubleshooting guide.
```

---

**This visual guide shows the complete secure flow from payment selection to confirmation!**