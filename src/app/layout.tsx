import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akinator Clone",
  description: "Угадай персонажа с помощью ИИ | Guess the character with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-purple-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Akinator Clone
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-purple-200">
                Главная | Home
              </Link>
              <Link href="/about" className="hover:text-purple-200">
                О игре | About
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
