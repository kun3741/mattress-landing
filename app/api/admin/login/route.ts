import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const validUser = process.env.ADMIN_USER || "admin"
    const validPass = process.env.ADMIN_PASS || "admin123"

    if (username === validUser && password === validPass) {
      const res = NextResponse.json({ success: true })
      // Set httpOnly cookie for simple auth
      res.cookies.set("admin_token", "ok", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8, // 8h
      })
      return res
    }

    return NextResponse.json({ error: "Невірні дані" }, { status: 401 })
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
