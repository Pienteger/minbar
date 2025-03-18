import type React from "react";
import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });
const notoSansBengali = Noto_Sans_Bengali({ subsets: ["bengali"] });

export const metadata: Metadata = {
  title: "Minbar",
  description: "Connect with friends and share your moments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add emoji-mart styles */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/emoji-mart@5.5.2/css/emoji-mart.css"
        />
      </head>
      <body className={notoSansBengali.className + " " + inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
