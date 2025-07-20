import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "./Components/Analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wandering Inndle",
  description: "Guess the character from the hit web serial The Wandering Inn! Try to guess the \
  daily character and play the infinite mode.",
  openGraph: {
    title: "Wandering Inndle",
    description: "Guess the character from the hit web serial The Wandering Inn! Try to guess the \
    daily character and play the infinite mode.",
    url: 'https://inndle.github.io/WanderingInndle/',
    siteName: 'Wandering Inndle',
    images: [
      {
        url: 'https://static.wixstatic.com/media/94aeec_7f348c6465ca474aa9503b3640e76faf~mv2.jpg/v1/fill/w_1290,h_885,al_c,q_90/file.jpg', // Must be an absolute URL
        width: 1290,
        height: 885,
      }
    ],
    locale: 'en_US',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
