import { getDatabase } from './mongodb'
import { SurveyQuestion, SurveyResponse, SiteContent } from './models'
import { Collection, ObjectId } from 'mongodb'

export class SurveyQuestionsService {
  private static async getCollection(): Promise<Collection<SurveyQuestion>> {
    const db = await getDatabase()
    return db.collection<SurveyQuestion>('survey_questions')
  }

  static async getAll(): Promise<SurveyQuestion[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ order_index: 1 }).toArray()
  }

  static async create(question: Omit<SurveyQuestion, '_id' | 'created_at' | 'updated_at'>): Promise<SurveyQuestion> {
    const collection = await this.getCollection()
    const now = new Date()
    const result = await collection.insertOne({
      ...question,
      created_at: now,
      updated_at: now
    })
    
    return await collection.findOne({ _id: result.insertedId }) as SurveyQuestion
  }

  static async update(question_id: string, updates: Partial<SurveyQuestion>): Promise<SurveyQuestion | null> {
    const collection = await this.getCollection()
    const result = await collection.findOneAndUpdate(
      { question_id },
      { 
        $set: { 
          ...updates, 
          updated_at: new Date() 
        } 
      },
      { returnDocument: 'after' }
    )
    return result || null
  }
}

export class SurveyResponsesService {
  private static async getCollection(): Promise<Collection<SurveyResponse>> {
    const db = await getDatabase()
    return db.collection<SurveyResponse>('survey_responses')
  }

  static async create(response: Omit<SurveyResponse, '_id' | 'created_at'>): Promise<SurveyResponse> {
    const collection = await this.getCollection()
    const result = await collection.insertOne({
      ...response,
      created_at: new Date()
    })
    
    return await collection.findOne({ _id: result.insertedId }) as SurveyResponse
  }

  static async getAll(limit: number = 100): Promise<SurveyResponse[]> {
    const collection = await this.getCollection()
    return await collection.find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray()
  }
  static async getById(id: string): Promise<SurveyResponse | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }
}

export class SiteContentService {
  private static async getCollection(): Promise<Collection<SiteContent>> {
    const db = await getDatabase()
    return db.collection<SiteContent>('site_content')
  }

  static async get(key: string): Promise<any> {
    const collection = await this.getCollection()
    const content = await collection.findOne({ key })
    return content?.value || null
  }

  static async set(key: string, value: any): Promise<SiteContent> {
    const collection = await this.getCollection()
    const result = await collection.findOneAndUpdate(
      { key },
      { 
        $set: { 
          value, 
          updated_at: new Date() 
        } 
      },
      { 
        upsert: true, 
        returnDocument: 'after' 
      }
    )
    return result as SiteContent
  }

  static async getAll(): Promise<SiteContent[]> {
    const collection = await this.getCollection()
    return await collection.find({}).toArray()
  }
}
