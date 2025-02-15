import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidePanel } from "./components/SidePanel.jsx";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vendor Management System",
  description: "Created by: Vipin Kumar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased` }
      >
        <SidebarProvider>
          <SidePanel />
            <SidebarTrigger />
            <main className="flex-1 min-w-0 p-4">
            {children}
            <Toaster />
            </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
