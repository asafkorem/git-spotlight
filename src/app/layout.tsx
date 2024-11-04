import type { Metadata } from "next";
import localFont from "next/font/local";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const GA_MEASUREMENT_ID = 'G-NFEVN0VVSF';

export const metadata: Metadata = {
  title: "Git Spotlight",
  description: "Illuminating your code's pain points through git history",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
      {children}
      </body>
      </html>
  );
}
