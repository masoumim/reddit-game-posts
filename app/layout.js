// layout.js - This is the root layout file for the whole app.
// Any styling included in this file will apply to ALL app components.

import './globals.css';
import { Inter } from 'next/font/google';

import Navbar from './components/Navbar';
import Providers from './components/providers';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Reddit Game Posts',
  description: 'Search for and browse Reddit posts about video games',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <nav>
            <Navbar />
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  )
}