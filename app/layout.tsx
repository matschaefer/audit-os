import { ClerkProvider } from "@clerk/nextjs";
import { deDE } from "@clerk/localizations";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CLERK_CONFIGURED } from "@/lib/app-env";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Synkro Audit OS",
  description:
    "Interner Synkro-Arbeitsbereich für Automatisierungs-Audits, ROI-Bewertung und kundenfähige Berichtsvorschauen für Immobilienagenturen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const app = (
    <html lang="de" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );

  // Only mount ClerkProvider when real keys are configured, so the app
  // still builds and runs locally without committed secrets.
  return CLERK_CONFIGURED ? (
    <ClerkProvider localization={deDE}>{app}</ClerkProvider>
  ) : (
    app
  );
}
