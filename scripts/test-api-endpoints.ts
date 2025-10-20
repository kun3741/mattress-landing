import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testAPIEndpoints() {
  console.log('🔍 Testing API endpoints...')
  
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || '3001'}`
  console.log(`🌐 Base URL: ${baseUrl}`)
  
  try {
    console.log('\n📋 Testing GET /api/survey-questions...')
    const questionsResponse = await fetch(`${baseUrl}/api/survey-questions`)
    
    if (!questionsResponse.ok) {
      throw new Error(`HTTP ${questionsResponse.status}: ${questionsResponse.statusText}`)
    }
    
    const questions = await questionsResponse.json()
    console.log(`✅ Found ${questions.length} questions`)
    
    // Show first few questions
    questions.slice(0, 3).forEach((q: any, index: number) => {
      console.log(`   ${index + 1}. ${q.question} (${q.type})`)
      if (q.options && q.options.length > 0) {
        console.log(`      Options: ${q.options.join(', ')}`)
      }
    })
    
    console.log('\n📄 Testing GET /api/content...')
    const contentResponse = await fetch(`${baseUrl}/api/content`)
    
    if (!contentResponse.ok) {
      throw new Error(`HTTP ${contentResponse.status}: ${contentResponse.statusText}`)
    }
    
    const content = await contentResponse.json()
    console.log(`✅ Content loaded`)
    if (content.hero_title) {
      console.log(`   Hero title: "${content.hero_title}"`)
    }
    if (content.survey_title) {
      console.log(`   Survey title: "${content.survey_title}"`)
    }
    
    console.log('\n📤 Testing POST /api/submit-survey...')
    const submitData = {
      userData: {
        name: 'API Test User',
        phone: '+380999999999',
        city: 'Тестове місто'
      },
      answers: {
        audience: 'Дорослий',
        size: '160*200',
        budget: '9000-15000грн.',
        adults_count: '1',
        adult_1_weight: '75',
        adult_1_height: '178',
        adult_1_age: '34',
        pain: 'ні',
        firmness: 'мабуть середній',
        pillow: 'меморі',
        base: 'ламельний каркас',
        spring_pref: 'головне щоб комфортно було'
      },
      resolvedAnswers: [
        { id: 'audience', question: 'Для кого обираємо матрац?', answer: 'Дорослий' },
        { id: 'size', question: 'Який розмір матрацу Вам потрібен', answer: '160*200' },
      ]
    }
    
    const submitResponse = await fetch(`${baseUrl}/api/submit-survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData)
    })
    
    if (!submitResponse.ok) {
      console.log(`⚠️  Submit failed: HTTP ${submitResponse.status}`)
      const errorText = await submitResponse.text()
      console.log(`   Error: ${errorText}`)
    } else {
      const submitResult = await submitResponse.json()
      console.log(`✅ Survey submitted successfully:`, submitResult)
    }
    
    console.log('\n🎉 All API endpoint tests completed!')
    
  } catch (error) {
    console.error('❌ API test failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  testAPIEndpoints()
    .then(() => {
      console.log('✨ API testing complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 API testing failed:', error)
      process.exit(1)
    })
}

export default testAPIEndpoints
