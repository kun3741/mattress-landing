import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getDatabase } from '../lib/mongodb'
import { SurveyQuestion, SiteContent } from '../lib/models'
import { surveyQuestions } from '../lib/survey-data'
import { defaultContent } from '../lib/content-data'

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing MongoDB database...')
    const db = await getDatabase()
    
    console.log('📋 Creating indexes...')
    await db.collection('survey_questions').createIndex({ question_id: 1 }, { unique: true })
    await db.collection('survey_questions').createIndex({ order_index: 1 })
    await db.collection('survey_responses').createIndex({ created_at: -1 })
    await db.collection('site_content').createIndex({ key: 1 }, { unique: true })
    
    const initialQuestions: Omit<SurveyQuestion, '_id' | 'created_at' | 'updated_at'>[] = surveyQuestions.map((q, index) => ({
      question_id: q.id,
      question_text: q.question,
      question_type: q.type === 'radio' ? 'single' : q.type === 'select' ? 'single' : q.type,
      options: q.options || [],
      next_question_logic: {},
      order_index: index + 1
    }))
    
    console.log('❓ Setting up survey questions...')
    await db.collection('survey_questions').deleteMany({})
    
    const questionsWithTimestamp = initialQuestions.map(q => ({
      ...q,
      created_at: new Date(),
      updated_at: new Date()
    }))
      await db.collection('survey_questions').insertMany(questionsWithTimestamp)
    
    // Initial site content from content-data.ts
    const initialContent: Omit<SiteContent, '_id' | 'updated_at'>[] = [
      {
        key: 'hero',
        value: defaultContent.hero
      },
      {
        key: 'video',
        value: defaultContent.video
      },
      {
        key: 'benefits',
        value: defaultContent.benefits
      },
      {
        key: 'benefitsSection',
        value: defaultContent.benefitsSection
      },
      {
        key: 'partners',
        value: defaultContent.partners
      },
      {
        key: 'cta',
        value: defaultContent.cta
      },
      {
        key: 'contacts',
        value: defaultContent.contacts
      },
      {
        key: 'factories',
        value: defaultContent.factories
      },
      {
        key: 'navigation',
        value: defaultContent.navigation
      },
      {
        key: 'footer',
        value: defaultContent.footer
      },
      {
        key: 'infoDialogs',
        value: defaultContent.infoDialogs
      },
      {
        key: 'seo',
        value: defaultContent.seo
      }
    ]
    
    console.log('📄 Setting up site content...')
    await db.collection('site_content').deleteMany({})
    
    const contentWithTimestamp = initialContent.map(c => ({
      ...c,
      updated_at: new Date()
    }))
    
    await db.collection('site_content').insertMany(contentWithTimestamp)
    
    console.log('✅ Database initialized successfully!')
    console.log(`📊 Created ${initialQuestions.length} survey questions`)
    console.log(`📝 Created ${initialContent.length} content items`)
    
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Initialization complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error)
      process.exit(1)
    })
}

export default initializeDatabase
