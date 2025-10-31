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
        // persist new otherInput configuration
        other_input: q.otherInput ? {
          enabled: !!q.otherInput.enabled,
          label: q.otherInput.label || 'інше (впишіть)',
          placeholder: q.otherInput.placeholder || 'Впишіть свій варіант',
          required: q.otherInput.required !== false,
        } : undefined,
        created_at: new Date(),
        updated_at: new Date()
      }))

      if (initialQuestions.length > 0) {
        await db.collection("survey_questions").insertMany(initialQuestions)
        questions = await SurveyQuestionsService.getAll()
      }
    }

    const formattedQuestions = questions.map((q: any) => ({
      id: q.question_id,
      question: q.question_text,
      type: q.question_type === 'single' ? 'radio' : q.question_type,
      options: q.options || [],
      required: q.required !== false,
      showIfQuestionId: q.show_if_logic?.question_id || '',
      showIfValue: q.show_if_logic?.answer_value || '',
      // expose for admin/editor
      otherInput: q.other_input ? {
        enabled: !!q.other_input.enabled,
        label: q.other_input.label || 'інше (впишіть)',
        placeholder: q.other_input.placeholder || 'Впишіть свій варіант',
        required: q.other_input.required !== false,
      } : undefined,
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
        otherInput: q.otherInput,
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

    // Normalize and validate
    const seenIds = new Set<string>()
    const normalized = questions
      .map((q: any, index: number) => {
        const id = String(q.id || '').trim()
        const question = String(q.question || '').trim()
        if (!id || !question) return null
        if (seenIds.has(id)) return null
        seenIds.add(id)

        const rawType = String(q.type || 'text').trim()
        const type = ['radio','select','text','number'].includes(rawType) ? rawType : 'text'
        let options: string[] | null = null
        if (type === 'radio' || type === 'select') {
          const source = Array.isArray(q.options) ? q.options : []
          options = source.map((s: any) => String(s)).map((s: string) => s.trim()).filter(Boolean)
        }

        let showIf = null as null | { question_id: string; answer_value: string }
        const s = (q.showIf || { }) as any
        if (s && typeof s === 'object' && s.questionId && s.value !== undefined) {
          showIf = { question_id: String(s.questionId).trim(), answer_value: String(s.value).trim() }
        } else if (q.showIfQuestionId && q.showIfValue) {
          showIf = { question_id: String(q.showIfQuestionId).trim(), answer_value: String(q.showIfValue).trim() }
        }

        // normalize otherInput config
        let other_input: any = undefined
        if (q.otherInput && typeof q.otherInput === 'object') {
          other_input = {
            enabled: !!q.otherInput.enabled,
            label: String(q.otherInput.label || 'інше (впишіть)'),
            placeholder: String(q.otherInput.placeholder || 'Впишіть свій варіант'),
            required: q.otherInput.required !== false,
          }
        }

        return {
          question_id: id,
          question_text: question,
          question_type: type,
          options,
          required: q.required !== false,
          show_if_logic: showIf,
          other_input,
          next_question_logic: {},
          order_index: index + 1,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      .filter(Boolean) as any[]

    if (normalized.length === 0) {
      return NextResponse.json({ error: "No valid questions to save" }, { status: 400 })
    }

    const db = await import("@/lib/mongodb").then(m => m.getDatabase())
    await db.collection("survey_questions").deleteMany({})
    await db.collection("survey_questions").insertMany(normalized)

    return NextResponse.json({ success: true, questions })
  } catch (error) {
    console.error("[v0] Error updating questions:", error)
    return NextResponse.json({ error: "Failed to update questions" }, { status: 500 })
  }
}
