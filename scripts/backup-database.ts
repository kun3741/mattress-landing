import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getDatabase } from '../lib/mongodb'

async function backupDatabase() {
  try {
    console.log('💾 Starting database backup...')
    const db = await getDatabase()
    
    // Backup survey questions
    console.log('📋 Backing up survey questions...')
    const questions = await db.collection('survey_questions')
      .find({})
      .sort({ order_index: 1 })
      .toArray()
    
    // Backup site content
    console.log('📄 Backing up site content...')
    const content = await db.collection('site_content')
      .find({})
      .toArray()
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      collections: {
        survey_questions: questions,
        site_content: content
      }
    }
    
    // Save to file
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2))
    
    console.log(`✅ Backup completed successfully!`)
    console.log(`📁 Backup saved to: ${backupFile}`)
    console.log(`📊 Backed up ${questions.length} survey questions`)
    console.log(`📝 Backed up ${content.length} content items`)
    
  } catch (error) {
    console.error('❌ Error backing up database:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  backupDatabase()
    .then(() => {
      console.log('🎉 Backup complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Backup failed:', error)
      process.exit(1)
    })
}

export default backupDatabase

