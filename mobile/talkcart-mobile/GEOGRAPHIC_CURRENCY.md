# Geographically-Based Currency Detection

## Overview

The mobile app now includes geographically-based currency detection similar to the website, automatically detecting users' preferred currency based on their location.

## Implementation Details

### Currency Detection Methods

1. **Location-Based Detection**: Uses IP geolocation to determine user's country and map it to a currency
2. **Locale-Based Fallback**: Uses device locale settings when location detection fails
3. **User Preference**: Allows users to manually select their preferred currency
4. **Caching**: Caches detected currency for 1 hour to avoid repeated API calls

### Supported African Currencies

The app includes special support for African currencies, similar to the website:
- **KES**: Kenyan Shilling (KSh)
- **UGX**: Ugandan Shilling (USh)
- **TZS**: Tanzanian Shilling (TSh)
- **RWF**: Rwandan Franc (RF)
- **NGN**: Nigerian Naira (₦)
- **GHS**: Ghanaian Cedi (GH₵)
- **ZAR**: South African Rand (R)
- **ETB**: Ethiopian Birr (Br)
- **XOF**: West African CFA Franc (CFA)

### Key Features

1. **Automatic Detection**: Detects currency based on user's location
2. **Smart Fallbacks**: Falls back to locale detection if location fails
3. **Exchange Rate API**: Uses real exchange rates with fallback to mock data
4. **Proper Formatting**: Formats currencies according to local conventions
5. **Persistent Storage**: Saves user preferences locally
6. **Cache Management**: Caches exchange rates for 30 minutes

### Components

#### Currency Service ([src/lib/currency.ts](file:///d:/talkcart/mobile/talkcart-mobile/src/lib/currency.ts))

- `fetchLocationBasedCurrency()`: Detects currency based on user's location
- `detectUserCurrency()`: Detects currency based on device locale
- `fetchExchangeRates()`: Fetches exchange rates from API with caching
- `convertCurrency()`: Converts amount between currencies
- `formatCurrencyAmount()`: Formats currency for display

#### Marketplace Integration ([app/(tabs)/index.tsx](file:///d:/talkcart/mobile/talkcart-mobile/app/(tabs)/index.tsx))

- Fetches location-based currency on component mount
- Converts product prices to user's detected currency
- Provides currency selection UI
- Shows both converted and original prices when different

### Data Flow

1. User opens marketplace screen
2. App attempts to detect user's location-based currency
3. Falls back to locale-based detection if needed
4. Uses cached currency if available (less than 1 hour old)
5. Products are fetched from backend API
6. Each product's price is converted to user's detected currency
7. Prices are displayed with proper formatting
8. User can change currency via the currency selection button

### Currency Mapping

The app maps locales to currencies:
- en-KE → KES (Kenyan Shilling)
- en-UG → UGX (Ugandan Shilling)
- en-TZ → TZS (Tanzanian Shilling)
- en-RW → RWF (Rwandan Franc)
- en-NG → NGN (Nigerian Naira)
- en-GH → GHS (Ghanaian Cedi)
- en-ZA → ZAR (South African Rand)
- en-ET → ETB (Ethiopian Birr)
- fr-SN → XOF (West African CFA Franc)
- fr-BF → XOF (West African CFA Franc)
- fr-ML → XOF (West African CFA Franc)

### Exchange Rates

Uses real exchange rates from exchangerate-api.com with fallback to mock data:
- USD as base currency
- 30-minute cache duration
- Comprehensive coverage of African and global currencies

### Testing

To test geographically-based currency detection:

```bash
npm run test-geographic-currency
```

This script verifies:
1. Location-based currency detection
2. User preference storage
3. Currency conversion calculations
4. Currency symbol retrieval
5. Formatting functions

## Future Enhancements

Potential improvements:
- Real IP geolocation service integration
- More comprehensive locale mapping
- Currency conversion calculator
- Historical rate tracking
- Price alerts in preferred currency

## Storage

User currency preferences are stored using AsyncStorage:
- Key: `userCurrency`
- Value: Currency code (e.g., "KES", "UGX", "USD")
- Cached with timestamp for expiration management