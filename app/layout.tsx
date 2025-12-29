import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SettingsProvider } from "@/lib/settings-context"
import { UserProfileProvider } from "@/lib/user-profile"
import { OfflineAlert } from "@/components/OfflineAlert"
import './globals.css'

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: 'Kasa - Shared Expense Tracker',
  description: 'Split expenses and settle debts with friends and family. Track group expenses, manage settlements, and keep everyone in sync.',
  keywords: ['expense tracker', 'split bills', 'group expenses', 'debt settlement', 'shared expenses'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <SettingsProvider>
          <UserProfileProvider>
            <OfflineAlert />
            {children}
            <Analytics />
          </UserProfileProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
