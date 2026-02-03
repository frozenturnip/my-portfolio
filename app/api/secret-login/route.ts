// app/api/secret-login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const ok = password === process.env.SECRET_PASS; // set in .env.local
  if (!ok) return new NextResponse("Unauthorized", { status: 401 });

  const res = new NextResponse("ok", { status: 200 });
  res.cookies.set({
    name: "secret_auth",
    value: "1",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
