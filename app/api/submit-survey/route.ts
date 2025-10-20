import { type NextRequest, NextResponse } from "next/server"
import { sendToTelegram } from "@/lib/telegram"
import { SurveyResponsesService } from "@/lib/services"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    try {
      await SurveyResponsesService.create({
        name: data.userData.name,
        phone: data.userData.phone,
        city: data.userData.city,
        answers: data.answers,
      })
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
    }

    const result = await sendToTelegram(data)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send data" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing survey:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
