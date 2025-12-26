# Kasa - Shared Expense Tracker

Split expenses and settle debts with friends and family. Track group expenses, manage settlements, and keep everyone in sync.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.4-orange?style=flat-square&logo=firebase)

## ✨ Features

- 🔐 **Authentication** - Email/password and Google sign-in
- 👥 **Group Management** - Create groups and invite members via code
- 💰 **Expense Tracking** - Add expenses and split between members
- 📊 **Balance Dashboard** - See who owes what at a glance
- 🌓 **Dark Mode** - System, light, or dark theme
- 🌍 **Multi-language** - English and Turkish support
- 💱 **Multi-currency** - TRY, USD, EUR, GBP
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project ([Create one here](https://console.firebase.google.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kasa.git
   cd kasa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google**

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **production mode**
4. Choose a location

### 4. Set up Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Groups collection
    match /groups/{groupId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.memberIds;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.memberIds;
      
      // Group feed subcollection
      match /feed/{feedId} {
        allow read: if request.auth != null && 
                       request.auth.uid in get(/databases/$(database)/documents/groups/$(groupId)).data.memberIds;
        allow create: if request.auth != null;
      }
    }
    
    // Group invites
    match /groupInvites/{inviteCode} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

### 5. Get your Firebase config

1. Go to **Project settings** → **General**
2. Scroll to "Your apps" → **Web app**
3. Copy the config values to your `.env.local`

## 📁 Project Structure

```
kasa/
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard page
│   ├── login/               # Login page
│   ├── register/            # Register page
│   ├── groups/              # Groups pages
│   │   ├── page.tsx         # Groups list
│   │   └── [id]/            # Group detail
│   └── profile/             # Profile pages
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── BottomNav.tsx        # Bottom navigation
│   ├── ErrorBoundary.tsx    # Error boundary
│   ├── CreateGroupDialog.tsx
│   └── JoinGroupDialog.tsx
├── lib/                     # Libraries and utilities
│   ├── firebase.ts          # Firebase config
│   ├── settings-context.tsx # Settings provider
│   ├── user-profile.tsx     # User profile provider
│   ├── types/
│   │   └── firestore.ts     # Firestore type definitions
│   └── utils/
│       ├── time-utils.ts    # Time formatting
│       ├── invite-utils.ts  # Invite code utilities
│       └── logger.ts        # Logging utility
├── hooks/                   # Custom React hooks
└── public/                  # Static files
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Backend**: [Firebase](https://firebase.google.com/)
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎨 Customization

### Theme

The app supports light, dark, and system themes. Users can change their preference in Settings.

### Currency

Supported currencies:
- 🇹🇷 Turkish Lira (TRY)
- 🇺🇸 US Dollar (USD)
- 🇪🇺 Euro (EUR)
- 🇬🇧 British Pound (GBP)

### Language

- 🇬🇧 English
- 🇹🇷 Türkçe

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- TypeScript build errors may appear due to strict type checking (recently enabled)
- Environment variables are required - app won't start without proper `.env.local`

## 🔮 Roadmap

- [ ] Add expense categories
- [ ] Receipt image uploads
- [ ] Export to CSV/PDF
- [ ] Push notifications
- [ ] Offline support (PWA)
- [ ] Email verification
- [ ] Password reset
- [ ] Recurring expenses
- [ ] Expense comments
- [ ] Activity filtering

## 💬 Support

If you have any questions or issues, please:
- Open an issue on GitHub
- Contact the maintainers

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [v0.dev](https://v0.dev/) for design inspiration
- All contributors who have helped improve this project

---

Made with ❤️ by the Kasa team
