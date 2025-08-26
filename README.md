# Password Manager

A sleek, secure password manager built with React Native, Expo, and Firebase, featuring a modern purple and black theme with PIN/biometric authentication. Designed for secure password storage and management without complex registration processes.

## Features

### Security Features
- **PIN Authentication** - Simple 4-digit PIN setup for quick access
- **Biometric Authentication** - Fingerprint and face unlock support
- **Password Encryption** - All passwords are encrypted before storage in Firebase
- **Secure Local Storage** - PIN and encryption keys stored securely on device
- **Password Generator** - Generate strong, customizable passwords
- **Password Strength Indicator** - Real-time password strength analysis

### Modern Design
- **Purple & Black Theme** - Elegant purple and black color palette
- **Gradient Backgrounds** - Beautiful gradient effects throughout the app
- **Clean Interface** - Modern, minimalist design for ease of use
- **Dark Mode Ready** - Built with dark backgrounds for comfortable viewing

### User Experience
- **No Registration Required** - Just set up a PIN and start using
- **Single User App** - Designed specifically for one person
- **Organized Categories** - Organize passwords with themed categories:
  - Social Media
  - Email  
  - Shopping
  - Beauty & Style
  - Entertainment
  - Health & Fitness
  - Travel
  - Work
  - Banking
  - Other

### 📱 Management Features
- **Easy Password Creation** - Simple forms with validation
- **Quick Search** - Find passwords instantly
- **Category Filtering** - Filter by beautiful themed categories
- **Copy to Clipboard** - One-tap copying of usernames and passwords
- **Password Details** - Comprehensive view with sharing options

## Perfect For

This app is designed as a personal password manager with:
- Simple PIN-based authentication (no complex registration)
- Modern, professional design with purple and black themes
- Secure storage in Firebase
- Easy-to-use interface
- All the security features needed for safe password management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Firebase project (already configured with your credentials)

### 1. Install Dependencies
```bash
cd PasswordManager
npm install
```

### 2. Firebase Configuration ✅
Your Firebase project is already configured with:
- Project ID: `passwordmanager-akhil`
- Authentication: Disabled (using local PIN auth instead)
- Firestore: Enabled for password storage
- Configuration: Already integrated in the app

### 3. Run the Application
```bash
npm start
```

**Testing Options:**
- **Mobile Device**: Scan QR code with Expo Go app
- **Web Browser**: Press `w` or go to http://localhost:8081  
- **iOS Simulator**: Press `i`
- **Android Emulator**: Press `a`

## Color Palette

```javascript
{
  primary: '#6A0DAD',      // Deep Purple
  secondary: '#9370DB',    // Medium Slate Blue
  accent: '#8A2BE2',       // Blue Violet
  success: '#32CD32',      // Lime Green
  warning: '#FFA500',      // Orange
  error: '#DC143C',        // Crimson
  background: '#1A1A1A',   // Dark Black
  surface: '#2D2D2D',      // Dark Gray
  text: '#FFFFFF',         // White
  textSecondary: '#B19CD9', // Light Purple
  border: '#4B0082',       // Indigo
  placeholder: '#9370DB',  // Medium Slate Blue
  gradient1: '#2E0249',    // Dark Purple gradient start
  gradient2: '#6A0DAD',    // Deep Purple gradient end
  gradient3: '#8A2BE2',    // Blue Violet gradient
}
```

## 📱 How to Use

### First Time Setup
1. **Launch the app** - You'll see a beautiful welcome screen
2. **Set up PIN** - Create a 4-digit PIN for authentication
3. **Start adding passwords** - Tap the + button to add your first password

### Daily Use
1. **Unlock with PIN or Biometric** - Quick access with your PIN or fingerprint
2. **Browse passwords** - See all your passwords in a beautiful list
3. **Search & Filter** - Use search or category filters to find passwords quickly
4. **Add new passwords** - Tap + to add new entries with the password generator
5. **View details** - Tap any password to see full details and copy information

## 🛡️ Security

### How Your Data is Protected
1. **Local PIN Authentication** - No external accounts needed
2. **Device-Specific Encryption** - Passwords encrypted with device-specific keys
3. **Firebase Security** - Data stored securely in Google's Firebase
4. **No Plain Text Storage** - Passwords never stored unencrypted
5. **Biometric Support** - Use fingerprint/face unlock when available

### For Production Use
- All passwords are encrypted before being sent to Firebase
- PIN is stored securely using Expo SecureStore
- Each device has its own encryption key
- Firebase rules ensure data isolation

## 📁 Project Structure

```
PasswordManager/
├── app/                     # App screens (Expo Router)
│   ├── _layout.tsx         # Root layout with AuthProvider
│   ├── index.tsx           # Main entry/routing screen
│   ├── pin-setup.tsx       # PIN setup screen
│   ├── auth.tsx            # Authentication screen  
│   ├── password-list.tsx   # Main password list
│   ├── add-password.tsx    # Add/edit password screen
│   └── password-details.tsx # Password details screen
├── components/             # Reusable UI components
│   ├── Button.tsx          # Custom button with girlish styling
│   ├── InputField.tsx      # Beautiful input fields
│   └── PasswordCard.tsx    # Password card component
├── contexts/               # React contexts
│   └── AuthContext.tsx     # PIN/biometric authentication context
├── services/               # Service layers
│   ├── authService.ts      # PIN and biometric authentication
│   └── passwordService.ts  # Password CRUD with encryption
├── config/                 # Configuration
│   └── firebase.ts         # Firebase setup
├── constants/              # App constants
│   └── index.ts            # Colors, categories, themes
└── utils/                  # Utility functions
    └── helpers.ts          # Password generation, validation
```

## 🎁 Special Features for Your Girlfriend

1. **No Complex Setup** - Just open the app and set a PIN
2. **Beautiful Design** - Every screen designed with love and attention
3. **Heart Emojis** - Lovely touches throughout the interface  
4. **Simple & Secure** - Easy to use but highly secure
5. **Personal Touch** - Made specifically for one special person
6. **Quick Access** - PIN or fingerprint for instant access
7. **Lovely Categories** - Organized with beautiful, feminine themes

## Development Notes

### Key Customizations Made
- **Removed Firebase Auth** - Using local PIN authentication instead
- **Single User Design** - Fixed user ID since it's for one person
- **Purple & Black Theme** - Modern purple and black color palette
- **Simplified UX** - No registration, just PIN setup
- **Dark Interface** - Dark backgrounds with purple accents
- **Clean Design** - Professional, minimalist appearance

### Firebase Database Structure
```javascript
// Collection: passwords (single user: "girlfriend_user")
{
  id: "auto-generated-id",
  title: "Instagram",
  username: "my_username", 
  password: "encrypted-password-string",
  website: "https://instagram.com",
  notes: "My personal account",
  category: "1", // Social Media
  userId: "girlfriend_user", // Fixed user ID
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Made with Care

This password manager was created with attention to detail and security in mind. It combines robust security features with a clean, modern interface for effective password management.

### Why This Design?
- **Personal & Secure** - Made for individual use with strong security
- **Modern & Functional** - Clean design that's also practical
- **Simple & Secure** - Easy to use without compromising security
- **No Barriers** - No registration or complex setup required

## Support

For any questions about the app or if you need help with setup, feel free to reach out!

---

*Secure password management made simple*
