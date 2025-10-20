import { type NextRequest, NextResponse } from "next/server"
import { SiteContentService } from "@/lib/services"

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { key, value } = await request.json()

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 })
    }

    await SiteContentService.set(key, value)

    return NextResponse.json({ success: true, key, value })
  } catch (error) {
    console.error("[v0] Error updating content field:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
