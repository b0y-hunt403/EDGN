/*
 * MOCK AUTHENTICATION — DEMO ONLY
 * This frontend authentication layer is designed for presentation and UI testing.
 * Production implementation must replace mock authentication with the real EDGN
 * authentication and identity infrastructure.
 */

import type { Metadata } from "next";
import "@/app/globals.css";
import { DemoProvider } from "@/store/demo-store";
import { AuthProvider } from "@/store/auth-store";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ToastStack } from "@/components/shared/toast-stack";

export const metadata: Metadata = {
  title: {
    default: "EDGN · Digital Guarantee Network",
    template: "%s · EDGN",
  },
  description:
    "Presentation demonstration of the Ethiopian Digital Guarantee Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DemoProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
            <ToastStack />
          </DemoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
