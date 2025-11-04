# Payment Flow Manual Testing Guide

## Quick Reference: Order Payment States

```
┌─────────────────────────────────────────────────────────────┐
│                    ORDER PAYMENT STATUS                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ONLY ORDERS WITH status='paid' HAVE COMPLETED PAYMENT ✅   │
│                                                               │
│  Payment Method      Initial Status  After Confirm  Final    │
│  ─────────────────── ────────────── ────────────── ────────  │
│  Mobile Money        pending        paid ✅        PAID      │
│  Bank Transfer       pending        paid ✅        PAID      │
│  Cash on Delivery    pending        pending ⏳    PAID*      │
│                                     (* after vendor confirm) │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## End-to-End Testing Scenarios

### SCENARIO 1: Mobile Money Payment (Complete Flow)

#### Prerequisites:
- User logged in
- Products in cart
- Backend running at `http://localhost:5000`

#### Steps:

1. **Add Products to Cart**
   ```
   Navigate to marketplace
   Select products
   Add to cart (quantity as needed)
   ```

2. **Checkout**
   ```
   Go to /marketplace/cart
   Click "Proceed to Checkout"
   Enter shipping address details
   Click "Place Order"
   EXPECTED: Order created with status='pending'
   ```

3. **Verify Order Created**
   ```
   Database check:
   db.orders.findOne({ _id: <orderId> })
   
   Expected output:
   {
     status: 'pending',          // ✅ Initial state
     paymentStatus: 'pending',   // ✅ Initial state
     paymentMethod: 'mobile_money'
   }
   ```

4. **Payment Method Selection**
   ```
   Navigate to /marketplace/payment/{orderId}
   Select "Mobile Money" option
   Verify order summary displayed (items, total, currency)
   Click "Proceed to Mobile Money"
   ```

5. **Mobile Money Format Page**
   ```
   Redirected to: /marketplace/payment/mobile-money/{orderId}
   VERIFY:
   ✅ Order number displayed
   ✅ Total amount displayed
   ✅ Payment instructions shown
   ✅ 4-step process visible
   ✅ Back button available
   ✅ Order summary in sidebar
   ```

6. **Confirm Payment**
   ```
   Review payment instructions
   Click "Confirm Payment"
   EXPECTED: Toast "Payment confirmed successfully! 🎉"
   ```

7. **Backend Verification**
   ```
   Database check after confirmation:
   db.orders.findOne({ _id: <orderId> })
   
   Expected output:
   {
     status: 'paid',                          // ✅ MUST BE 'paid'
     paymentStatus: 'confirmed',              // ✅ MUST BE 'confirmed'
     paymentConfirmedAt: ISODate(...),        // ✅ MUST HAVE TIMESTAMP
     paymentMethod: 'mobile_money'
   }
   ```

8. **Frontend Redirect**
   ```
   Redirected to: /marketplace/orders/{orderId}
   VERIFY:
   ✅ Order details page loads
   ✅ Status shows as "Paid" or similar paid indicator
   ✅ Payment information displayed
   ```

9. **Verify Duplicate Prevention**
   ```
   Go back to /marketplace/payment/mobile-money/{orderId}
   Try to click "Confirm Payment" again
   EXPECTED: Either:
     a) Request fails (order already confirmed)
     b) Request succeeds but status unchanged
   
   Database check:
   db.orders.findOne({ _id: <orderId> })
   VERIFY: status still 'paid' (not changed)
   ```

---

### SCENARIO 2: Bank Transfer Payment (Complete Flow)

#### Prerequisites:
- User logged in
- Products in cart
- Backend running

#### Steps:

1. **Add Products to Cart**
   ```
   Navigate to marketplace
   Select products
   Add to cart
   ```

2. **Checkout**
   ```
   Go to /marketplace/cart
   Click "Proceed to Checkout"
   Enter shipping address details
   Click "Place Order"
   EXPECTED: Order created with status='pending'
   ```

3. **Payment Method Selection**
   ```
   Navigate to /marketplace/payment/{orderId}
   Select "Bank Transfer" option
   Click "Proceed to Bank Transfer"
   ```

4. **Bank Transfer Format Page**
   ```
   Redirected to: /marketplace/payment/bank-transfer/{orderId}
   VERIFY:
   ✅ Order number displayed
   ✅ Amount to transfer displayed
   ✅ Bank account details shown:
      - Bank Name
      - Account Name
      - Account Number
      - Swift Code
      - Branch Code
   ✅ Copy-to-clipboard buttons present
   ✅ Processing time (1-2 hours) displayed
   ✅ Transaction reference input field
   ```

5. **Copy Bank Details**
   ```
   Click "Copy" button for each field
   EXPECTED: Toast "Copied to clipboard!" for each
   ```

6. **Enter Transaction Reference**
   ```
   In transaction reference field, enter: "TRF20250115-TEST123"
   VERIFY: Input field accepts value
   ```

7. **Confirm Payment WITHOUT Reference (Validation Test)**
   ```
   Go back (don't clear the form)
   Clear transaction reference field
   Try to click "Confirm Payment"
   EXPECTED: Toast "Please enter the transfer reference number"
   ORDER STATUS: Still 'pending' (not changed)
   ```

8. **Enter Reference Again**
   ```
   Enter transaction reference: "TRF20250115-TEST123"
   Click "Confirm Payment"
   EXPECTED: Toast "Payment confirmation submitted! 🎉"
   ```

9. **Backend Verification**
   ```
   Database check after confirmation:
   db.orders.findOne({ _id: <orderId> })
   
   Expected output:
   {
     status: 'paid',                              // ✅ MUST BE 'paid'
     paymentStatus: 'confirmed',                  // ✅ MUST BE 'confirmed'
     paymentConfirmedAt: ISODate(...),            // ✅ MUST HAVE TIMESTAMP
     transactionReference: 'TRF20250115-TEST123', // ✅ MUST BE STORED
     paymentMethod: 'bank_transfer'
   }
   ```

10. **Frontend Redirect**
    ```
    Redirected to: /marketplace/orders/{orderId}
    VERIFY: Order shows as 'paid'
    ```

11. **Verify Transaction Reference Storage**
    ```
    Database check:
    db.orders.findOne({ transactionReference: 'TRF20250115-TEST123' })
    EXPECTED: Order found (reference indexed and stored)
    ```

---

### SCENARIO 3: Cash on Delivery (Complete Flow)

#### Prerequisites:
- User logged in
- Products in cart
- Backend running
- Vendor account available (for step 10)

#### Steps:

1. **Add Products to Cart**
   ```
   Navigate to marketplace
   Select products
   Add to cart
   ```

2. **Checkout**
   ```
   Go to /marketplace/cart
   Click "Proceed to Checkout"
   Enter shipping address details
   Click "Place Order"
   EXPECTED: Order created with status='pending'
   ```

3. **Payment Method Selection**
   ```
   Navigate to /marketplace/payment/{orderId}
   Select "Cash on Delivery" option
   Click "Proceed to Cash on Delivery"
   ```

4. **COD Format Page**
   ```
   Redirected to: /marketplace/payment/cash-on-delivery/{orderId}
   VERIFY:
   ✅ Order number displayed
   ✅ Amount to pay displayed (green color)
   ✅ Items list with quantities
   ✅ Delivery address displayed:
      - Name
      - Phone
      - Address
      - City
   ✅ Icons for address details
   ✅ Terms and conditions checkbox (unchecked)
   ```

5. **Confirm WITHOUT Terms Agreement (Validation Test)**
   ```
   Click "Confirm Order" without checking terms
   EXPECTED: Toast "Please agree to the terms and conditions"
   ORDER STATUS: Still 'pending' (not changed)
   ```

6. **Accept Terms**
   ```
   Check "I agree to the terms and conditions" checkbox
   Click "Confirm Order"
   EXPECTED: Toast "Order confirmed! 🎉 Vendor will contact you shortly."
   ```

7. **Backend Verification (Customer Confirmed)**
   ```
   Database check after confirmation:
   db.orders.findOne({ _id: <orderId> })
   
   Expected output:
   {
     status: 'pending',                  // ✅ MUST STAY 'pending' (NOT 'paid')
     paymentStatus: 'confirmed',         // ✅ MUST BE 'confirmed'
     paymentConfirmedAt: ISODate(...),   // ✅ MUST HAVE TIMESTAMP
     paymentMethod: 'cash_on_delivery'
   }
   
   KEY POINT: status is 'pending' NOT 'paid' ✅
   ```

8. **Frontend Redirect**
   ```
   Redirected to: /marketplace/orders/{orderId}
   VERIFY: Order shows as 'pending' (not 'paid')
   ```

9. **Verify Vendor Can See Order**
   ```
   Login as vendor
   Check vendor notifications
   EXPECTED: Notification "Payment confirmed for order {orderNumber}"
   ```

10. **Vendor Confirms COD Payment** (After delivery/cash received)
    ```
    Vendor endpoint call:
    POST /api/marketplace/orders/{orderId}/confirm-cod-payment
    
    Backend confirmation:
    db.orders.findOne({ _id: <orderId> })
    
    Expected after vendor confirms:
    {
      status: 'paid',                     // ✅ NOW 'paid' (changed by vendor)
      paymentStatus: 'confirmed',         // ✅ Still confirmed
      paymentConfirmedAt: ISODate(...),
      paymentMethod: 'cash_on_delivery'
    }
    ```

11. **Verify Order Status Changed**
    ```
    Customer views order:
    Navigate to /marketplace/orders/{orderId}
    VERIFY: Order shows as 'paid' (changed after vendor confirmed)
    ```

---

## Status Change Verification Checklist

### ✅ Mobile Money
- [ ] Order created: `status='pending'`
- [ ] After customer confirms: `status='paid'` ✅
- [ ] Cannot change back to pending
- [ ] Final state: PAID

### ✅ Bank Transfer
- [ ] Order created: `status='pending'`
- [ ] After customer confirms: `status='paid'` ✅
- [ ] Transaction reference stored ✅
- [ ] Cannot change back to pending
- [ ] Final state: PAID

### ✅ Cash on Delivery (2-phase)
- [ ] Order created: `status='pending'`
- [ ] After customer confirms: `status='pending'` (NO CHANGE) ✅
- [ ] Payment status changes to 'confirmed' ✅
- [ ] After vendor confirms: `status='paid'` ✅
- [ ] Final state: PAID (but requires 2 confirmations)

---

## Database Query Commands

### Find All Paid Orders
```javascript
db.orders.find({ status: 'paid', paymentStatus: 'confirmed' })
```

### Find Orders by Payment Method
```javascript
// Mobile Money paid
db.orders.find({ paymentMethod: 'mobile_money', status: 'paid' })

// Bank Transfer paid
db.orders.find({ paymentMethod: 'bank_transfer', status: 'paid' })

// COD awaiting vendor confirmation
db.orders.find({ paymentMethod: 'cash_on_delivery', status: 'pending', paymentStatus: 'confirmed' })

// COD completed
db.orders.find({ paymentMethod: 'cash_on_delivery', status: 'paid', paymentStatus: 'confirmed' })
```

### Find Orders by Transaction Reference
```javascript
db.orders.find({ transactionReference: { $exists: true } })
```

### Count Paid Orders by Method
```javascript
db.orders.aggregate([
  { $match: { status: 'paid', paymentStatus: 'confirmed' } },
  { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
])
```

---

## API Testing with Postman

### 1. Create Order
```
POST http://localhost:5000/api/marketplace/cart/checkout
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "shippingAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "New York"
  },
  "paymentMethod": "mobile_money",
  "contactPhone": "1234567890"
}

Response Status: 200
Response Body includes: orderId, status='pending'
```

### 2. Confirm Mobile Money Payment
```
POST http://localhost:5000/api/marketplace/orders/{orderId}/confirm-payment
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "paymentMethod": "mobile_money"
}

Response Status: 200
Response Body: order with status='paid', paymentStatus='confirmed'
```

### 3. Confirm Bank Transfer Payment
```
POST http://localhost:5000/api/marketplace/orders/{orderId}/confirm-payment
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "paymentMethod": "bank_transfer",
  "transactionReference": "TRF20250115-ABC123"
}

Response Status: 200
Response Body: order with status='paid', transactionReference stored
```

### 4. Confirm COD Order
```
POST http://localhost:5000/api/marketplace/orders/{orderId}/confirm-payment
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "paymentMethod": "cash_on_delivery"
}

Response Status: 200
Response Body: order with status='pending' (NOT 'paid'), paymentStatus='confirmed'
```

### 5. Vendor Confirms COD
```
POST http://localhost:5000/api/marketplace/orders/{orderId}/confirm-cod-payment
Authorization: Bearer {vendor_token}
Content-Type: application/json

Body: {}

Response Status: 200
Response Body: order with status='paid'
```

---

## Troubleshooting

### Issue 1: Payment Confirmation Returns 403
**Cause:** User ID mismatch
**Solution:** Ensure you're using the correct user token for the order

### Issue 2: Order Status Doesn't Change to 'paid'
**Cause:** Invalid payment method
**Solution:** Use one of: 'mobile_money', 'bank_transfer', 'cash_on_delivery'

### Issue 3: Transaction Reference Not Stored
**Cause:** Payment method is not 'bank_transfer'
**Solution:** Transaction reference only stores for bank transfers

### Issue 4: COD Order Shows as 'pending' Instead of 'paid'
**Cause:** This is CORRECT behavior until vendor confirms
**Solution:** Vendor must call `/confirm-cod-payment` endpoint

### Issue 5: Cannot Confirm Payment Twice
**Cause:** This is CORRECT - payment protection
**Solution:** This is intentional to prevent duplicate payments

---

## Performance Checks

### Query Performance
```javascript
// Check indexes on transactionReference
db.orders.getIndexes()

// Should see index: transactionReference_1

// Check performance
db.orders.explain("executionStats").find({ transactionReference: "TRF20250115-ABC123" })
```

### Notification Performance
```javascript
// Verify notifications created quickly
db.notifications.find({ orderId: ObjectId("<orderId>") })

// Should have instant creation, no delays
```

---

## Conclusion

Complete end-to-end testing ensures:
✅ Only 'paid' status = completed payment
✅ Mobile Money & Bank Transfer: Paid immediately
✅ COD: Requires vendor confirmation
✅ Transaction references stored for verification
✅ Proper state transitions for each method
✅ No duplicate payments possible

---

**Last Updated:** January 2025
**Status:** READY FOR TESTING ✅