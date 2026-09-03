import type { Metadata } from "next";
import "@/app/globals.css";
import { DemoProvider } from "@/store/demo-store";
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
        <DemoProvider>
          {children}
          <ToastStack />
        </DemoProvider>
      </body>
    </html>
  );
}
