import "../styles/globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "./providers";
import Header from "./components/Header";
import { SpotifyPlayerProvider } from "./components/SpotifyPlayerProvider"; // 🟢 NEW
import SecretCopyrightButton from "./components/SecretCopyrightButton";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alessandro Tasso Portfolio",
  description:
    "Portfolio showcasing engineering, design, and creative projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} font-sans bg-background dark:bg-darkbg text-text dark:text-darktext min-h-screen flex flex-col transition-colors duration-500 ease-in-out`}
      >
        <Providers>
          <SpotifyPlayerProvider>
            <Header />
            <main className="flex-1 px-8 sm:px-12 md:px-24 py-12 space-y-8">
              {children}
            </main>
            <footer className="text-center py-6 text-sm border-t border-sage/20 dark:border-darkprimary/40">
              <p className="font-medium italic text-primary dark:text-darktext">
                Built with Next.js + TailwindCSS — ©{" "}
                {new Date().getFullYear()} Alessandro&nbsp;<SecretCopyrightButton />
              </p>
            </footer>
          </SpotifyPlayerProvider>
        </Providers>
      </body>
    </html>
  );
}
