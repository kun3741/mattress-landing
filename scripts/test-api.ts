import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { SurveyQuestionsService, SurveyResponsesService, SiteContentService } from '../lib/services'

async function testAPI() {
  console.log('🧪 Testing MongoDB API...')
    try {
    console.log('\n1️⃣ Testing survey questions...')
    const questions = await SurveyQuestionsService.getAll()
    console.log(`✅ Found ${questions.length} questions`)
    
    if (questions.length > 0) {
      console.log(`📝 First question: "${questions[0].question_text}"`)
    }
    
    console.log('\n2️⃣ Testing site content...')
    const heroTitle = await SiteContentService.get('hero_title')
    console.log(`✅ Hero title: "${heroTitle}"`)
    
    console.log('\n3️⃣ Testing survey response creation...')
    const testResponse = await SurveyResponsesService.create({
      name: 'Test User',
      phone: '+380123456789',
      city: 'Київ',
      answers: {
        sleep_position: 'На боці',
        firmness_preference: 'Середньої жорсткості'
      }    })
    console.log(`✅ Created test response with ID: ${testResponse._id}`)
    
    console.log('\n4️⃣ Testing get all responses...')
    const allResponses = await SurveyResponsesService.getAll(5)
    console.log(`✅ Found ${allResponses.length} total responses`)
    
    console.log('\n🎉 All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  testAPI()
    .then(() => {
      console.log('✨ Testing complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Testing failed:', error)
      process.exit(1)
    })
}

export default testAPI
