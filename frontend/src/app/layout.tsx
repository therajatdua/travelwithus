import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header, Footer, AuthModal, ChatBot } from "@/components/organisms";
import { ScrollProgress } from "@/components/atoms";
import "./globals.css";

/*
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
*/

export const metadata: Metadata = {
  title: "TravelWithUs | Global AI Travel Platform",
  description:
    "Discover curated travel packages with immersive destination themes. Mumbai, Rio, Thailand, Italy, Tokyo — your next adventure awaits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: set data-mode BEFORE first paint so dark mode never flashes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem("travelwithus-color-mode")||"system";var r=m;if(m==="system"){r=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-mode",r)}catch(e){document.documentElement.setAttribute("data-mode","light")}})()`,
          }}
        />
      </head>
      <body
        className={`antialiased font-sans flex flex-col min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ScrollProgress />
            <Header />
            {children}
            <Footer />
            <AuthModal />
            <ChatBot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
