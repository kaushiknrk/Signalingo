import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signalingo — Secure Sign Language Platform",
  description: "Secure Sign Language Learning and Recognition Platform initially focused on ASL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans antialiased relative selection:bg-[#00A896] selection:text-white">
        {/* Subtle Ambient Radial Glow for Premium Signalingo Dark Aesthetic */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#00A896]/10 blur-[130px]" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#FFB703]/5 blur-[140px]" />
          <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-[#00A896]/8 blur-[150px]" />
        </div>
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
      </body>
    </html>
  );
}
