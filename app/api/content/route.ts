import { type NextRequest, NextResponse } from "next/server"
import { SiteContentService } from "@/lib/services"
import { defaultContent } from "@/lib/content-data"

export async function GET() {
  try {
    const allContent = await SiteContentService.getAll()

    const content: any = { ...defaultContent }
    allContent.forEach((item) => {
      content[item.key] = item.value
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error("[v0] Error fetching content:", error)
    return NextResponse.json(defaultContent)
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const contentData = await request.json()

    for (const [key, value] of Object.entries(contentData)) {
      await SiteContentService.set(key, value)
    }

    return NextResponse.json({ success: true, content: contentData })
  } catch (error) {
    console.error("[v0] Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
