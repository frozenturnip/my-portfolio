// app/secret/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export default function SecretLogin() {

  // Use a local dark mode wrapper to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTimeout, setFormTimeout] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/secret-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push("/secret-content");
    } else {
      setErr("Incorrect password.");
    }
  }

  if (!mounted) return null;
  return (
    <div className="dark min-h-screen w-full">
      {createPortal(
        <div style={{ position: "fixed", top: "45px", left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
            {/* Background effect removed per request */}
        </div>,
        document.body
      )}
      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center justify-center min-h-screen px-6">
        <div
          className="fixed bottom-8 left-8 w-32 h-32 cursor-pointer z-20"
          onMouseEnter={() => {
            setShowForm(true);
            if (formTimeout) clearTimeout(formTimeout);
            const timeout = setTimeout(() => setShowForm(false), 15000);
            setFormTimeout(timeout);
          }}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Optionally, add a visual hint here or leave it invisible */}
        </div>
        <div
          className={`relative flex flex-col items-center justify-center w-full transition-opacity duration-700 ${showForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full">
            <h1 className="text-2xl font-bold mb-4 text-charcoal dark:text-white text-center">Enter Password</h1>
            <form onSubmit={onSubmit} className="space-y-4 w-full">
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-black/50 text-charcoal dark:text-white"
              />
              {err && <p className="text-red-600 text-sm text-center">{err}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
