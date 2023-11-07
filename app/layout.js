// layout.js - This is the root layout file for the whole app.
// Any styling included in this file will apply to ALL app components.

import './globals.css';
import { Inter, Cairo } from 'next/font/google';

// The Navbar component's content is conditionally rendered using the React Content 'Providers" component
import Navbar from './components/Navbar';
import Providers from './components/providers';

// Fonts
const inter = Inter({ subsets: ['latin'] });

// Importing Font using NextJS / Tailwind method: https://nextjs.org/docs/app/building-your-application/optimizing/fonts#with-tailwind-css
const cairo = Cairo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cairo'
})

export const metadata = {
  title: 'Reddit Game Posts',
  description: 'Search for and browse Reddit posts about video games',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`bg-gray-700 ${cairo.variable}`}>
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