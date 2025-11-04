# 🧪 Payment Flow - Implementation Test Checklist

Use this checklist to verify the complete payment flow is working correctly.

---

## 📋 Pre-Test Setup

### Environment Check
- [ ] Backend running on `http://localhost:5000` (or configured port)
- [ ] Frontend running on `http://localhost:3000` (or configured port)
- [ ] Database connected and accessible
- [ ] You have test user accounts (customer + vendor)

### Data Preparation
- [ ] Create test vendor account with at least 1 product listed
- [ ] Create test customer account
- [ ] Ensure product has:
  - [ ] Name, description, price
  - [ ] Image
  - [ ] Stock available
  - [ ] Vendor ID set correctly

---

## 🧪 Test 1: Mobile Money Payment Flow

**Duration:** ~5 minutes  
**Goal:** Verify instant payment confirmation and vendor notification

### Step 1: Customer adds product to cart
```
[ ] Login as customer
[ ] Go to marketplace
[ ] Find vendor's product
[ ] Click "Add to Cart"
[ ] Go to cart (/marketplace/cart)
[ ] Verify product appears in cart
[ ] Click "Checkout"
```

### Step 2: Enter shipping details
```
[ ] Full Name: [Test Customer]
[ ] Email: [test@example.com]
[ ] Phone: [+1234567890] ← IMPORTANT for COD/vendor contact
[ ] Address: [Test Address 123]
[ ] City: [Test City]
[ ] State/Province: [Test State]
[ ] ZIP Code: [12345]
[ ] Country: [Test Country]
[ ] Click "Continue to Payment"
```

### Step 3: Select Mobile Money
```
[ ] URL contains: /marketplace/payment?orderId=xxx
[ ] Page title shows "💳 Complete Payment"
[ ] Order summary visible with:
  [ ] Product name and quantity
  [ ] Total amount
  [ ] Shipping address
[ ] Three payment methods visible:
  [ ] Mobile Money (with INSTANT badge)
  [ ] Bank Transfer (with 1-2 HOURS badge)
  [ ] Cash on Delivery (with PAY LATER badge)
[ ] Click "Mobile Money" radio button
[ ] Payment details section appears showing QR code info
```

### Step 4: Confirm payment
```
[ ] Click "Confirm Payment" button
[ ] Should show "Payment confirmed successfully! 🎉" toast notification
[ ] Wait 1-2 seconds for redirect
[ ] Should be redirected to order details page (/marketplace/orders/xxx)
```

### Step 5: Verify order status changed to PAID
```
[ ] Order details page loads
[ ] Order status badge shows "PAID" (or green status)
[ ] Order progress stepper shows:
  [ ] Order Placed ✓
  [ ] Payment Confirmed ✓
  [ ] Processing (next)
  [ ] Shipped
  [ ] Delivered
  [ ] Completed
[ ] Payment section shows:
  [ ] Payment Method: mobile_money
  [ ] Payment Status: confirmed
```

### Step 6: Verify vendor received notification
```
[ ] Login as vendor
[ ] Check notifications (usually in top-right corner or notifications page)
[ ] Should see notification: "Payment Received - Order [number], Amount: [currency] [amount]"
[ ] Notification type should be 'payment_confirmed'
```

### ✅ Test 1 Result: PASS / FAIL
```
If all steps completed successfully → PASS ✅
If any step failed → FAIL ❌ (Note which step)
```

---

## 🧪 Test 2: Vendor Order Management

**Duration:** ~5 minutes  
**Goal:** Verify vendor can see orders and update status with tracking

### Step 1: Access vendor dashboard
```
[ ] Login as vendor
[ ] Go to /marketplace/vendor-orders
[ ] Page loads with "Order Management" or similar title
```

### Step 2: Verify statistics
```
[ ] Statistics card visible showing:
  [ ] Total Orders: [number > 0]
  [ ] Paid Orders: [should include our test order]
  [ ] Processing: [number]
  [ ] Total Revenue: [currency] [amount]
```

### Step 3: Verify paid order visible in table
```
[ ] Orders table displays
[ ] Our test order appears with columns:
  [ ] Order Number: #[order number from Step 4-5]
  [ ] Customer Name: [Test Customer]
  [ ] Amount: [product price]
  [ ] Status: "paid"
  [ ] Payment Status: "confirmed"
[ ] **CRITICAL:** Customer phone number visible in table or details
  [ ] Phone should show: +1234567890
  [ ] This is essential for COD vendor contact
```

### Step 4: Update order status to Processing
```
[ ] Click "Update Status" or "Edit" button for the order
[ ] Status update dialog appears
[ ] Current status shown: "paid"
[ ] Next status options appear (should be "processing" or "cancelled")
[ ] Select "processing"
[ ] Add optional notes (e.g., "Preparing order for shipment")
[ ] Click "Update" or "Save"
[ ] Toast notification: "Order status updated to processing"
```

### Step 5: Verify customer sees status change
```
[ ] Login as customer (new browser tab/window or incognito)
[ ] Go to /marketplace/orders/[order-id]
[ ] Order progress stepper now shows:
  [ ] Order Placed ✓
  [ ] Payment Confirmed ✓
  [ ] Processing ✓ (current, highlighted)
  [ ] Shipped (next)
[ ] Check notifications (customer should have received notification)
```

### Step 6: Update status to Shipped with tracking
```
[ ] Back to vendor dashboard as vendor
[ ] Update order status again
[ ] Select "shipped"
[ ] Tracking information fields appear:
  [ ] Tracking Number: [enter "TRK123456789"]
  [ ] Carrier: [select or enter "DHL"]
  [ ] Estimated Delivery: [select date 3-5 days from now]
[ ] Click "Update"
```

### Step 7: Verify tracking appears for customer
```
[ ] Switch to customer account
[ ] Refresh order details page
[ ] Verify "Shipping Information" section shows:
  [ ] Tracking Number: TRK123456789
  [ ] Carrier: DHL
  [ ] Estimated Delivery: [date you entered]
[ ] Progress stepper shows "Shipped" ✓
[ ] Check customer notifications (should have "Your order is on the way!" message)
```

### ✅ Test 2 Result: PASS / FAIL
```
If all steps completed successfully → PASS ✅
If any step failed → FAIL ❌ (Note which step)
```

---

## 🧪 Test 3: Bank Transfer Payment

**Duration:** ~5 minutes  
**Goal:** Verify bank transfer option and manual confirmation workflow

### Step 1-2: Add to cart and enter shipping (same as Test 1)
```
[ ] Complete Steps 1-2 from Test 1
```

### Step 3: Select Bank Transfer
```
[ ] Click "Bank Transfer" radio button
[ ] Bank transfer instructions section appears showing:
  [ ] Amount to Transfer: [currency] [amount]
  [ ] Reference: [order number]
[ ] Instructions say "Please transfer the exact amount below"
```

### Step 4: Confirm payment (simulating transfer completed)
```
[ ] Click "Confirm Payment"
[ ] Toast shows: "Payment confirmed successfully! 🎉"
[ ] Redirected to order details
```

### Step 5: Verify status
```
[ ] Order status shows "PAID" (should be same as Mobile Money)
[ ] Payment status shows "confirmed"
```

### ✅ Test 3 Result: PASS / FAIL
```
If all steps completed → PASS ✅
```

---

## 🧪 Test 4: Cash on Delivery

**Duration:** ~8 minutes  
**Goal:** Verify COD payment workflow with vendor confirmation

### Step 1-3: Select Cash on Delivery
```
[ ] Add to cart and checkout (same as Test 1 Steps 1-2)
[ ] Go to payment page
[ ] Click "Cash on Delivery" radio button
[ ] COD confirmation section appears showing:
  [ ] ✅ Vendor will collect [currency] [amount] on delivery
  [ ] Message: "The vendor will contact you at [phone number]"
```

### Step 4: Confirm COD order
```
[ ] Click "Confirm Payment"
[ ] Toast shows success message
[ ] Redirected to order details
```

### Step 5: Verify order status is PENDING (not PAID yet)
```
[ ] Order status should show "PENDING" (NOT "PAID" yet)
[ ] This is correct! Vendor hasn't confirmed payment yet
[ ] Payment Status: "pending"
[ ] Progress stepper shows "Order Placed" ✓, not "Payment Confirmed" yet
```

### Step 6: Vendor contacts customer and receives cash
```
[ ] Vendor finds order in dashboard
[ ] **VERIFY PHONE VISIBLE:** Customer phone should be visible
[ ] Vendor uses this number to contact customer for delivery
[ ] [Simulate: Vendor receives cash]
```

### Step 7: Vendor confirms COD payment
```
[ ] In vendor dashboard, find the COD order (should be in "pending" status)
[ ] Click special "Confirm COD Payment" button (or status update)
[ ] Confirmation dialog appears
[ ] Click "Confirm" to mark payment as received
[ ] Toast: "Cash on Delivery payment confirmed"
```

### Step 8: Verify status changed to PAID
```
[ ] Order now shows status: "PAID"
[ ] Payment status: "confirmed"
[ ] Vendor now can update status to "processing" etc.
[ ] Customer receives notification that payment confirmed
```

### ✅ Test 4 Result: PASS / FAIL
```
If all steps completed → PASS ✅
```

---

## 🔍 Database Verification

### Check Order Collection
```
# Connect to MongoDB
use [your_database_name]
db.orders.findOne({orderNumber: "[order from tests]"})

Verify the order document contains:
[ ] paymentMethod: "mobile_money" or "bank_transfer" or "cash_on_delivery"
[ ] paymentStatus: "confirmed" or "pending"
[ ] paymentConfirmedAt: [timestamp for confirmed orders]
[ ] status: "paid" or "pending"
[ ] shippingAddress.phone: [your test phone]
[ ] trackingNumber: [TRK123456789 for shipped orders]
[ ] carrier: "DHL" [for shipped orders]
[ ] shippedAt: [timestamp for shipped orders]
[ ] estimatedDelivery: [date for shipped orders]
```

---

## 📊 Summary Results

### Test Results
| Test | Result | Notes |
|------|--------|-------|
| Test 1: Mobile Money | ⚪ | |
| Test 2: Vendor Mgmt | ⚪ | |
| Test 3: Bank Transfer | ⚪ | |
| Test 4: Cash on Delivery | ⚪ | |

*(Fill in: ✅ PASS or ❌ FAIL)*

### Issues Found
```
[ ] No issues found
[ ] Issue 1: [describe]
[ ] Issue 2: [describe]
```

---

## 🔧 Troubleshooting

### Issue: Order not found at payment page
```
Solution:
1. Check if orderId query parameter exists: /marketplace/payment?orderId=xxx
2. Check if order exists in database
3. Check if order belongs to logged-in user
```

### Issue: Payment status doesn't change to "PAID"
```
Check:
1. Verify endpoint was called: POST /marketplace/orders/{id}/confirm-payment
2. Check backend logs for errors
3. Verify paymentStatus field in order document
4. Check if user is authenticated (valid JWT token)
```

### Issue: Vendor doesn't see customer phone
```
Check:
1. Phone field included in shippingAddress during checkout
2. Verify vendor orders endpoint populates userId (includes displayName)
3. Check if phone is visible in vendor-orders.tsx component
4. Database: db.orders.findOne().shippingAddress.phone
```

### Issue: Tracking info not appearing for customer
```
Check:
1. Vendor properly updated status to "shipped"
2. Tracking fields set: trackingNumber, carrier, estimatedDelivery
3. Order details page refreshed (not cached)
4. Check browser console for errors
5. Verify order document has tracking fields:
   db.orders.findOne().trackingNumber
```

### Issue: Notifications not appearing
```
Check:
1. Notifications collection in database has entries
2. User is logged in and viewing notifications area
3. Backend notification creation not throwing errors
4. Check if notification polling is working on frontend
```

---

## ✅ Verification Complete

Once all tests PASS:

```
✅ Payment flow is WORKING correctly
✅ All three payment methods functional
✅ Order status management working
✅ Tracking system operational
✅ Vendor dashboard complete
✅ Customer notifications working
✅ Ready for production deployment
```

---

**Date Tested:** ___________  
**Tester Name:** ___________  
**Overall Result:** ✅ PASS / ❌ FAIL
