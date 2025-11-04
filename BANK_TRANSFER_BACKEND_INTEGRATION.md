# 🔌 Bank Transfer Payment - Backend Integration Guide

## 📋 Overview

This guide covers the backend API endpoints and database changes needed to support the new bank transfer payment page with customer bank account details.

---

## 🗄️ Database Schema Changes

### **1. Create `saved_bank_accounts` Table**

```sql
CREATE TABLE saved_bank_accounts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  account_holder_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_type VARCHAR(50) NOT NULL,
  routing_number VARCHAR(20),
  swift_code VARCHAR(20),
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

### **2. Modify `orders` Table (Optional)**

Add field to track payment confirmation details:

```sql
ALTER TABLE orders ADD COLUMN (
  payment_confirmation_details JSON,
  customer_bank_details JSON,
  transaction_reference VARCHAR(255),
  confirmed_at TIMESTAMP
);
```

### **3. Create `payment_confirmations` Table**

Track all payment confirmations:

```sql
CREATE TABLE payment_confirmations (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  customer_bank_details JSON,
  merchant_bank_details JSON,
  transaction_reference VARCHAR(255),
  status ENUM('pending', 'confirmed', 'failed', 'completed') DEFAULT 'pending',
  confirmed_at TIMESTAMP,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
);
```

---

## 🔌 API Endpoints

### **1. Get Saved Bank Accounts**

**Endpoint:** `GET /api/user/saved-bank-accounts`

**Authentication:** Required (JWT Token)

**Request:**
```http
GET /api/user/saved-bank-accounts HTTP/1.1
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "bank_12345",
      "bankName": "Sample Bank",
      "accountHolderName": "John Doe",
      "accountNumber": "****5890",
      "accountType": "savings",
      "routingNumber": "123456789",
      "swiftCode": "SMPBUSSS",
      "isPrimary": true,
      "isVerified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**Implementation (Node.js/Express):**
```javascript
router.get('/saved-bank-accounts', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const banks = await db.query(
      'SELECT * FROM saved_bank_accounts WHERE user_id = ? ORDER BY is_primary DESC',
      [userId]
    );
    
    // Mask account numbers for security
    const sanitizedBanks = banks.map(bank => ({
      ...bank,
      accountNumber: `****${bank.accountNumber.slice(-4)}`
    }));
    
    res.json({ success: true, data: sanitizedBanks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### **2. Save Bank Account**

**Endpoint:** `POST /api/user/saved-bank-accounts`

**Authentication:** Required (JWT Token)

**Request Body:**
```json
{
  "bankName": "Sample Bank",
  "accountHolderName": "John Doe Smith",
  "accountNumber": "1234567890",
  "accountType": "savings",
  "routingNumber": "123456789",
  "swiftCode": "SMPBUSSS",
  "isPrimary": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "bank_67890",
    "bankName": "Sample Bank",
    "accountHolderName": "John Doe",
    "accountNumber": "****5890",
    "accountType": "savings",
    "createdAt": "2024-01-20T14:22:00Z"
  }
}
```

**Validation:**
```javascript
// Required fields
- bankName (non-empty string)
- accountHolderName (non-empty string)
- accountNumber (8-20 digits)
- accountType (savings|checking|business)

// Optional fields
- routingNumber (8-12 digits if provided)
- swiftCode (valid SWIFT format if provided)
```

**Implementation:**
```javascript
router.post('/saved-bank-accounts', authMiddleware, async (req, res) => {
  try {
    const { bankName, accountHolderName, accountNumber, accountType, routingNumber, swiftCode, isPrimary } = req.body;
    
    // Validation
    if (!bankName || !accountHolderName || !accountNumber) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    if (!/^\d{8,20}$/.test(accountNumber)) {
      return res.status(400).json({ success: false, error: 'Invalid account number' });
    }
    
    if (swiftCode && !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode)) {
      return res.status(400).json({ success: false, error: 'Invalid SWIFT code' });
    }
    
    const bankId = generateId();
    await db.query(
      'INSERT INTO saved_bank_accounts (id, user_id, bank_name, account_holder_name, account_number, account_type, routing_number, swift_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [bankId, req.user.id, bankName, accountHolderName, accountNumber, accountType, routingNumber, swiftCode]
    );
    
    res.status(201).json({ 
      success: true, 
      data: { id: bankId, bankName, accountHolderName, accountNumber: `****${accountNumber.slice(-4)}`, accountType }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### **3. Confirm Payment (Bank Transfer)**

**Endpoint:** `POST /api/marketplace/orders/{orderId}/confirm-payment`

**Authentication:** Required (JWT Token)

**Request Body:**
```json
{
  "paymentMethod": "bank_transfer",
  "transactionReference": "TXN123456789",
  "customerBankDetails": {
    "fromBankName": "Sample Bank",
    "accountHolderName": "John Doe",
    "accountNumber": "1234567890",
    "accountType": "savings",
    "routingNumber": "123456789",
    "swiftCode": "SMPBUSSS"
  },
  "saveBankForFuture": true
}
```

**OR (with saved bank ID):**
```json
{
  "paymentMethod": "bank_transfer",
  "transactionReference": "TXN123456789",
  "customerBankDetails": {
    "savedBankAccountId": "bank_12345"
  },
  "saveBankForFuture": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "status": "payment_confirmed",
    "confirmationId": "conf_789",
    "message": "Payment confirmation received. We'll verify and process your transfer.",
    "expectedProcessingTime": "1-2 hours"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid transaction reference",
  "code": "INVALID_REFERENCE"
}
```

**Implementation:**
```javascript
router.post('/orders/:orderId/confirm-payment', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod, transactionReference, customerBankDetails, saveBankForFuture } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (paymentMethod !== 'bank_transfer') {
      return res.status(400).json({ success: false, error: 'Invalid payment method' });
    }
    
    if (!transactionReference || transactionReference.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Transaction reference required' });
    }
    
    // Verify order exists and belongs to user
    const order = await db.query(
      'SELECT * FROM orders WHERE id = ? AND customer_id = ?',
      [orderId, userId]
    );
    
    if (order.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Save bank account if requested
    if (saveBankForFuture && customerBankDetails && !customerBankDetails.savedBankAccountId) {
      const bankId = generateId();
      await db.query(
        'INSERT INTO saved_bank_accounts (id, user_id, bank_name, account_holder_name, account_number, account_type, routing_number, swift_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          bankId,
          userId,
          customerBankDetails.fromBankName,
          customerBankDetails.accountHolderName,
          customerBankDetails.accountNumber,
          customerBankDetails.accountType,
          customerBankDetails.routingNumber,
          customerBankDetails.swiftCode
        ]
      );
    }
    
    // Create payment confirmation record
    const confirmationId = generateId();
    await db.query(
      'INSERT INTO payment_confirmations (id, order_id, payment_method, customer_bank_details, transaction_reference, status) VALUES (?, ?, ?, ?, ?, ?)',
      [confirmationId, orderId, paymentMethod, JSON.stringify(customerBankDetails), transactionReference, 'pending']
    );
    
    // Update order
    await db.query(
      'UPDATE orders SET payment_status = ?, payment_confirmation_details = ?, confirmed_at = NOW() WHERE id = ?',
      ['payment_pending_verification', JSON.stringify({ confirmationId, method: paymentMethod }), orderId]
    );
    
    // Emit event for vendor notification
    io.to(`order_${orderId}`).emit('payment_confirmed', {
      orderId,
      paymentMethod,
      transactionReference: transactionReference.slice(0, 10) + '...'
    });
    
    res.json({
      success: true,
      data: {
        orderId,
        status: 'payment_confirmed',
        confirmationId,
        message: 'Payment confirmation received. We\'ll verify and process your transfer.',
        expectedProcessingTime: '1-2 hours'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🔐 Security Considerations

### **1. Bank Account Masking**
Always mask sensitive account information:
```javascript
accountNumber: `****${accountNumber.slice(-4)}`
```

### **2. Data Encryption**
Store bank details encrypted:
```javascript
const crypto = require('crypto');

function encryptBankDetails(details) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(JSON.stringify(details), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

### **3. PCI Compliance**
- Never log full account numbers
- Use HTTPS only
- Implement rate limiting on API endpoints
- Regular security audits

### **4. Validation & Sanitization**
```javascript
// Sanitize input
const sanitize = (input) => input.replace(/[^a-zA-Z0-9 -]/g, '').slice(0, 255);

// Validate SWIFT code
const isValidSwiftCode = (code) => /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(code);

// Validate account number
const isValidAccountNumber = (num) => /^\d{8,20}$/.test(num);
```

---

## 📊 Database Indexes

Optimize query performance:

```sql
-- Indexes for common queries
CREATE INDEX idx_saved_banks_user ON saved_bank_accounts(user_id);
CREATE INDEX idx_payment_confirmations_order ON payment_confirmations(order_id);
CREATE INDEX idx_payment_confirmations_status ON payment_confirmations(status);
CREATE INDEX idx_payment_confirmations_reference ON payment_confirmations(transaction_reference);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
```

---

## 🧪 Testing Endpoints

### **Test Saved Bank Accounts**
```bash
# Create bank account
curl -X POST http://localhost:5000/api/user/saved-bank-accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "Test Bank",
    "accountHolderName": "John Doe",
    "accountNumber": "1234567890",
    "accountType": "savings"
  }'

# Get saved banks
curl -X GET http://localhost:5000/api/user/saved-bank-accounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Test Payment Confirmation**
```bash
curl -X POST http://localhost:5000/api/marketplace/orders/order_123/confirm-payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "bank_transfer",
    "transactionReference": "TXN123456789",
    "customerBankDetails": {
      "fromBankName": "Test Bank",
      "accountHolderName": "John Doe",
      "accountNumber": "1234567890",
      "accountType": "savings"
    },
    "saveBankForFuture": true
  }'
```

---

## 📝 Migration Checklist

- [ ] Create `saved_bank_accounts` table
- [ ] Modify `orders` table to add payment fields
- [ ] Create `payment_confirmations` table
- [ ] Implement `/api/user/saved-bank-accounts` GET endpoint
- [ ] Implement `/api/user/saved-bank-accounts` POST endpoint
- [ ] Implement `/api/marketplace/orders/{orderId}/confirm-payment` endpoint
- [ ] Add encryption for bank details
- [ ] Add validation middleware
- [ ] Set up indexes
- [ ] Add logging for audit trail
- [ ] Test all endpoints
- [ ] Add error handling
- [ ] Document API responses
- [ ] Update API documentation

---

## ✅ Integration Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend Page | ✅ Complete | Bank transfer page updated |
| Database Schema | ⏳ Pending | Needs to be created |
| GET Saved Banks Endpoint | ⏳ Pending | Needs implementation |
| POST Save Bank Endpoint | ⏳ Pending | Needs implementation |
| POST Confirm Payment Endpoint | ⏳ Pending | Needs implementation |
| Encryption | ⏳ Pending | Needs implementation |
| Testing | ⏳ Pending | Needs unit/integration tests |

---

## 🚀 Deployment Steps

1. **Database Migration**
   - Run SQL scripts to create tables
   - Create indexes

2. **Backend Deployment**
   - Deploy API endpoints
   - Configure encryption keys
   - Test all endpoints

3. **Frontend Deployment**
   - Deploy updated bank transfer page
   - Clear CDN cache
   - Test in production

4. **Monitoring**
   - Monitor payment confirmations
   - Check for validation errors
   - Track transaction success rate

---

## 📞 Support

For questions or issues with backend integration:
- Review this guide
- Check API responses for error codes
- Enable debug logging
- Test endpoints with curl/Postman

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Ready for Backend Development