import { type NextRequest, NextResponse } from "next/server"
import { sendToTelegram } from "@/lib/telegram"
import { SurveyResponsesService } from "@/lib/services"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Basic validation
    const name = String(data?.userData?.name || '').trim()
    const phone = String(data?.userData?.phone || '').trim()
    const city = String(data?.userData?.city || '').trim()
    const answers = data?.answers && typeof data.answers === 'object' ? data.answers : {}
    const resolvedAnswers = Array.isArray(data?.resolvedAnswers) ? data.resolvedAnswers : []

    if (!name || !phone) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Persist to DB (mandatory)
    await SurveyResponsesService.create({
      name,
      phone,
      city,
      answers,
      resolved_answers: resolvedAnswers,
      meta: {
        user_agent: request.headers.get('user-agent') || undefined,
        referer: request.headers.get('referer') || undefined,
        submitted_at: new Date().toISOString(),
      }
    } as any)

    // Notify Telegram (non-blocking for DB success)
    const result = await sendToTelegram({
      userData: { name, phone, city },
      answers,
      resolvedAnswers
    })

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send data" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing survey:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
