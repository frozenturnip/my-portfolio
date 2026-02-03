import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Named export — required by Next.js
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect the secret content route
  if (pathname.startsWith("/secret-content")) {
    const auth = req.cookies.get("secret_auth")?.value;

    // If not logged in, redirect to /secret login
    if (auth !== "1") {
      const url = new URL("/secret", req.url);
      return NextResponse.redirect(url);
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

// ✅ Only run middleware on specific paths
export const config = {
  matcher: ["/secret-content/:path*"],
};
