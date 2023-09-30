// layout.js - This is the root layout file for the whole app.
// Any styling included in this file will apply to ALL app components.

import './globals.css'
import { Inter } from 'next/font/google'
import AppProvider from './appProvider'
import { getUsername } from './utilities'

const inter = Inter({ subsets: ['latin'] })

const userName = getUsername();

export const metadata = {
  title: 'Reddit Game Posts',
  description: 'Search for and browse Reddit posts about video games',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* TODO: If user logged in, display u/username. Otherwise, display button with text: "Connect your Reddit Account" */}
        <nav>
          <p>{userName}</p>
          <p>Reddit Game Posts</p>
        </nav>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}