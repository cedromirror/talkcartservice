# Currency Conversion in Mobile App

## Overview

The mobile app now includes currency conversion functionality that allows users to view product prices in their preferred currency. This feature supports both fiat and cryptocurrency conversions.

## Implementation Details

### Supported Currencies

The app supports the following currencies:
- **Fiat Currencies**: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY
- **Cryptocurrencies**: ETH, BTC, USDC, USDT

### Key Features

1. **User Currency Preference**: Users can select their preferred currency
2. **Automatic Conversion**: Product prices are automatically converted to the user's preferred currency
3. **Dual Display**: When converted, both the converted price and original price are shown
4. **Persistent Storage**: User currency preference is saved locally
5. **Currency Selection UI**: Easy-to-use modal for currency selection

### Components

#### Currency Utility ([src/lib/currency.ts](file:///d:/talkcart/mobile/talkcart-mobile/src/lib/currency.ts))

- `getUserCurrency()`: Get user's preferred currency from storage
- `setUserCurrency()`: Save user's preferred currency
- `convertCurrency()`: Convert amount from one currency to another
- `formatCurrency()`: Format currency for display
- `getConvertedPrice()`: Get formatted converted price
- `getCurrencySymbol()`: Get symbol for a currency code

#### Marketplace Integration ([app/(tabs)/index.tsx](file:///d:/talkcart/mobile/talkcart-mobile/app/(tabs)/index.tsx))

- Fetches user's preferred currency on component mount
- Converts product prices for display
- Provides currency selection modal
- Shows both converted and original prices when different

### Data Flow

1. User opens marketplace screen
2. App fetches user's preferred currency from local storage
3. Products are fetched from backend API
4. Each product's price is converted to user's preferred currency
5. Prices are displayed with proper formatting
6. User can change currency via the currency selection button

### Display Logic

When displaying prices:
- If product currency matches user currency: Show price with currency symbol
- If product currency differs from user currency: Show converted price + original price in parentheses

Example:
- User currency: USD
- Product price: Ξ1.5 (ETH)
- Display: $4,500.00 (ETH 1.50)

### Testing

To test currency conversion functionality:

```bash
npm run test-currency
```

This script verifies:
1. Currency conversion calculations
2. User preference storage
3. Currency symbol retrieval
4. Formatting functions

## Future Enhancements

Potential improvements:
- Real-time exchange rates from external API
- More currencies support
- Currency conversion calculator
- Historical rate tracking
- Price alerts in preferred currency

## Exchange Rates

Currently using mock exchange rates for demonstration. In a production environment, these would be fetched from a real exchange rate API.

Current mock rates include:
- ETH/USD: 3000
- BTC/USD: 60000
- USDC/USD: 1 (stablecoin)
- USDT/USD: 1 (stablecoin)

## Storage

User currency preferences are stored using AsyncStorage:
- Key: `userCurrency`
- Value: Currency code (e.g., "USD", "EUR", "ETH")