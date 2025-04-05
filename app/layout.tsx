import type React from "react";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { StoreProvider } from "@/app/providers/store";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Store Planner",
  description: "Plan your store layout in 3D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
