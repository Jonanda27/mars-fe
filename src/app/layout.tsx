import type { Metadata } from "next";
import { Roboto, Oswald } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from 'react-hot-toast';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MARS",
  description: "Mimika Airport Revenue System",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${oswald.variable} h-full antialiased font-sans`}>
      <body className="bg-[#ecf0f5] text-[#333] m-0 font-sans">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '14px',
              fontWeight: '500',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#00a65a', secondary: '#fff' },
              style: { borderLeft: '4px solid #00a65a' },
            },
            error: {
              iconTheme: { primary: '#dd4b39', secondary: '#fff' },
              style: { borderLeft: '4px solid #dd4b39' },
            },
          }}
        />
      </body>
    </html>
  );
}
