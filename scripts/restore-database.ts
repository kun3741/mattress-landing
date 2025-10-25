import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getDatabase } from '../lib/mongodb'

async function restoreDatabase(backupFile: string) {
  try {
    console.log('🔄 Starting database restore...')
    
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`)
    }
    
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf-8'))
    
    console.log(`📅 Restoring from backup created: ${backup.timestamp}`)
    
    const db = await getDatabase()
    
    // Restore survey questions
    if (backup.collections.survey_questions) {
      console.log('📋 Restoring survey questions...')
      await db.collection('survey_questions').deleteMany({})
      
      // Remove _id field for clean insert
      const questions = backup.collections.survey_questions.map((q: any) => {
        const { _id, ...rest } = q
        return rest
      })
      
      if (questions.length > 0) {
        await db.collection('survey_questions').insertMany(questions)
      }
      console.log(`✅ Restored ${questions.length} survey questions`)
    }
    
    // Restore site content
    if (backup.collections.site_content) {
      console.log('📄 Restoring site content...')
      await db.collection('site_content').deleteMany({})
      
      // Remove _id field for clean insert
      const content = backup.collections.site_content.map((c: any) => {
        const { _id, ...rest } = c
        return rest
      })
      
      if (content.length > 0) {
        await db.collection('site_content').insertMany(content)
      }
      console.log(`✅ Restored ${content.length} content items`)
    }
    
    console.log('🎉 Database restored successfully!')
    
  } catch (error) {
    console.error('❌ Error restoring database:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  const backupFile = process.argv[2]
  
  if (!backupFile) {
    console.error('❌ Please provide backup file path')
    console.log('Usage: npm run db:restore -- path/to/backup.json')
    process.exit(1)
  }
  
  restoreDatabase(backupFile)
    .then(() => {
      console.log('✅ Restore complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Restore failed:', error)
      process.exit(1)
    })
}

export default restoreDatabase

