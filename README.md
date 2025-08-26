
# My Password Manager

Hi! I'm excited to share my personal password manager app, built with React Native, Expo, and Firebase. I designed it with a modern purple and black theme, and focused on making it both beautiful and secure. This app is for anyone who wants a simple, secure way to manage passwords—no complicated registration, just set a PIN and go.


## Features I Built

### Security
- **PIN Authentication** – Set up a 4-digit PIN for quick, secure access
- **Biometric Authentication** – Unlock with your fingerprint or face
- **Password Encryption** – Every password is encrypted before it ever leaves your device
- **Secure Local Storage** – PIN and keys are stored safely on your phone
- **Password Generator** – Create strong, unique passwords
- **Password Strength Indicator** – See how strong your password is as you type

### Modern Design
- **Purple & Black Theme** – My favorite color combo for a sleek look
- **Gradient Backgrounds** – Subtle gradients throughout
- **Minimalist UI** – Clean, easy-to-use interface
- **Dark Mode** – Always easy on the eyes

### User Experience
- **No Registration** – Just set a PIN and start using it
- **Single User** – Made for one person (you!)
- **Organized Categories** – Passwords are grouped by category (Social, Email, Shopping, etc.)

### Management
- **Easy Password Creation** – Simple forms, instant validation
- **Quick Search** – Find any password in seconds
- **Category Filtering** – Filter by category with a tap
- **Copy to Clipboard** – Instantly copy usernames or passwords
- **Password Details** – See all info, share, or edit easily

## Screenshots

Here are some screenshots of my app in action:

<p align="center">
  <img src="assets/ScreenShots/Screenshot_20250825_224437_Expo%20Go.jpg" alt="Home Screen" width="250" />
  <img src="assets/ScreenShots/Screenshot_20250825_224453_Expo%20Go.jpg" alt="PIN Setup" width="250" />
  <img src="assets/ScreenShots/Screenshot_20250825_224458_Expo%20Go.jpg" alt="Password List" width="250" />
  <img src="assets/ScreenShots/Screenshot_20250825_224504_Expo%20Go.jpg" alt="Add Password" width="250" />
  <img src="assets/ScreenShots/Screenshot_20250825_224510_Expo%20Go.jpg" alt="Password Details" width="250" />
  <img src="assets/ScreenShots/Screenshot_20250825_224514_Expo%20Go.jpg" alt="Category Filter" width="250" />
  <img src="assets/ScreenShots/Screenshot_20250825_224519_Expo%20Go.jpg" alt="Settings" width="250" />
</p>

---

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Firebase project (already configured with your credentials)


### 1. Install Dependencies
```bash
cd Password-Manager-React-Native
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

## 📱 How I Use It

### First Time Setup
1. **Launch the app** – Enjoy the welcome screen I designed
2. **Set up your PIN** – Just pick a 4-digit PIN
3. **Add your first password** – Tap the + button and fill in the details

### Daily Use
1. **Unlock with PIN or Biometric** – Fast, secure access every time
2. **Browse passwords** – All your passwords in a beautiful, scrollable list
3. **Search & Filter** – Quickly find what you need
4. **Add new passwords** – Use the + button and the built-in password generator
5. **View details** – Tap any password to see, copy, or share it

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