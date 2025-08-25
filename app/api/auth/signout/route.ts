import { NextResponse } from "next/server";

export async function GET() {
  const isProd = process.env.NODE_ENV === "production";
  const redirectUrl = isProd
    ? "https://manekineko.netlify.app/"
    : "http://localhost:3000/";

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: "__Secure-authjs.session-token",
    value: "",
    path: "/",
    httpOnly: true,
    secure: isProd,
    maxAge: 0,
    sameSite: "lax",
  });

  response.cookies.set({
    name: "__Secure-authjs.callback-url",
    value: "",
    path: "/",
    secure: isProd,
    maxAge: 0,
    sameSite: "lax",
  });

  response.cookies.set({
    name: "__Host-authjs.csrf-token",
    value: "",
    path: "/",
    httpOnly: true,
    secure: isProd,
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}
