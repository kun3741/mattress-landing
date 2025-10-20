import { NextResponse } from "next/server"
import { surveyQuestions as defaultQuestions } from "@/lib/survey-data"

export async function GET() {
  // return the default questions to allow admin to load the latest version
  return NextResponse.json(defaultQuestions)
}
