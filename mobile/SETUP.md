# Eventrix Mobile App Setup

## Installation

### Prerequisites
- Node.js 18+
- Expo CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Setup

```bash
# Install dependencies
npm install

# or with yarn
yarn install
```

## Development

```bash
# Start Expo server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/           # Screen components
│   ├── store/             # Zustand stores
│   ├── navigation/        # Navigation configuration
│   └── utils/             # Utility functions
├── assets/                # Images and fonts
├── app.json               # Expo configuration
└── package.json
```

## State Management (Zustand)

The app uses Zustand for global state management:

### useCartStore
- `items` - Cart items
- `total` - Total price
- `addItem()` - Add item to cart
- `removeItem()` - Remove item from cart
- `updateQuantity()` - Update item quantity
- `clearCart()` - Clear cart

### useUserStore
- `user` - Current user data
- `isAuthenticated` - Auth status
- `token` - JWT token
- `setUser()` - Set user
- `logout()` - Logout

### useProductStore
- `products` - Product list
- `favorites` - Favorite item IDs
- `toggleFavorite()` - Add/remove favorite

## Dark/Light Mode

The app automatically detects system color scheme preference:

```typescript
import { useColorScheme } from 'react-native'

const colorScheme = useColorScheme()
const isDark = colorScheme === 'dark'
```

## Payment Integration

Payment methods available:
- Stripe (Credit/Debit Card)
- Razorpay (UPI, Google Pay)

Configure API keys in:
- Android: `AndroidManifest.xml`
- iOS: `Info.plist`

## Building for Production

### iOS

```bash
eas build --platform ios --auto-submit
```

### Android

```bash
eas build --platform android --auto-submit
```

## Testing

```bash
npm test
```

## Troubleshooting

### Port Already in Use
```bash
npx expo start --clear
```

### Cache Issues
```bash
rm -rf node_modules && npm install
```

### Device Connection
```bash
# iOS
npm run ios

# Android
npm run android -- --clear-cache
```

## API Integration

API calls use the FastAPI backend at `https://api.eventrix.com`

Environment variables in `.env`:
```
REACT_APP_API_URL=https://api.eventrix.com
```

## Push Notifications

Configure push notification channels:
1. Set up Firebase Cloud Messaging
2. Add credentials to EAS
3. Configure notification handlers

## Release Notes

### v1.0.0
- Initial release
- Product browsing and purchase
- Cart management
- Order tracking
- Profile management
