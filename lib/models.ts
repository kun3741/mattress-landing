import { ObjectId } from 'mongodb'

export interface SurveyQuestion {
  _id?: ObjectId
  question_id: string
  question_text: string
  question_type: 'single' | 'multiple' | 'text' | 'number' | 'select' | 'radio'
  options?: string[]
  next_question_logic?: Record<string, any>
  show_if_logic?: {
    question_id: string  // ID питання від якого залежить показ
    answer_value: string // Значення відповіді для показу
  }
  order_index: number
  required?: boolean
  created_at?: Date
  updated_at?: Date
}

export interface SurveyResponse {
  _id?: ObjectId
  name: string
  phone: string
  city: string
  answers: Record<string, any>
  resolved_answers?: Array<{ id: string; question: string; answer: string }>
  meta?: {
    user_agent?: string
    referer?: string
    submitted_at?: string
  }
  created_at?: Date
}

export interface SiteContent {
  _id?: ObjectId
  key: string
  value: any
  updated_at?: Date
}
