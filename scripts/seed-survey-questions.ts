import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getDatabase } from '../lib/mongodb'
import { surveyQuestions } from '../lib/survey-data'

async function seedSurveyQuestions() {
  const db = await getDatabase()

  // Transform app questions to DB schema
  const docs = surveyQuestions.map((q, index) => ({
    question_id: q.id,
    question_text: q.question,
    question_type: q.type === 'radio' ? 'single' : q.type === 'select' ? 'single' : q.type,
    options: q.options || [],
    next_question_logic: {},
    order_index: index + 1,
    required: q.required !== false,
    created_at: new Date(),
    updated_at: new Date(),
  }))

  await db.collection('survey_questions').deleteMany({})
  await db.collection('survey_questions').insertMany(docs)

  console.log(`✅ Seeded ${docs.length} survey questions`)
}

if (require.main === module) {
  seedSurveyQuestions().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
}

export default seedSurveyQuestions
