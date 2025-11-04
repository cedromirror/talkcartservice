# Quick Order Flow Test Guide

## Quick Start (5 minutes)

Test the complete order flow from cart → payment → order details.

---

## Test 1: Payment Flow (NO Premature Flutterwave Redirect) ✅

**Duration:** 2 minutes

### Steps:

1. **Add Item to Cart**
   - Go to marketplace
   - Select any product
   - Click "Add to Cart"
   - Go to cart page

2. **Proceed to Payment**
   - Click "Checkout"
   - Fill in shipping address
   - Click "Continue to Payment"
   - ✅ **VERIFY:** You land on payment page, NOT Flutterwave

3. **Test Each Payment Method**
   - **Mobile Money:**
     - Select "Mobile Money" option
     - ✅ VERIFY: See payment instructions, no redirect
     - Click "Confirm Payment"
     - ✅ VERIFY: Redirected to order details, NOT Flutterwave

   - **Bank Transfer:**
     - Select "Bank Transfer" option
     - ✅ VERIFY: See transfer amount and reference
     - Click "Confirm Payment"
     - ✅ VERIFY: Redirected to order details

   - **Cash on Delivery:**
     - Select "Cash on Delivery" option
     - ✅ VERIFY: See COD confirmation with phone
     - Click "Confirm Order"
     - ✅ VERIFY: Redirected to order details

---

## Test 2: Order Status Features ✅

**Duration:** 3 minutes

### Prerequisites:
- Have a completed payment order (status: "paid")
- Have vendor access to vendor dashboard

### Steps:

1. **Check Order Details Page**
   - Go to `/marketplace/orders/{orderId}`
   - ✅ VERIFY: OrderStatusTimeline component displays
   - ✅ VERIFY: Shows current status
   - ✅ VERIFY: Shows all status stages (6 total)

2. **Update Status as Vendor**
   - Go to Vendor Dashboard → Orders
   - Find a "paid" order
   - Click "Update Status" → "Processing"
   - ✅ VERIFY: Status changes in order details
   - ✅ VERIFY: Customer gets notification

3. **Test Shipping Status**
   - Same order, click "Update Status" → "Shipped"
   - Add tracking number: "123456789"
   - Add carrier: "DHL"
   - ✅ VERIFY: Tracking info appears in order details
   - ✅ VERIFY: Timeline shows shipped with date

4. **Test Delivered Status**
   - Same order, click "Update Status" → "Delivered"
   - ✅ VERIFY: Timeline shows delivered with date
   - ✅ VERIFY: Cancel button disappears
   - ✅ VERIFY: Loyalty points awarded (if applicable)

---

## Test 3: Order Details Page ✅

**Duration:** 2 minutes

### Go to: `/marketplace/orders/{orderId}`

### Verify These Sections Exist:

**✅ Order Header**
- Order number visible
- Order date visible
- Current status badge

**✅ Order Items**
- All items listed
- Name, price, quantity shown
- Total amount calculated correctly

**✅ Payment Information**
- Payment method displayed
- Payment status shown
- Amount displayed

**✅ Shipping Address**
- Name, email, phone visible
- Full address shown
- City, state, country shown

**✅ Order Timeline**
- All 6 status stages visible
- Current status highlighted
- Timestamps shown for completed stages
- Estimated delivery shown if available

**✅ Tracking Information** (if shipped)
- Tracking number visible
- Carrier shown
- Estimated delivery date shown

**✅ Action Buttons**
- Cancel button (only if pending/paid)
- Back button
- Contact info available

---

## Test 4: Orders List Page ✅

**Duration:** 1 minute

### Go to: `/orders`

### Verify:

1. **List Displays**
   - ✅ All your orders show in list/grid
   - ✅ Show order number
   - ✅ Show status with badge
   - ✅ Show date
   - ✅ Show amount

2. **Click Order**
   - Click any order card
   - ✅ VERIFY: Navigate to order details page

3. **Page Works on Mobile**
   - Resize to mobile size
   - ✅ VERIFY: Layout adapts
   - ✅ VERIFY: All info still readable

---

## Common Issues & Solutions

### Issue: Payment page has redirect button to Flutterwave
- **Expected:** No redirect button should exist on payment page
- **Solution:** Select payment method and confirm - the flow should NOT redirect to Flutterwave after confirmation

### Issue: Order details page doesn't load
- **Check:** Is orderId in URL correct?
- **Check:** Are you authenticated (logged in)?
- **Solution:** Go back to orders list and try again

### Issue: Status doesn't update in real-time
- **Solution:** Refresh the page to see latest status
- **Expected:** Timeline updates when vendor changes status

### Issue: Tracking info not showing
- **Expected:** Only shows for orders with status "shipped" and tracking number
- **Check:** Did vendor add tracking number?
- **Solution:** Have vendor update status to "shipped" with tracking number

### Issue: Cancel button not visible
- **Expected:** Only shows for "pending" or "paid" orders
- **Check:** Is order already processing/shipped/delivered?
- **Solution:** Cancel only works before order ships

---

## API Endpoints Being Tested

```
GET /api/marketplace/orders
  → Fetches list of your orders

GET /api/marketplace/orders/:orderId
  → Fetches order details

POST /api/marketplace/orders/:orderId/confirm-payment
  → Confirms payment (mobile_money, bank_transfer)

POST /api/marketplace/orders/:orderId/confirm-cod-payment
  → Confirms COD payment

POST /api/marketplace/orders/:orderId/cancel
  → Cancels pending/paid order

PUT /api/marketplace/orders/:orderId/status
  → Vendor updates order status
```

---

## Success Criteria

✅ **All these must be TRUE:**

1. Payment page loads without Flutterwave redirect
2. All 3 payment methods work correctly
3. After payment confirmation, redirected to order details
4. Order details page shows all information
5. OrderStatusTimeline displays all 6 statuses
6. Vendor can update status to processing → shipped → delivered
7. Tracking info displays when order is shipped
8. Cancel button works for pending/paid orders
9. Cannot cancel processing/shipped/delivered orders
10. Orders list page loads and shows all orders

---

## Quick Reference Commands

### If you need to test with test data:

```bash
# Check backend logs for errors
tail -f backend/logs/error.log

# Restart backend (if needed)
pm2 restart backend

# Check frontend for console errors
# Open DevTools → Console tab → Check for red errors
```

---

## Screenshots/URLs to Test

1. **Cart Page:** `/marketplace/cart`
2. **Checkout:** `/marketplace/checkout`
3. **Payment:** `/marketplace/payment?orderId={id}`
4. **Order Details:** `/marketplace/orders/{orderId}`
5. **Orders List:** `/orders`
6. **Vendor Dashboard Orders:** `/vendor/orders`

---

## Final Verification Checklist

After running tests, confirm:

- [ ] Payment page shows payment methods without redirect
- [ ] All 3 payment methods work (Mobile Money, Bank Transfer, COD)
- [ ] After confirmation, redirected to order details (NOT Flutterwave)
- [ ] Order details page loads with all information
- [ ] Status timeline displays correctly
- [ ] Vendor can update status → processing → shipped → delivered
- [ ] Tracking info displays for shipped orders
- [ ] Cancel button works for pending/paid orders
- [ ] Cancel button hidden for shipped/delivered orders
- [ ] Orders list page works and shows all orders

---

**Status:** Ready for Testing ✅  
**Estimated Test Time:** 8 minutes  
**Last Updated:** January 2025