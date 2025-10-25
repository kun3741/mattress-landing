"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Plus, Trash2, ArrowLeft, RefreshCw, LogOut, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import type { SiteContent } from "@/lib/content-data"
import type { SurveyQuestion } from "@/lib/survey-data"
import { useRouter, useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic"

export default function AdminPage() {
  return (
    <Suspense fallback={<div />}>
      <AdminPageContent />
    </Suspense>
  )
}

function AdminPageContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState<string | null>(null)
  const [contentDirty, setContentDirty] = useState(false)
  const [questionsDirty, setQuestionsDirty] = useState(false)
  const [optionsInputs, setOptionsInputs] = useState<Record<number, string>>({})
  const { toast } = useToast()
  const router = useRouter()
  const sp = useSearchParams()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [contentRes, questionsRes] = await Promise.all([fetch("/api/content"), fetch("/api/survey-questions")])

      const contentData = await contentRes.json()
      const questionsData = await questionsRes.json()

      setContent(contentData)
      setQuestions(questionsData)
      
      // Ініціалізуємо optionsInputs для кожного питання
      const initialOptionsInputs: Record<number, string> = {}
      questionsData.forEach((q: SurveyQuestion, index: number) => {
        if (q.options && Array.isArray(q.options)) {
          initialOptionsInputs[index] = q.options.join(", ")
        }
      })
      setOptionsInputs(initialOptionsInputs)
      
      setContentDirty(false)
      setQuestionsDirty(false)
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити дані",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Завантажити стандартні (нові) питання з коду
  const loadDefaultQuestions = async () => {
    try {
      setSavingStatus("Завантаження нових питань...")
      const res = await fetch("/api/survey-questions/defaults")
      if (!res.ok) throw new Error("Failed to load defaults")
      const data = await res.json()
      setQuestions(data)
      
      // Ініціалізуємо optionsInputs
      const newOptionsInputs: Record<number, string> = {}
      data.forEach((q: SurveyQuestion, index: number) => {
        if (q.options && Array.isArray(q.options)) {
          newOptionsInputs[index] = q.options.join(", ")
        }
      })
      setOptionsInputs(newOptionsInputs)
      
      setQuestionsDirty(true)
      setSavingStatus(null)
      toast({ title: "Готово", description: "Нові питання завантажено. Не забудьте зберегти." })
    } catch (e) {
      setSavingStatus(null)
      toast({ title: "Помилка", description: "Не вдалося завантажити нові питання", variant: "destructive" })
    }
  }

  // Зберегти всі зміни
  const saveAll = async () => {
    if (!content) return
    try {
      setSavingStatus("Збереження змін...")

      // Зберігаємо контент, якщо є зміни
      if (contentDirty) {
        const resp = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content),
        })
        if (!resp.ok) throw new Error("Failed to save content")
      }

      // Зберігаємо питання, якщо є зміни
      if (questionsDirty) {
        // Конвертуємо optionsInputs назад в масиви перед збереженням
        const questionsToSave = questions.map((q, index) => {
          const questionData: any = { ...q }
          
          // Додаємо опції
          if (optionsInputs[index]) {
            questionData.options = optionsInputs[index].split(",").map((s: string) => s.trim()).filter(Boolean)
          }
          
          // Додаємо умовну логіку
          if (q.showIfQuestionId && q.showIfValue) {
            questionData.showIf = {
              questionId: q.showIfQuestionId,
              value: q.showIfValue
            }
          }
          
          return questionData
        })
        
        const resp2 = await fetch("/api/survey-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: questionsToSave }),
        })
        if (!resp2.ok) throw new Error("Failed to save questions")
      }

      setContentDirty(false)
      setQuestionsDirty(false)
      setSavingStatus(null)
      toast({ title: "Збережено", description: "Зміни успішно збережено" })

      // Перезавантажуємо дані з сервера для синхронізації
      await loadData()
    } catch (error) {
      setSavingStatus(null)
      toast({ title: "Помилка", description: "Не вдалося зберегти зміни", variant: "destructive" })
    }
  }

  // Вихід з адмінки
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
  }

  const updateContent = (path: string, value: any) => {
    if (!content) return
    // Оновлюємо локальний стейт для миттєвого відображення, без автозбереження
    const keys = path.split(".")
    const newContent = { ...content }
    let current: any = newContent

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setContent(newContent)
    setContentDirty(true)
  }

  const addQuestion = async () => {
    const newQuestion: SurveyQuestion = {
      id: `question_${Date.now()}`,
      question: "Нове питання",
      type: "radio",
      options: ["Варіант 1", "Варіант 2"],
      required: true,
    }

    const updatedQuestions = [...questions, newQuestion]
    setQuestions(updatedQuestions)
    
    // Додаємо optionsInput для нового питання
    setOptionsInputs({
      ...optionsInputs,
      [updatedQuestions.length - 1]: "Варіант 1, Варіант 2"
    })
    
    setQuestionsDirty(true)
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
    setQuestionsDirty(true)
  }

  const moveQuestionUp = (index: number) => {
    if (index === 0) return
    const newQuestions = [...questions]
    const temp = newQuestions[index - 1]
    newQuestions[index - 1] = newQuestions[index]
    newQuestions[index] = temp
    
    // Також міняємо місцями optionsInputs
    const newOptionsInputs = { ...optionsInputs }
    const tempOptions = newOptionsInputs[index - 1]
    newOptionsInputs[index - 1] = newOptionsInputs[index]
    newOptionsInputs[index] = tempOptions
    
    setQuestions(newQuestions)
    setOptionsInputs(newOptionsInputs)
    setQuestionsDirty(true)
  }

  const moveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return
    const newQuestions = [...questions]
    const temp = newQuestions[index + 1]
    newQuestions[index + 1] = newQuestions[index]
    newQuestions[index] = temp
    
    // Також міняємо місцями optionsInputs
    const newOptionsInputs = { ...optionsInputs }
    const tempOptions = newOptionsInputs[index + 1]
    newOptionsInputs[index + 1] = newOptionsInputs[index]
    newOptionsInputs[index] = tempOptions
    
    setQuestions(newQuestions)
    setOptionsInputs(newOptionsInputs)
    setQuestionsDirty(true)
  }

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_: SurveyQuestion, i: number) => i !== index)
    setQuestions(updatedQuestions)
    
    // Оновлюємо optionsInputs: видаляємо поточний індекс і зсуваємо інші
    const newOptionsInputs: Record<number, string> = {}
    Object.keys(optionsInputs).forEach((key) => {
      const keyIndex = parseInt(key)
      if (keyIndex < index) {
        newOptionsInputs[keyIndex] = optionsInputs[keyIndex]
      } else if (keyIndex > index) {
        newOptionsInputs[keyIndex - 1] = optionsInputs[keyIndex]
      }
    })
    setOptionsInputs(newOptionsInputs)
    
    setQuestionsDirty(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На головну
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Панель адміністратора</h1>
            {(contentDirty || questionsDirty) && (
              <span className="text-sm text-amber-600">Є незбережені зміни</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {savingStatus && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{savingStatus}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />Оновити
            </Button>
            <Button size="sm" onClick={saveAll} disabled={!(contentDirty || questionsDirty)}>
              <Save className="w-4 h-4 mr-2" />Зберегти
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />Вийти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="questions">Питання</TabsTrigger>
            <TabsTrigger value="contacts">Контакти</TabsTrigger>
            <TabsTrigger value="navigation">Навігація</TabsTrigger>
            <TabsTrigger value="dialogs">Діалоги</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Головна секція</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input value={content.hero.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("hero.title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок</Label>
                  <Textarea
                    value={content.hero.subtitle}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContent("hero.subtitle", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Текст кнопки</Label>
                  <Input
                    value={content.hero.ctaButton}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("hero.ctaButton", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Відео</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок секції</Label>
                  <Input value={content.video.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("video.title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>URL відео (YouTube, Vimeo тощо)</Label>
                  <Input
                    value={content.video.url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("video.url", e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Опис Тараса</Label>
                  <Textarea
                    value={content.video.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContent("video.description", e.target.value)}
                    rows={8}
                    placeholder="Опис програми Тараса..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Заголовок CTA</Label>
                  <Input value={content.video.ctaTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("video.ctaTitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Текст кнопки CTA</Label>
                  <Input value={content.video.ctaButton} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("video.ctaButton", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок CTA</Label>
                  <Input value={content.video.ctaSubtitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("video.ctaSubtitle", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Переваги</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок секції переваг</Label>
                  <Input value={content.benefitsSection.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("benefitsSection.title", e.target.value)} />
                </div>
                {content.benefits.map((benefit: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label>Заголовок {index + 1}</Label>
                      <Input
                        value={benefit.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newBenefits = [...content.benefits]
                          newBenefits[index].title = e.target.value
                          updateContent("benefits", newBenefits)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Опис {index + 1}</Label>
                      <Textarea
                        value={benefit.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const newBenefits = [...content.benefits]
                          newBenefits[index].description = e.target.value
                          updateContent("benefits", newBenefits)
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Партнери</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок секції партнерів</Label>
                  <Input value={content.partners.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("partners.title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок секції партнерів</Label>
                  <Input value={content.partners.subtitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("partners.subtitle", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CTA секція</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок CTA</Label>
                  <Input value={content.cta.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("cta.title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок CTA</Label>
                  <Textarea
                    value={content.cta.subtitle}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContent("cta.subtitle", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Текст кнопки CTA</Label>
                  <Input value={content.cta.button} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("cta.button", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">Зміни зберігаються лише після натискання кнопки "Зберегти"</p>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Питання опитування</CardTitle>
                <CardDescription>Редагуйте питання для інтерактивного тесту підбору матрацу</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Button variant="outline" size="sm" onClick={loadDefaultQuestions}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Завантажити нові питання (за замовчуванням)
                  </Button>
                  <Button size="sm" onClick={addQuestion} variant="outline" className="bg-transparent">
                    <Plus className="mr-2 h-4 w-4" /> Додати питання
                  </Button>
                </div>
                {questions.map((question: SurveyQuestion, index: number) => (
                  <div key={question.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <Label className="text-base font-semibold">Питання {index + 1}</Label>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => moveQuestionUp(index)}
                          disabled={index === 0}
                          title="Перемістити вгору"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => moveQuestionDown(index)}
                          disabled={index === questions.length - 1}
                          title="Перемістити вниз"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteQuestion(index)} title="Видалити">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>ID питання</Label>
                          <Input
                            value={question.id || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(index, "id", e.target.value)}
                            placeholder="unique_id"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Текст питання</Label>
                          <Input
                            value={question.question || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(index, "question", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div className="space-y-2">
                          <Label>Тип питання</Label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={question.type || "radio"}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateQuestion(index, "type", e.target.value)}
                          >
                            <option value="radio">Вибір одного варіанту</option>
                            <option value="select">Випадаючий список</option>
                            <option value="number">Число</option>
                            <option value="text">Текст</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id={`req_${index}`}
                            type="checkbox"
                            checked={!!question.required}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(index, "required", e.target.checked)}
                          />
                          <Label htmlFor={`req_${index}`}>Обов'язкове</Label>
                        </div>
                      </div>
                      
                      {/* Умовна логіка показу */}
                      <div className="border-t pt-3 mt-3">
                        <Label className="text-sm font-medium mb-2 block">Умовна логіка (показувати якщо...)</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">ID питання</Label>
                            <Input
                              value={question.showIfQuestionId || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(index, "showIfQuestionId", e.target.value)}
                              placeholder="audience"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Значення відповіді</Label>
                            <Input
                              value={question.showIfValue || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(index, "showIfValue", e.target.value)}
                              placeholder="Дорослий"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Залиште порожнім для показу завжди. Приклад: audience = "Дорослий"
                        </p>
                      </div>
                    </div>
                    {(question.type === "radio" || question.type === "select") && (
                      <div className="space-y-2">
                        <Label>Варіанти відповідей (через кому)</Label>
                        <Textarea
                          value={optionsInputs[index] || ""}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            // Просто зберігаємо текст як є
                            setOptionsInputs({
                              ...optionsInputs,
                              [index]: e.target.value
                            })
                            setQuestionsDirty(true)
                          }}
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">Після редагування натисніть "Зберегти" у верхній панелі</p>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Контактна інформація</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input
                    value={content.contacts.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("contacts.phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={content.contacts.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("contacts.email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Адреса</Label>
                  <Input
                    value={content.contacts.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("contacts.address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Виробники</CardTitle>
                <CardDescription>Додайте логотипи та назви виробників</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.factories.map((factory: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Виробник {index + 1}</Label>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (index === 0) return
                              const newFactories = [...content.factories]
                              const temp = newFactories[index - 1]
                              newFactories[index - 1] = newFactories[index]
                              newFactories[index] = temp
                              updateContent("factories", newFactories)
                            }}
                            disabled={index === 0}
                            title="Перемістити вгору"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (index === content.factories.length - 1) return
                              const newFactories = [...content.factories]
                              const temp = newFactories[index + 1]
                              newFactories[index + 1] = newFactories[index]
                              newFactories[index] = temp
                              updateContent("factories", newFactories)
                            }}
                            disabled={index === content.factories.length - 1}
                            title="Перемістити вниз"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <Input
                        value={factory.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newFactories = [...content.factories]
                          newFactories[index].name = e.target.value
                          updateContent("factories", newFactories)
                        }}
                        placeholder="Назва виробника"
                      />
                      <Input
                        value={factory.logo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newFactories = [...content.factories]
                          newFactories[index].logo = e.target.value
                          updateContent("factories", newFactories)
                        }}
                        placeholder="Шлях до логотипу"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          id={`priority_${index}`}
                          type="checkbox"
                          checked={!!factory.isPriority}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newFactories = [...content.factories]
                            newFactories[index].isPriority = e.target.checked
                            updateContent("factories", newFactories)
                          }}
                        />
                        <Label htmlFor={`priority_${index}`} className="text-sm">Пріоритетний партнер</Label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">Після редагування натисніть "Зберегти" у верхній панелі</p>
            </div>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Навігація</CardTitle>
                <CardDescription>Тексти для навігаційного меню</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Переваги</Label>
                  <Input value={content.navigation.benefits} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("navigation.benefits", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Партнери</Label>
                  <Input value={content.navigation.partners} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("navigation.partners", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Контакти</Label>
                  <Input value={content.navigation.contacts} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("navigation.contacts", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Футер</CardTitle>
                <CardDescription>Тексти для футера</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Копірайт</Label>
                  <Input value={content.footer.copyright} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("footer.copyright", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Переваги (в футері)</Label>
                  <Input value={content.footer.benefits} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("footer.benefits", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Партнери (в футері)</Label>
                  <Input value={content.footer.partners} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("footer.partners", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Контакти (в футері)</Label>
                  <Input value={content.footer.contacts} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("footer.contacts", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">Після редагування натисніть "Зберегти" у верхній панелі</p>
            </div>
          </TabsContent>

          <TabsContent value="dialogs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Діалог переваг</CardTitle>
                <CardDescription>Тексти для діалогу з перевагами</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок діалогу</Label>
                  <Input value={content.infoDialogs.benefits.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("infoDialogs.benefits.title", e.target.value)} />
                </div>
                {content.infoDialogs.benefits.content.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label>Заголовок {index + 1}</Label>
                      <Input
                        value={item.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newContent = [...content.infoDialogs.benefits.content]
                          newContent[index].title = e.target.value
                          updateContent("infoDialogs.benefits.content", newContent)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Опис {index + 1}</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const newContent = [...content.infoDialogs.benefits.content]
                          newContent[index].description = e.target.value
                          updateContent("infoDialogs.benefits.content", newContent)
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Діалог партнерів</CardTitle>
                <CardDescription>Тексти для діалогу з партнерами</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок діалогу</Label>
                  <Input value={content.infoDialogs.partners.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("infoDialogs.partners.title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Опис партнерів</Label>
                  <Textarea
                    value={content.infoDialogs.partners.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContent("infoDialogs.partners.description", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Діалог контактів</CardTitle>
                <CardDescription>Тексти для діалогу з контактами</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок діалогу</Label>
                  <Input value={content.infoDialogs.contacts.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("infoDialogs.contacts.title", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">Після редагування натисніть "Зберегти" у верхній панелі</p>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO налаштування</CardTitle>
                <CardDescription>Оптимізація для пошукових систем</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок сторінки (Title)</Label>
                  <Input value={content.seo.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent("seo.title", e.target.value)} />
                  <p className="text-xs text-muted-foreground">Рекомендовано: 50-60 символів</p>
                </div>
                <div className="space-y-2">
                  <Label>Опис (Description)</Label>
                  <Textarea
                    value={content.seo.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContent("seo.description", e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Рекомендовано: 150-160 символів</p>
                </div>
                <div className="space-y-2">
                  <Label>Ключові слова (Keywords)</Label>
                  <Textarea
                    value={content.seo.keywords}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContent("seo.keywords", e.target.value)}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">Розділяйте ключові слова комами</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">Після редагування натисніть "Зберегти" у верхній панелі</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
