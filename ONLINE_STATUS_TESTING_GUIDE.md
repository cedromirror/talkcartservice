# 🧪 Online/Offline Status Testing Guide

**Date**: 2025-10-26  
**Status**: Ready for Testing

---

## 📋 Test Scenarios

### 1. Basic Online/Offline Status

#### Test 1.1: User Goes Online
**Steps**:
1. Start the application
2. Log in as User A
3. Check if status shows "Online"
4. Check if green dot appears next to username

**Expected Result**: ✅ User shows as online with green indicator

#### Test 1.2: User Goes Offline
**Steps**:
1. User A is logged in and online
2. Close the browser or disconnect
3. Wait 5 seconds
4. Log in as User B
5. Check User A's status

**Expected Result**: ✅ User A shows as offline with grey indicator and "Last seen X minutes ago"

#### Test 1.3: Multiple Devices
**Steps**:
1. Log in as User A on Device 1
2. Log in as User A on Device 2
3. Check status on both devices
4. Disconnect Device 1
5. Check status on Device 2

**Expected Result**: ✅ Status syncs across devices, shows online if any device is connected

---

### 2. Status Changes

#### Test 2.1: Change to Away
**Steps**:
1. User A is online
2. Click status selector
3. Select "Away"
4. Check indicator color

**Expected Result**: ✅ Status changes to yellow "Away"

#### Test 2.2: Change to Busy
**Steps**:
1. User A is online
2. Click status selector
3. Select "Busy"
4. Check indicator color

**Expected Result**: ✅ Status changes to red "Busy"

#### Test 2.3: Status Broadcast
**Steps**:
1. User A changes status to "Away"
2. User B has User A's profile open
3. Check if User B sees status change in real-time

**Expected Result**: ✅ Status updates in real-time for all viewers

---

### 3. Real-Time Updates

#### Test 3.1: Socket.io Updates
**Steps**:
1. Open User A's profile in Browser 1
2. Log in as User A in Browser 2
3. Check if status updates in Browser 1 within 1 second

**Expected Result**: ✅ Status updates via Socket.io in real-time

#### Test 3.2: API Polling Fallback
**Steps**:
1. Disable Socket.io in browser DevTools
2. Open User A's profile
3. Wait 30 seconds
4. Check if status updates via API polling

**Expected Result**: ✅ Status updates via API polling after 30 seconds

#### Test 3.3: Socket Reconnection
**Steps**:
1. User A is online
2. Disconnect network
3. Wait 5 seconds
4. Reconnect network
5. Check if status recovers

**Expected Result**: ✅ Status recovers after reconnection

---

### 4. Privacy Controls

#### Test 4.1: Hide Online Status
**Steps**:
1. User A disables "Show Online Status" in settings
2. User B views User A's profile
3. Check if online status is hidden

**Expected Result**: ✅ Online status is hidden for other users

#### Test 4.2: Show Last Seen
**Steps**:
1. User A enables "Show Last Seen" in settings
2. User A goes offline
3. User B views User A's profile
4. Check if "Last seen" is visible

**Expected Result**: ✅ Last seen time is visible

#### Test 4.3: Own Profile Always Shows Status
**Steps**:
1. User A disables "Show Online Status"
2. User A views own profile
3. Check if own status is visible

**Expected Result**: ✅ Own status always visible regardless of privacy settings

---

### 5. UI Components

#### Test 5.1: Dot Variant
**Steps**:
1. Add `<OnlineStatusIndicator variant="dot" />`
2. Check if simple dot appears
3. Hover over dot to see tooltip

**Expected Result**: ✅ Dot appears with tooltip showing status

#### Test 5.2: Badge Variant
**Steps**:
1. Add `<OnlineStatusIndicator variant="badge" />`
2. Check if dot with label appears
3. Verify color matches status

**Expected Result**: ✅ Badge shows dot and status label

#### Test 5.3: Full Variant
**Steps**:
1. Add `<OnlineStatusIndicator variant="full" showLastSeen />`
2. Check if full status display appears
3. Verify last seen time is shown

**Expected Result**: ✅ Full display with all information

#### Test 5.4: Size Variants
**Steps**:
1. Test with `size="small"`
2. Test with `size="medium"`
3. Test with `size="large"`
4. Verify sizes are correct

**Expected Result**: ✅ All sizes render correctly

---

### 6. Performance

#### Test 6.1: Load Time
**Steps**:
1. Open page with 50 users
2. Measure load time
3. Check if page is responsive

**Expected Result**: ✅ Page loads in < 2 seconds

#### Test 6.2: Memory Usage
**Steps**:
1. Open DevTools Memory tab
2. Load page with 100 users
3. Check memory usage
4. Scroll and interact
5. Check for memory leaks

**Expected Result**: ✅ Memory usage stable, no leaks

#### Test 6.3: Network Usage
**Steps**:
1. Open DevTools Network tab
2. Load page
3. Check API calls
4. Verify batch endpoint is used for multiple users

**Expected Result**: ✅ Efficient network usage with batch requests

---

### 7. Edge Cases

#### Test 7.1: Rapid Status Changes
**Steps**:
1. Rapidly change status multiple times
2. Check if all changes are processed
3. Verify no status is skipped

**Expected Result**: ✅ All status changes processed correctly

#### Test 7.2: Offline User Status
**Steps**:
1. User A goes offline
2. User B tries to change User A's status
3. Verify error handling

**Expected Result**: ✅ Proper error handling for offline users

#### Test 7.3: Deleted User
**Steps**:
1. Delete User A
2. Check if status endpoint returns 404
3. Verify UI handles gracefully

**Expected Result**: ✅ Graceful error handling

#### Test 7.4: Invalid User ID
**Steps**:
1. Call status endpoint with invalid ID
2. Check response

**Expected Result**: ✅ Returns 400 Bad Request

---

## 🔍 Manual Testing Checklist

- [ ] User goes online - shows green dot
- [ ] User goes offline - shows grey dot with last seen
- [ ] Status changes broadcast in real-time
- [ ] Privacy settings respected
- [ ] Own profile always shows status
- [ ] Socket.io updates work
- [ ] API polling fallback works
- [ ] Socket reconnection works
- [ ] All UI variants render correctly
- [ ] All sizes render correctly
- [ ] Performance is acceptable
- [ ] No memory leaks
- [ ] Network usage is efficient
- [ ] Rapid changes handled correctly
- [ ] Error cases handled gracefully

---

## 🤖 Automated Testing

### Unit Tests
```bash
npm run test -- useOnlineStatus.test.ts
npm run test -- OnlineStatusIndicator.test.tsx
npm run test -- PresenceContext.test.tsx
```

### Integration Tests
```bash
npm run test:integration -- online-status.integration.test.ts
```

### E2E Tests
```bash
npm run test:e2e -- online-status.e2e.test.ts
```

---

## 📊 Test Results Template

| Test | Status | Notes |
|------|--------|-------|
| 1.1 User Goes Online | ⏳ | |
| 1.2 User Goes Offline | ⏳ | |
| 1.3 Multiple Devices | ⏳ | |
| 2.1 Change to Away | ⏳ | |
| 2.2 Change to Busy | ⏳ | |
| 2.3 Status Broadcast | ⏳ | |
| 3.1 Socket.io Updates | ⏳ | |
| 3.2 API Polling | ⏳ | |
| 3.3 Socket Reconnection | ⏳ | |
| 4.1 Hide Online Status | ⏳ | |
| 4.2 Show Last Seen | ⏳ | |
| 4.3 Own Profile | ⏳ | |
| 5.1 Dot Variant | ⏳ | |
| 5.2 Badge Variant | ⏳ | |
| 5.3 Full Variant | ⏳ | |
| 5.4 Size Variants | ⏳ | |
| 6.1 Load Time | ⏳ | |
| 6.2 Memory Usage | ⏳ | |
| 6.3 Network Usage | ⏳ | |
| 7.1 Rapid Changes | ⏳ | |
| 7.2 Offline User | ⏳ | |
| 7.3 Deleted User | ⏳ | |
| 7.4 Invalid ID | ⏳ | |

---

## 🚀 Next Steps

1. Run manual tests from checklist
2. Execute automated tests
3. Fix any issues found
4. Document results
5. Deploy to staging
6. Perform UAT
7. Deploy to production

---

**Ready for Testing**: ✅ YES  
**Estimated Testing Time**: 2-3 hours  
**Last Updated**: 2025-10-26

