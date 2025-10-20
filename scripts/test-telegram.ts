import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { sendToTelegram } from '../lib/telegram'

async function testTelegram() {
  console.log('📱 Testing Telegram integration...')
  
  try {
    const testData = {
      userData: {
        name: 'Тестовий Користувач',
        phone: '+380123456789',
        city: 'Київ'
      },
      answers: {
        sleep_position: 'На боці',
        firmness_preference: 'Середньої жорсткості',
        weight_category: '70-90 кг',
        health_issues: 'Ні',
        temperature_preference: 'Комфортно',
        budget_range: '15,000-25,000 грн'
      }
    }
    
    console.log('📤 Sending test message to Telegram...')
    const result = await sendToTelegram(testData)
    
    if (result.success) {
      console.log('✅ Telegram message sent successfully!')
    } else {
      console.log('❌ Failed to send Telegram message:', result.error)
    }
    
  } catch (error) {
    console.error('💥 Telegram test failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  testTelegram()
    .then(() => {
      console.log('📱 Telegram testing complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Telegram testing failed:', error)
      process.exit(1)
    })
}

export default testTelegram
