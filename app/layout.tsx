import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SettingsProvider } from "@/lib/settings-context"
import { UserProfileProvider } from "@/lib/user-profile"
import { GroupsProvider } from "@/lib/groups-context"
import { OfflineAlert } from "@/components/OfflineAlert"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import './globals.css'

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'HesAppcım - Shared Expense Tracker',
  description: 'Split expenses and settle debts with friends and family. Track group expenses, manage settlements, and keep everyone in sync.',
  keywords: ['expense tracker', 'split bills', 'group expenses', 'debt settlement', 'shared expenses'],

  // iOS Safari specific settings
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default', // 'default' uses white background
    title: 'HesAppcım',
  },

  // Prevent automatic phone number detection
  formatDetection: {
    telephone: false,
  },

  // PWA Manifest
  manifest: '/manifest.json',

  // Icons for various platforms
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          <SettingsProvider>
            <UserProfileProvider>
              <GroupsProvider>
                <OfflineAlert />
                {children}
                <Analytics />
              </GroupsProvider>
            </UserProfileProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
