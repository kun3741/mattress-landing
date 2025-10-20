// Скрипт для перевірки синхронізації питань між файлом та базою даних
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { SurveyQuestionsService } from '../lib/services'
import { surveyQuestions } from '../lib/survey-data'

async function checkSynchronization() {
  console.log('🔄 Checking synchronization between survey-data.ts and MongoDB...')
  
  try {
    // Get questions from database
    const dbQuestions = await SurveyQuestionsService.getAll()
    
    // Get questions from file
    const fileQuestions = surveyQuestions
    
    console.log(`\n📊 Comparison results:`)
    console.log(`   File questions: ${fileQuestions.length}`)
    console.log(`   Database questions: ${dbQuestions.length}`)
    
    if (fileQuestions.length !== dbQuestions.length) {
      console.log(`⚠️  Different number of questions!`)
    } else {
      console.log(`✅ Same number of questions`)
    }
    
    console.log(`\n📋 File questions:`)
    fileQuestions.forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.id}: "${q.question}" (${q.type})`)
    })
    
    console.log(`\n💾 Database questions:`)
    dbQuestions.forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.question_id}: "${q.question_text}" (${q.question_type})`)
    })
    
    // Check for mismatches
    console.log(`\n🔍 Detailed comparison:`)
    const maxLength = Math.max(fileQuestions.length, dbQuestions.length)
    
    for (let i = 0; i < maxLength; i++) {
      const fileQ = fileQuestions[i]
      const dbQ = dbQuestions[i]
      
      if (!fileQ) {
        console.log(`   ${i + 1}. ❌ Missing in file: "${dbQ?.question_text}"`)
      } else if (!dbQ) {
        console.log(`   ${i + 1}. ❌ Missing in database: "${fileQ.question}"`)
      } else if (fileQ.id !== dbQ.question_id) {
        console.log(`   ${i + 1}. ❌ ID mismatch: "${fileQ.id}" vs "${dbQ.question_id}"`)
      } else if (fileQ.question !== dbQ.question_text) {
        console.log(`   ${i + 1}. ❌ Text mismatch: "${fileQ.question}" vs "${dbQ.question_text}"`)
      } else {
        console.log(`   ${i + 1}. ✅ Match: "${fileQ.id}"`)
      }
    }
    
    console.log(`\n🎉 Synchronization check complete!`)
    
  } catch (error) {
    console.error('❌ Synchronization check failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  checkSynchronization()
    .then(() => {
      console.log('✨ Check complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Check failed:', error)
      process.exit(1)
    })
}

export default checkSynchronization
