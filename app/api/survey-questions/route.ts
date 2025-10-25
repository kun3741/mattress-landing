import { type NextRequest, NextResponse } from "next/server"
import { SurveyQuestionsService } from "@/lib/services"
import { getDatabase } from "@/lib/mongodb"
import { surveyQuestions as defaultQuestions } from "@/lib/survey-data"

export async function GET() {
  try {
    let questions = await SurveyQuestionsService.getAll()

    // Seed questions if the collection is empty
    if (!questions || questions.length === 0) {
      const db = await getDatabase()
      const initialQuestions = defaultQuestions.map((q, index) => ({
        question_id: q.id,
        question_text: q.question,
        question_type: q.type === 'radio' ? 'single' : q.type === 'select' ? 'single' : q.type,
        options: q.options || [],
        next_question_logic: {},
        order_index: index + 1,
        required: q.required !== false,
        created_at: new Date(),
        updated_at: new Date()
      }))

      if (initialQuestions.length > 0) {
        await db.collection("survey_questions").insertMany(initialQuestions)
        questions = await SurveyQuestionsService.getAll()
      }
    }

    const formattedQuestions = questions.map((q) => ({
      id: q.question_id,
      question: q.question_text,
      type: q.question_type === 'single' ? 'radio' : q.question_type,
      options: q.options || [],
      required: q.required !== false,
    }))

    return NextResponse.json(formattedQuestions)
  } catch (error) {
    console.error("[v0] Error fetching questions:", error)

    // Fallback: return in-memory default questions so UI keeps working
    try {
      const fallback = defaultQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options || [],
        required: q.required !== false,
      }))
      return NextResponse.json(fallback)
    } catch {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

export async function POST(request: NextRequest) {
  // Require admin auth cookie
  const token = request.cookies.get("admin_token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { questions } = await request.json()

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid questions data" }, { status: 400 })
    }

    const db = await import("@/lib/mongodb").then(m => m.getDatabase())
    await db.collection("survey_questions").deleteMany({})

    const dbQuestions = questions.map((q: any, index: number) => ({
      question_id: q.id,
      question_text: q.question,
      question_type: q.type,
      options: q.options || null,
      required: q.required !== false,
      next_question_logic: {},
      order_index: index + 1,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await db.collection("survey_questions").insertMany(dbQuestions)

    return NextResponse.json({ success: true, questions })
  } catch (error) {
    console.error("[v0] Error updating questions:", error)
    return NextResponse.json({ error: "Failed to update questions" }, { status: 500 })
  }
}
