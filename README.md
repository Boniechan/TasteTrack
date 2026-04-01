# TasteTrack - Food Ordering & Payment Management System

A comprehensive Ionic Angular food delivery application with real-time order tracking, secure payment processing, and intuitive user interface.

## Version
**2.4.0**

## Features Implemented

### 1. **18 Complete Pages**
- ✅ **Splash Screen** - Animated TasteTrack logo with Poppins font
- ✅ **Onboarding** (3 Slides) - Feature showcase with smooth transitions
- ✅ **Login** - Email/password authentication with social login options (Google, Apple, Facebook)
- ✅ **Register** - User registration with real-time password strength meter
- ✅ **Home** - Main dashboard with food recommendations and categories
- ✅ **Menu/Browse** - Restaurant and food item browsing
- ✅ **Food Detail** - Detailed food information with reviews and ratings
- ✅ **Cart** - Add/remove items with quantity management
- ✅ **Checkout** - Address selection, delivery scheduling, promo code application
- ✅ **Payment** - Multiple payment methods (Card, Digital Wallet, Cash on Delivery)
- ✅ **Live Order Tracking** - Real-time animation with delivery pin and ETA countdown
- ✅ **Order History** - View past and active orders with reorder functionality
- ✅ **Profile** - User profile with stats, contact info, and preferences
- ✅ **Notifications** - Push notification center with alerts and updates
- ✅ **Favorites** - Save and manage favorite food items
- ✅ **Search** - Advanced search with voice search simulation
- ✅ **Settings** - Dark mode toggle, notification preferences, account settings
- ✅ **About Us** - App information, social links, terms & conditions

### 2. **Custom Branding & Design**
- **Orange Gradient Theme** - Primary color #FF6B35 with Poppins typography
- **Animated Splash Screen** - Bouncing logo animation with Poppins font
- **Warm Color Palette** - Orange (#FF6B35), Secondary (#F7931E), Accent (#4D96FF)
- **Modern UI Components** - Rounded cards, smooth shadows, gradient backgrounds
- **Responsive Design** - Optimized for all device sizes

### 3. **Full Cart & Payment Flow**
- **Add to Cart** - With quantity selection
- **Quantity Management** - Increment/decrement controls
- **Promo Codes** - Apply discount codes with validation
- **Checkout with Address Selection** - Save multiple delivery addresses
- **Delivery Scheduling** - ASAP or future delivery options
- **Secure Payment** - Card details form with formatting
- **Multiple Payment Methods**:
  - Credit/Debit Card with encryption badge
  - Digital Wallet (Apple Pay, Google Pay, PayPal)
  - Cash on Delivery
- **Order Confirmation** - Success animation and notification
- **Bill Summary** - Itemized breakdown with tax and delivery fees

### 4. **Interactive Features**

#### Live Order Tracking
- Animated delivery pin sliding across map
- Timeline status (Confirmed → Preparing → On the Way → Delivered)
- Real-time ETA countdown with minute precision
- Delivery agent info with rating and contact
- Distance and time estimates

#### Form Validation
- Email validation with regex patterns
- Password strength meter (Weak → Very Strong)
- Real-time validation feedback
- Required field checks
- Password confirmation matching

#### Voice Search Simulation
- Voice search button with listening animation
- Three-dot pulsing animation
- Search suggestions and history

#### Dark Mode Toggle
- Settings-based dark mode preference
- Persistent storage with localStorage
- System preference detection
- Full app theming support

#### Editable User Profile
- User avatar and membership level
- Order, review, and TastePoints statistics
- Editable profile information
- Address management
- Settings navigation

### 5. **Advanced Services**
- **Cart Service** - State management with RxJS
- **User Service** - Authentication and profile management
- **Order Service** - Order creation and status tracking
- **Favorites Service** - Bookmark management
- **Data Service** - Mock restaurant and food data

### 6. **Animations & Transitions**
- Page slide animations
- Bouncing logo on splash
- Pulsing ETA timer
- Sliding delivery pin animation
- Fade/slide transitions between routes
- Success payment animation

### 7. **Theme System**
- **CSS Variables** - Centralized color and style management
- **Dark Mode Support** - System-wide dark theme
- **Typography** - Poppins font family throughout
- **Spacing & Border Radius** - Consistent design system
- **Shadows & Depth** - Modern material design shadows

### 8. **Security Features**
- Password encryption indicators
- Secure payment badge
- 256-bit encryption messaging
- Form validation on all inputs
- Promo code validation

## Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── splash/
│   │   ├── onboarding/
│   │   ├── login/
│   │   ├── register/
│   │   ├── home/
│   │   ├── menu/
│   │   ├── food-detail/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── payment/
│   │   ├── order-tracking/
│   │   ├── order-history/
│   │   ├── profile/
│   │   ├── notifications/
│   │   ├── favorites/
│   │   ├── search/
│   │   ├── settings/
│   │   └── about-us/
│   ├── services/
│   │   ├── cart.service.ts
│   │   ├── user.service.ts
│   │   ├── order.service.ts
│   │   ├── favorites.service.ts
│   │   └── data.service.ts
│   ├── app.routes.ts
│   └── app.component.ts
├── theme/
│   └── variables.scss (Ionic color system)
├── global.scss (Global styles & theme)
└── main.ts
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Orange | #FF6B35 | Buttons, headers, highlights |
| Secondary Orange | #F7931E | Accents, secondary actions |
| Accent Blue | #4D96FF | Links, info elements |
| Success Green | #2ED573 | Delivered status, checkmarks |
| Warning | #FFA502 | Pending, alerts |
| Danger Red | #FF6B6B | Errors, cancellations |

## Installation

```bash
# Install dependencies
npm install

# Run development server
ionic serve

# Build for production
ionic build --prod

# Build native app
ionic cap build ios
ionic cap build android
```

## Key Technologies

- **Framework**: Ionic Angular (Standalone Components)
- **State Management**: RxJS BehaviorSubject
- **Styling**: SCSS with CSS Variables
- **Routing**: Angular Router with lazy loading
- **Storage**: LocalStorage for persistence
- **Icons**: Ionicons

## Responsive Design

- Mobile-first approach
- Optimized for 320px - 768px (mobile)
- Tablet support up to 1024px
- Desktop-friendly layouts

## Performance Optimizations

- Lazy-loaded routes
- Standalone components
- OnPush change detection ready
- Image optimization
- Minimal bundle size

## Future Enhancements

- Real backend API integration
- Actual location services
- Push notifications
- Social sharing
- Review ratings
- Loyalty programs
- Multi-language support
- Payment gateway integration

## License

Proprietary - TasteTrack 2024

## Support
Marvin
