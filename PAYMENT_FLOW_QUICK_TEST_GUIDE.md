# 🧪 Payment Flow Quick Testing Guide

**Goal:** Verify the complete payment flow works from cart → payment → order management

**Estimated Time:** 10-15 minutes per test scenario

---

## 📋 TEST SETUP

### Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000` (or your dev port)
- MongoDB running with test data
- Two test accounts: one customer, one vendor

### Create Test Accounts (if needed)

**Customer Account:**
```
Email: customer@test.com
Password: Test@123
Role: customer
```

**Vendor Account:**
```
Email: vendor@test.com
Password: Test@123
Role: vendor
```

---

## ✅ QUICK TEST 1: Mobile Money Payment (5 minutes)

### Step 1: Browse & Add Product to Cart
```
1. Go to http://localhost:3000/marketplace
2. Click on any product
3. Adjust quantity if needed
4. Click "Add to Cart"
✓ Verify: Product appears in cart
```

### Step 2: View Cart
```
1. Click shopping cart icon or go to /marketplace/cart
2. Verify items and total amount
✓ Verify: Cart shows items with correct total
```

### Step 3: Checkout
```
1. Fill in shipping address:
   - Full Name: Test Customer
   - Email: customer@test.com
   - Phone: +1234567890  ← THIS IS IMPORTANT (for vendor)
   - Address: 123 Main St
   - City: New York
   - State: NY
   - ZIP: 10001
   - Country: USA

2. Select Payment Method: "Mobile Money"
3. Click "Complete Order"
✓ Verify: Toast shows "Order created! Proceeding to payment..."
```

### Step 4: Payment Confirmation
```
1. Payment page loads
2. Verify order summary shows correct items and total
3. Verify "Mobile Money" is selected (blue border)
4. Verify badge shows "INSTANT"
5. Click "Confirm Payment"
✓ Verify: Toast shows "Payment confirmed successfully! 🎉"
```

### Step 5: Check Order Status
```
1. After redirect to order details:
2. Verify order number displays
3. Verify status badge shows "PAID" (GREEN)
4. Verify status icon shows credit card
5. Verify payment method shows "mobile_money"
6. Verify payment status shows "confirmed"
✓ Verify: Progress stepper shows "Payment Confirmed" completed
```

---

## ✅ QUICK TEST 2: Vendor Order Management (5 minutes)

### Step 1: Login as Vendor
```
1. Click Logout (or go to /login)
2. Enter vendor credentials:
   - Email: vendor@test.com
   - Password: Test@123
3. Click Login
✓ Verify: Dashboard loads with vendor role
```

### Step 2: Navigate to Vendor Orders
```
1. Go to http://localhost:3000/marketplace/vendor-orders
✓ Verify: Page loads (should redirect to login if not vendor)
```

### Step 3: View Order Statistics
```
Verify Dashboard Card Shows:
✓ Total Orders: Count matches
✓ Paid Orders: Should include the order you just created
✓ Processing: Shows 0
✓ Revenue: Shows total amount from paid orders
```

### Step 4: Filter Paid Orders
```
1. Click Status filter dropdown
2. Select "paid"
3. Click "Filter" or dropdown closes
✓ Verify: Table refreshes showing only "PAID" orders
✓ Verify: Your test order appears in the list
```

### Step 5: Verify Customer Phone Visible
```
1. Look at the order row in the table
2. Find column "Contact Phone"
✓ Verify: Customer's phone number displays: "+1234567890"
   This is what vendor uses to contact customer!
```

### Step 6: Update Order Status
```
1. Click "Update Status" button on your test order
2. Dialog opens showing:
   - Current Status: "paid"
   - Next Status dropdown
   - Valid options: ["processing", "cancelled"]

3. Select "processing"
4. Click "Update Status"
✓ Verify: Toast shows "Order updated to processing"
✓ Verify: Table refreshes, status badge changes to "PROCESSING" (BLUE)
```

### Step 7: Update to Shipped with Tracking
```
1. Click "Update Status" again
2. Select "shipped" from dropdown
3. New fields appear:
   - Tracking Number: Enter "TRK123456789"
   - Carrier: Select "FedEx"
   - Estimated Delivery: Pick a date like "2025-01-25"

4. Click "Update Status"
✓ Verify: Toast shows "Order updated to shipped"
✓ Verify: Status badge changes to "SHIPPED" (BLUE)
```

---

## ✅ QUICK TEST 3: Customer Sees Updates (3 minutes)

### Step 1: Login as Customer
```
1. Logout from vendor account
2. Login as customer@test.com
3. Click on "Orders" or Dashboard
✓ Verify: You can see your order
```

### Step 2: View Order with Tracking
```
1. Click on your order from the list
2. Order details page loads
✓ Verify: Status shows "SHIPPED" (BLUE badge)
```

### Step 3: Check Shipping Information
```
Look for "Shipping Information" section:
✓ Verify: Shows delivery address
✓ Verify: Shows contact phone number
✓ Verify: Shows tracking section with:
   - Tracking Number: TRK123456789
   - Estimated Delivery: Jan 25, 2025
   - Carrier: FedEx
```

### Step 4: Check Progress Stepper
```
Verify progress stepper shows:
✓ ✓ Order Placed (completed)
✓ ✓ Payment Confirmed (completed)
✓ ✓ Processing (completed)
✓ ✓ Shipped (completed)
✓ → Delivered (current/next)
```

---

## ✅ QUICK TEST 4: Cash on Delivery Flow (5 minutes)

### Step 1: New Order with COD
```
1. Login as customer
2. Add item to cart
3. Go to checkout
4. Fill shipping address with phone
5. Select "Cash on Delivery"
6. Click "Complete Order"
✓ Verify: Redirects to order details
```

### Step 2: Check Order Status
```
✓ Verify: Status shows "PENDING" (YELLOW)
   (Because vendor hasn't received payment yet)
✓ Verify: Payment status shows "pending"
```

### Step 3: Vendor Sees COD Order
```
1. Login as vendor
2. Go to /marketplace/vendor-orders
3. Click status filter dropdown
4. Select "pending"
✓ Verify: COD order appears in list
✓ Verify: Customer phone number is visible
   (Vendor uses this to contact customer for payment)
```

### Step 4: Vendor Confirms Payment
```
1. Click "Update Status" on COD order
2. Dialog shows options: ["processing", "cancelled"]
   (Note: No "paid" option - vendor must confirm COD first)

Actually, there should be an option or the vendor should:
3. Select "processing"
   OR
   Click a "Confirm COD Payment" button

For now:
1. Let vendor click "processing"
   This means vendor is preparing the order
2. When vendor confirms they received payment, next update to processing is allowed
```

---

## 🧪 DATABASE VERIFICATION (Optional)

### Check Order in MongoDB

```bash
# Connect to MongoDB
mongo

# Switch to your database
use talkcart  # or your db name

# Find your test order
db.orders.findOne({ orderNumber: "ORD-" })

# Verify these fields exist:
{
  _id: ObjectId(...),
  orderNumber: "ORD-...",
  status: "paid",
  paymentStatus: "confirmed",
  paymentMethod: "mobile_money",
  paymentConfirmedAt: ISODate("2025-01-20T..."),
  
  shippingAddress: {
    phone: "+1234567890"  ← Phone number stored
  },
  
  // If shipped:
  trackingNumber: "TRK123456789",
  carrier: "FedEx",
  shippedAt: ISODate("2025-01-20T..."),
  estimatedDelivery: ISODate("2025-01-25T..."),
  
  // Timestamps for status changes:
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 🔍 API VERIFICATION (Optional)

### Test Payment Endpoint

```bash
# Get order ID first
ORDER_ID="your-order-id"
TOKEN="your-jwt-token"

# Test confirm-payment endpoint
curl -X POST http://localhost:8000/api/marketplace/orders/$ORDER_ID/confirm-payment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "mobile_money"}'

# Should return:
# {
#   "success": true,
#   "message": "Payment confirmed successfully",
#   "data": { order object with status: "paid" }
# }
```

### Test Vendor Orders Endpoint

```bash
# Get vendor's orders
curl -X GET "http://localhost:8000/api/marketplace/vendor/orders?status=paid&page=1" \
  -H "Authorization: Bearer $VENDOR_TOKEN"

# Should return:
# {
#   "success": true,
#   "data": {
#     "orders": [ array of orders ],
#     "total": number,
#     "pages": number
#   }
# }
```

### Test Status Update Endpoint

```bash
# Update order status
curl -X PUT http://localhost:8000/api/marketplace/orders/$ORDER_ID/status \
  -H "Authorization: Bearer $VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "trackingNumber": "TRK123456789",
    "carrier": "FedEx",
    "estimatedDelivery": "2025-01-25"
  }'

# Should return:
# {
#   "success": true,
#   "message": "Order status updated to shipped",
#   "data": { updated order object }
# }
```

---

## ✋ MANUAL VERIFICATION CHECKLIST

### Frontend Behavior

- [ ] **Cart Page**
  - [ ] Can add items to cart
  - [ ] Can proceed to checkout
  - [ ] Checkout form collects phone number
  - [ ] Can select payment method

- [ ] **Payment Page**
  - [ ] Order summary shows correct items
  - [ ] Three payment method options visible
  - [ ] Each method has descriptive text
  - [ ] Selection shows visual feedback
  - [ ] Confirm button works

- [ ] **Order Details Page**
  - [ ] Shows "PAID" status for digital payments
  - [ ] Progress stepper shows payment step completed
  - [ ] Shows payment method and payment status
  - [ ] Shows tracking info when available
  - [ ] Shows customer contact phone

- [ ] **Vendor Orders Page**
  - [ ] Shows statistics dashboard
  - [ ] Lists paid orders
  - [ ] Shows customer phone number
  - [ ] Status filter works
  - [ ] Update dialog works
  - [ ] Tracking fields appear for shipped status

### Backend Behavior

- [ ] **Payment Confirmation**
  - [ ] Sets order status to "paid"
  - [ ] Sets paymentStatus to "confirmed"
  - [ ] Sets paymentConfirmedAt timestamp
  - [ ] Creates vendor notification
  - [ ] Returns 200 OK

- [ ] **Status Updates**
  - [ ] Only valid transitions allowed
  - [ ] Invalid transitions return error
  - [ ] Timestamps set correctly (shippedAt, deliveredAt, etc.)
  - [ ] Customer notifications sent
  - [ ] Vendor can see updates

- [ ] **Vendor Orders**
  - [ ] Returns only vendor's orders
  - [ ] Shows customer details
  - [ ] Shows shipping address with phone
  - [ ] Filters work correctly
  - [ ] Pagination works

### Database Verification

- [ ] **Order Records**
  - [ ] Payment fields populated
  - [ ] Shipping fields populated
  - [ ] Tracking fields populated when shipping
  - [ ] Timestamps set at correct stages
  - [ ] Status values are valid

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: Payment page doesn't load

**Solution:**
1. Check browser console for errors
2. Verify order ID in URL query param
3. Check backend is running on port 8000
4. Check JWT token is valid

### Issue: Order status doesn't update

**Solution:**
1. Verify user is a vendor (role: "vendor")
2. Verify vendor owns products in the order
3. Check valid status transition (see backend for rules)
4. Check backend logs for validation errors

### Issue: Customer phone not visible

**Solution:**
1. Make sure phone was entered during checkout
2. Check order's shippingAddress.phone in database
3. Verify vendor-orders page is querying correctly
4. Check browser console for API errors

### Issue: Notifications not appearing

**Solution:**
1. Check browser allows notifications
2. Check Notification model exists in database
3. Verify notification creation didn't fail silently
4. Check /api/user/notifications endpoint

### Issue: Tracking info not showing

**Solution:**
1. Make sure order status is "shipped"
2. Make sure trackingNumber was filled when updating status
3. Verify order details page checks for trackingNumber field
4. Check database has tracking fields populated

---

## 📊 EXPECTED RESPONSES

### Successful Payment Confirmation

```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "_id": "...",
    "orderNumber": "ORD-...",
    "status": "paid",
    "paymentStatus": "confirmed",
    "paymentConfirmedAt": "2025-01-20T10:30:00.000Z",
    "items": [...],
    "totalAmount": 99.99
  }
}
```

### Successful Status Update

```json
{
  "success": true,
  "message": "Order status updated to shipped",
  "data": {
    "_id": "...",
    "orderNumber": "ORD-...",
    "status": "shipped",
    "trackingNumber": "TRK123456789",
    "carrier": "FedEx",
    "shippedAt": "2025-01-20T11:00:00.000Z",
    "estimatedDelivery": "2025-01-25T00:00:00.000Z"
  }
}
```

### Successful Vendor Orders

```json
{
  "success": true,
  "message": "Vendor orders retrieved successfully",
  "data": {
    "orders": [
      {
        "_id": "...",
        "orderNumber": "ORD-...",
        "status": "paid",
        "totalAmount": 99.99,
        "userId": {
          "username": "customer",
          "displayName": "Test Customer",
          "email": "customer@test.com",
          "avatar": "..."
        },
        "shippingAddress": {
          "phone": "+1234567890"
        },
        "items": [...]
      }
    ],
    "total": 5,
    "pages": 1,
    "page": 1
  }
}
```

---

## ⏱️ EXPECTED TIMINGS

| Action | Expected Duration | Actual |
|--------|-------------------|--------|
| Add to cart | <100ms | ______ |
| Proceed to checkout | <200ms | ______ |
| Load payment page | <300ms | ______ |
| Confirm payment | <500ms | ______ |
| Update order status | <500ms | ______ |
| Load vendor orders | <300ms | ______ |
| Get vendor stats | <200ms | ______ |

---

## 📝 TEST REPORT TEMPLATE

```
Test Date: ______________
Tester: ______________
Environment: ______________

TEST 1: Mobile Money Payment
Start Time: ____ End Time: ____
Result: [ ] PASS [ ] FAIL
Notes: _________________________________

TEST 2: Vendor Order Management
Start Time: ____ End Time: ____
Result: [ ] PASS [ ] FAIL
Notes: _________________________________

TEST 3: Customer Tracking
Start Time: ____ End Time: ____
Result: [ ] PASS [ ] FAIL
Notes: _________________________________

TEST 4: Cash on Delivery
Start Time: ____ End Time: ____
Result: [ ] PASS [ ] FAIL
Notes: _________________________________

OVERALL RESULT: [ ] PASS [ ] FAIL
Issues Found: _________________________________
```

---

## 🎯 SUCCESS CRITERIA

### All Tests Pass When:

✅ Cart → Payment → Order Status flow works  
✅ Payment confirmation changes status to "paid"  
✅ Vendor can see paid orders  
✅ Vendor can see customer phone number  
✅ Vendor can update order status  
✅ Tracking information displays for customer  
✅ All three payment methods work  
✅ No errors in console logs  
✅ Database records properly updated  
✅ Notifications sent to users  

---

## 📞 SUPPORT

If tests fail, check:

1. **Backend running?**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Frontend running?**
   ```bash
   http://localhost:3000
   ```

3. **MongoDB running?**
   ```bash
   mongo --version
   ```

4. **Check browser console** (F12)
   - Look for network errors
   - Look for API response errors

5. **Check backend logs**
   - Look for validation errors
   - Look for database errors

---

**Good luck with testing! Report any issues you find.** 🚀