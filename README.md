# 💰 Shared Expense Tracker

A modern, real-time expense sharing application built with Next.js and Firebase. Track shared expenses with friends, family, or roommates effortlessly.

---

## ✨ Features

### Core Functionality
- **Group Management** - Create and manage expense groups
- **Real-time Sync** - Instant updates across all devices
- **Smart Settlements** - Automatically calculates who owes whom
- **Expense Tracking** - Add, edit, and categorize expenses
- **Payment Records** - Track settlements and payment history
- **Mobile-First Design** - Fully responsive, works on any device

### User Experience
- **Multi-language Support** - Turkish and English
- **Dark Mode** - System-aware theme switching
- **Offline Detection** - Visual feedback for connectivity status
- **Progressive Web App** - Install on mobile devices

### Authentication & Security
- **Email/Password** - Secure authentication
- **Google Sign-In** - Quick OAuth login
- **Email Verification** - Account security
- **Phone Verification** - Optional SMS verification (reCAPTCHA)

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide Icons](https://lucide.dev/) - Icon system

**Backend & Services:**
- [Firebase Authentication](https://firebase.google.com/products/auth) - User management
- [Cloud Firestore](https://firebase.google.com/products/firestore) - NoSQL database
- [Cloudinary](https://cloudinary.com/) - Image hosting (avatars)

**Development:**
- Turbopack - Fast bundler
- ESLint - Code linting
- Hot Module Replacement - Instant feedback

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- (Optional) Cloudinary account for profile pictures

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Optional: Cloudinary (for profile pictures)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── groups/            # Group management & details
│   ├── profile/           # User profile & settings
│   ├── settings/          # App settings
│   ├── login/             # Authentication pages
│   └── register/
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Custom components
├── lib/                   # Utilities & configuration
│   ├── firebase.ts       # Firebase initialization
│   ├── settings-context.tsx  # i18n & app settings
│   └── groupService.ts   # Business logic
└── public/               # Static assets
```

---

## 🎨 Key Features Breakdown

### Group Expense Management
- Create groups with invite codes
- Archive/unarchive groups
- View group balance and debts
- Simplified debt visualization

### Expense Operations
- Add expenses with custom splits
- Edit expense details (title, category)
- Mark payments as settled
- Real-time balance updates

### User Profile
- Update display name and avatar
- Email verification
- Phone verification (SMS)
- Password management
- Multi-currency support (TRY, USD, EUR, GBP)

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🌍 Internationalization

The app supports multiple languages through a custom context provider:
- **Turkish** (tr-TR)
- **English** (en-US)

Add new translations in `lib/settings-context.tsx`

---

## 🔐 Firebase Security Rules

Ensure your Firestore has proper security rules:
- Users can only access groups they're members of
- Only group owners can delete groups
- Expenses are protected by group membership

---

## 🐛 Known Issues & Limitations

- Phone verification UI is disabled (marked as "Coming Soon")
- Email verification is recommended for account security
- Profile pictures require Cloudinary configuration

---

## 📝 License

This project is private and not licensed for public use.

---

## 🤝 Contributing

This is a private project. Contributions are not currently accepted.

---

**Built with ❤️ using modern web technologies**
