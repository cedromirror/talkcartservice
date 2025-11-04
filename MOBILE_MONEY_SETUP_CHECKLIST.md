# 📋 Mobile Money Flutterwave Setup Checklist

## ✅ Code Changes (COMPLETED)

- [x] Updated mobile money payment page to redirect to Flutterwave
- [x] Created callback handler for Flutterwave response
- [x] Added Flutterwave environment configuration
- [x] Implemented proper error handling
- [x] Added security checks and authorization

---

## 🔧 Configuration Steps (YOU NEED TO DO)

### Step 1: Create Flutterwave Account
- [ ] Go to https://flutterwave.com
- [ ] Click "Sign Up"
- [ ] Create merchant account
- [ ] Verify your email
- [ ] Complete KYC verification

### Step 2: Get API Keys
- [ ] Log into Flutterwave Dashboard
- [ ] Go to Settings → API
- [ ] Copy **Secret Key (Live)**
- [ ] Copy **Public Key (Live)**

### Step 3: Add Keys to Backend
**File:** `c:\talkcart\backend\.env`

Find this section:
```
# Flutterwave Payment Gateway Configuration
FLW_SECRET_KEY=your_flutterwave_secret_key_here
FLW_PUBLIC_KEY=your_flutterwave_public_key_here
NEXT_PUBLIC_FLW_PUBLIC_KEY=your_flutterwave_public_key_here
```

Replace with your actual keys:
```
FLW_SECRET_KEY=FLWSECK_LIVE-1234567890abc
FLW_PUBLIC_KEY=FLWPUBK_LIVE-1234567890abc
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_LIVE-1234567890abc
```

### Step 4: Add Keys to Frontend
**File:** `c:\talkcart\frontend\.env`

Find:
```
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X
```

Replace with:
```
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_LIVE-1234567890abc
```

### Step 5: Restart Services

**Terminal 1 - Backend:**
```bash
cd c:\talkcart\backend
npm restart
```

**Terminal 2 - Frontend:**
```bash
cd c:\talkcart\frontend
npm restart
```

---

## 🧪 Testing (Manual)

### Test 1: Navigation
- [ ] Go to http://localhost:3000
- [ ] Go to Marketplace
- [ ] Add product to cart
- [ ] Go to checkout

### Test 2: Payment Method Selection
- [ ] Click "Pay Now" or checkout button
- [ ] Select "Mobile Money"
- [ ] Click "Proceed to Payment"
- [ ] Should redirect to mobile money format page

### Test 3: Mobile Money Page
- [ ] Page loads successfully
- [ ] Order details show correctly
- [ ] Amount displays properly
- [ ] Instructions are visible
- [ ] Click "Proceed to Payment"

### Test 4: Flutterwave Redirect
- [ ] ✅ **CRITICAL:** URL changes to Flutterwave domain
- [ ] ✅ **CRITICAL:** See Flutterwave checkout page
- [ ] ✅ **CRITICAL:** HTTPS secure connection
- [ ] Not staying on your domain

### Test 5: Payment Processing
- [ ] Can select mobile money provider
- [ ] Phone number field appears
- [ ] Can enter OTP
- [ ] Can confirm payment

### Test 6: Callback & Confirmation
- [ ] After successful payment, redirects back to your site
- [ ] Shows "Payment Successful ✅"
- [ ] Order status changed to "PAID"
- [ ] Order appears in My Orders with status "Completed"

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Flutterwave not configured"
```
Error: Flutterwave not configured
```

**Solution:**
1. Open `backend/.env`
2. Check `FLW_SECRET_KEY` is not empty
3. Check it doesn't say "your_flutterwave_secret_key_here"
4. Restart backend: `npm restart`
5. Try again

### Issue 2: Redirect not working
```
Button click does nothing or error in console
```

**Solution:**
1. Check browser console (F12 → Console tab)
2. Verify `/api/payments/flutterwave/init` responds
3. Check API response in Network tab
4. Ensure backend API URL matches in frontend .env
5. Restart both backend and frontend

### Issue 3: Callback page shows blank
```
Page loads but shows nothing
```

**Solution:**
1. Check URL has query params: `?status=...`
2. Check browser console for errors
3. Verify orderId in URL matches order
4. Check network requests to `/marketplace/orders/:id/confirm-payment`

### Issue 4: Order not marked as paid
```
Payment shows success but order still "pending"
```

**Solution:**
1. Check Flutterwave dashboard - was payment actually successful?
2. Check backend logs for confirm-payment endpoint
3. Verify authentication token in request
4. Check database directly if order.status was updated

---

## 📊 Verification

### Step 1: Check Backend Configuration
```bash
cd c:\talkcart\backend
node -e "console.log(process.env.FLW_SECRET_KEY)"
```
Should output your secret key (not "your_flutterwave_secret_key_here")

### Step 2: Test API Endpoint
```bash
curl -X POST http://localhost:8000/api/payments/flutterwave/init \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "USD",
    "tx_ref": "test-1234",
    "customer": {
      "email": "test@example.com",
      "name": "Test User",
      "phonenumber": "+1234567890"
    },
    "meta": {"orderId": "123"}
  }'
```

Should return Flutterwave response with payment link.

### Step 3: Check Frontend Configuration
Open browser console and type:
```javascript
console.log(process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY)
```
Should output your public key.

---

## 🚀 Production Deployment

### Before Going Live

- [ ] Switch from TEST keys to LIVE keys
- [ ] Update `backend/.env`
- [ ] Update `frontend/.env`
- [ ] Restart both services
- [ ] Test full payment flow with real payment
- [ ] Verify money is received in your account
- [ ] Set up proper error monitoring
- [ ] Configure email notifications
- [ ] Test refund process

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| **Flutterwave Dashboard** | https://dashboard.flutterwave.com |
| **API Documentation** | https://developer.flutterwave.com |
| **Backend Endpoint** | `POST /api/payments/flutterwave/init` |
| **Callback Endpoint** | `/marketplace/payment/mobile-money/callback` |
| **Payment Format Page** | `/marketplace/payment/mobile-money/[orderId]` |
| **Main Payment Page** | `/marketplace/payment` |

---

## ✨ Success Criteria

You'll know it's working when:

1. ✅ Clicking "Proceed to Payment" redirects to Flutterwave (not staying on your site)
2. ✅ Flutterwave URL is in the format: `https://checkout.flutterwave.com/...`
3. ✅ Can complete payment on Flutterwave
4. ✅ Redirected back to your site after payment
5. ✅ See "Payment Successful ✅" message
6. ✅ Order status changes to "Completed"
7. ✅ Payment appears in Flutterwave dashboard
8. ✅ Money received in your bank account (with Flutterwave)

---

**Status: Ready for Configuration ✅**

Once you add your Flutterwave API keys and restart services, mobile money payments will be fully operational!