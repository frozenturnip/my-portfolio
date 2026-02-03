"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";


export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Avoid mismatch between server and client
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{children}</>; // Render children without theme until mounted

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

