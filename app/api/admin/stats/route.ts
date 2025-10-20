import { NextResponse } from "next/server"
import { SiteContentService, SurveyQuestionsService, SurveyResponsesService } from "@/lib/services"

export async function GET() {
  try {
    const [contentCount, questionsCount, responsesCount] = await Promise.all([
      SiteContentService.getAll().then(items => items.length),
      SurveyQuestionsService.getAll().then(questions => questions.length),
      SurveyResponsesService.getAll().then(responses => responses.length)
    ])

    return NextResponse.json({
      content_items: contentCount,
      survey_questions: questionsCount,
      survey_responses: responsesCount,
      last_updated: new Date().toISOString()
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
