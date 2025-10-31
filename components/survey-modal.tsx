"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type UserData } from "@/lib/survey-data"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2 } from "lucide-react"

// Support for custom option like "інше (впишіть)" / "свій варіант"
const OTHER_VALUE = "__other__"
const isOtherOption = (label: string) => {
  const s = label.toLowerCase()
  return (
    s.includes("інше") ||
    s.includes("iнше") ||
    s.includes("свій варіант") ||
    s.includes("свiй варiант")
  )
}

interface SurveyQuestion {
  id: string
  question: string
  type: "text" | "select" | "radio" | "number"
  options?: string[] | ((answers: Record<string, string>) => string[])
  required?: boolean
  showIf?: (answers: Record<string, string>) => boolean
  // include admin-configured otherInput
  otherInput?: {
    enabled?: boolean
    label?: string
    placeholder?: string
    required?: boolean
  }
}

interface SurveyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SurveyModal({ open, onOpenChange }: SurveyModalProps) {
  const [step, setStep] = useState<"contact" | "survey" | "success" | "loading">("survey")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userData, setUserData] = useState<UserData>({ name: "", phone: "", city: "" })
  const [answers, setAnswers] = useState<Record<string, string>>({})
  // Stores free-text for questions where user chose OTHER_VALUE
  const [otherAnswers, setOtherAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadedQuestions, setLoadedQuestions] = useState<any[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const { toast } = useToast()

  // Load questions from API
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/survey-questions')
        const data = await response.json()
        setLoadedQuestions(data)
      } catch (error) {
        console.error('Failed to load questions:', error)
      } finally {
        setIsLoadingQuestions(false)
      }
    }
    
    if (open) {
      loadQuestions()
    }
  }, [open])

  // Build full conditional survey once
  const questions: SurveyQuestion[] = useMemo(() => {
    // Helper function to get question data from loaded questions
    const getLoadedQuestion = (id: string) => {
      return loadedQuestions.find(q => q.id === id)
    }

    const ALL_SIZES = [
      "80*190", "80*200", "90*200", "90*190",
      "120*190", "120*200", "140*190", "140*200",
      "150*190", "150*200", "160*190", "160*200",
      "180*190", "180*200", "200*200", "свій варіант",
    ]

    const budgetOptions = (size?: string): string[] => {
      if (!size) return ["до 5000грн.", "5000-8000грн.", "9000-15000грн.", "можна і більше 15000грн"]
      const s = size.replaceAll(" ", "")
      const small = ["80*190","90*190","80*200","90*200"]
      const mid = ["120*190","120*200","140*190","140*200"]
      const midLarge = ["160*200","160*190","150*200","150*190"]
      const large = ["180*200","180*190","200*200"]
      if (small.includes(s)) return ["до 5000грн.", "можна і більше 5000грн.", "можна і більше 10000грн."]
      if (mid.includes(s)) return ["до 5000грн.", "5000-8000грн.", "можна і більше 10000грн."]
      if (midLarge.includes(s)) return ["5200-6500грн.", "6500-9000грн.", "9000-15000грн.", "можна і більше 15000грн"]
      if (large.includes(s)) return ["від 6500-8500грн.", "від 8500-11000грн.", "від 12000-17000грн.", "можна і більше 17000грн."]
      return ["до 5000грн.", "5000-8000грн.", "9000-15000грн.", "можна і більше 15000грн"]
    }

    // Build questions ONLY from database - completely dynamic!
    if (loadedQuestions.length === 0) {
      return []
    }

    return loadedQuestions.map((q: any) => {
      // Handle dynamic options for budget based on size
      let finalOptions = q.options
      if (q.id === 'budget' && typeof q.options !== 'function') {
        // Create dynamic options function for budget
        finalOptions = (answers: Record<string, string>) => {
          return budgetOptions(answers['size'])
        }
      }

      // Ensure "Можна більше 25000грн" present for budget2
      if (q.id === 'budget2' && Array.isArray(finalOptions)) {
        const has25k = finalOptions.some((o: string) => o.toLowerCase().includes('25000'))
        if (!has25k) {
          finalOptions = [...finalOptions, 'Можна більше 25000грн']
        }
      }

      // Create showIf function from database logic
      let showIfFunction: ((answers: Record<string, string>) => boolean) | undefined = undefined
      
      if (q.showIfQuestionId && q.showIfValue) {
        showIfFunction = (answers: Record<string, string>) => {
          const rawAnswer = answers[q.showIfQuestionId]
          if (!rawAnswer) return false

          // Support comma-separated list in showIfValue (e.g., multiple sizes)
          const allowedValues = String(q.showIfValue)
            .split(',')
            .map(v => v.trim())
            .filter(Boolean)

          // Normalize size values by removing spaces for robust comparison
          const normalize = (v: string) => q.showIfQuestionId === 'size' ? v.replaceAll(' ', '') : v

          const normalizedAnswer = normalize(rawAnswer)
          return allowedValues.some(v => normalize(v) === normalizedAnswer)
        }
      }

      return {
        id: q.id,
        question: q.question,
        type: q.type,
        options: finalOptions,
        required: q.required !== false,
        showIf: showIfFunction,
        otherInput: q.otherInput,
      } as SurveyQuestion
    })
  }, [loadedQuestions, answers])

  const visibleIndexes = useMemo(() => {
    return questions
      .map((q, idx) => ({ idx, show: q.showIf ? q.showIf(answers) : true }))
      .filter(q => q.show)
      .map(q => q.idx)
  }, [questions, answers])

  const currentIndexSafe = useMemo(() => {
    if (visibleIndexes.length === 0) return 0
    const idx = visibleIndexes.find(i => i >= currentQuestionIndex) ?? visibleIndexes[visibleIndexes.length - 1]
    return idx
  }, [visibleIndexes, currentQuestionIndex])

  const currentQuestion = questions[currentIndexSafe]

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nameOk = /^[A-Za-zА-Яа-яЁёІіЇїЄє' -]{2,}$/.test(userData.name.trim())
    const digits = userData.phone.replace(/\D/g, "")
    const phoneOk = digits.length >= 10 && digits.length <= 13
    const cityOk = /^[A-Za-zА-Яа-яЁёІіЇїЄє' -]{2,}$/.test(userData.city.trim())

    if (!nameOk) {
      toast({ title: "Помилка", description: "Ім'я має містити лише літери (мінімум 2 символи).", variant: "destructive" })
      return
    }
    if (!phoneOk) {
      toast({ title: "Помилка", description: "Вкажіть коректний номер телефону (від 10 цифр).", variant: "destructive" })
      return
    }
    if (!cityOk) {
      toast({ title: "Помилка", description: "Місто/селище має містити лише літери (мінімум 2 символи).", variant: "destructive" })
      return
    }

    handleSubmit()
  }

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
    // Clear custom text if user switched away from OTHER_VALUE
    setOtherAnswers(prev => {
      const copy = { ...prev }
      if (value !== OTHER_VALUE) delete (copy as any)[currentQuestion.id]
      return copy
    })
  }

  const goToNextVisible = () => {
    const pos = visibleIndexes.indexOf(currentIndexSafe)
    if (pos >= 0 && pos < visibleIndexes.length - 1) {
      setCurrentQuestionIndex(visibleIndexes[pos + 1])
    } else {
      setStep("contact")
    }
  }

  const goToPrevVisible = () => {
    const pos = visibleIndexes.indexOf(currentIndexSafe)
    if (pos > 0) {
      setCurrentQuestionIndex(visibleIndexes[pos - 1])
    }
  }

  const goBackFromContact = () => {
    setStep("survey")
    if (visibleIndexes.length > 0) {
      setCurrentQuestionIndex(visibleIndexes[visibleIndexes.length - 1])
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const resolvedAnswers = questions
        .filter((q) => !q.showIf || q.showIf(answers))
        .map((q) => {
          const raw = answers[q.id]
          const finalAns = raw === OTHER_VALUE ? (otherAnswers[q.id] || "") : raw
          return { id: q.id, question: q.question, answer: finalAns }
        })

      const payload = {
        userData: {
          ...userData,
          phone: userData.phone.trim(),
        },
        answers,
        resolvedAnswers,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/submit-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to submit")

      setStep("success")
      toast({ title: "Дякуємо!", description: "Ваші дані успішно відправлені. Ми зв'яжемося з вами найближчим часом." })
    } catch (error) {
      toast({ title: "Помилка", description: "Не вдалося відправити дані. Спробуйте ще раз.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = useMemo(() => {
    const total = visibleIndexes.length
    const pos = Math.max(0, visibleIndexes.indexOf(currentIndexSafe))
    return total > 0 ? ((pos + 1) / total) * 100 : 0
  }, [visibleIndexes, currentIndexSafe])

  const isCurrentValid = useMemo(() => {
    if (!currentQuestion) return false
    if (!currentQuestion.required) return true
    const val = answers[currentQuestion.id]
    if (val === OTHER_VALUE) {
      const req = (currentQuestion as any).otherInput?.required !== false
      return !req || (typeof otherAnswers[currentQuestion.id] === 'string' && otherAnswers[currentQuestion.id].trim().length > 0)
    }
    return typeof val === 'string' && val.trim().length > 0
  }, [currentQuestion, answers, otherAnswers])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(480px,calc(100vw-2rem))] sm:max-w-[460px] max-h-[85vh] overflow-y-auto p-4 sm:p-6" aria-describedby="survey-dialog-description">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl text-center">
            {step === "survey" ? "Опитування" : step === "contact" ? "Ваші контактні дані" : "Дякуємо!"}
          </DialogTitle>
          <p id="survey-dialog-description" className="sr-only">
            {step === "survey"
              ? "Опитування для підбору ідеального матраца на основі ваших параметрів"
              : step === "contact"
              ? "Форма для введення ваших контактних даних після завершення опитування"
              : "Дякуємо за участь в опитуванні!"}
          </p>
        </DialogHeader>

        {step === "contact" && (
          <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
            <div>
              <Label htmlFor="name">Ім'я</Label>
              <Input id="name" className="w-full" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} required pattern="^[A-Za-zА-Яа-яЁёІіЇїЄє' -]{2,}$" minLength={2} title="Введіть ім'я без цифр (мін. 2 символи)" />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" className="w-full" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} required inputMode="tel" pattern="^[0-9+()\\s-]{10,}$" minLength={10} title="Введіть коректний номер телефону" />
            </div>
            <div>
              <Label htmlFor="city">Місто/Селище</Label>
              <Input
                id="city"
                className="w-full"
                value={userData.city}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[0-9]/g, "")
                  setUserData({ ...userData, city: cleaned })
                }}
                required
                minLength={2}
                pattern="^[A-Za-zА-Яа-яЁёІіЇїЄє' -]{2,}$"
                title="Вводьте лише літери, пробіли, апостроф та дефіс (мін. 2 символи)"
              />
            </div>
            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={goBackFromContact}>Назад</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Відправка...</> : "Відправити"}
              </Button>
            </div>
          </form>
        )}

        {step === "survey" && isLoadingQuestions && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {step === "survey" && !isLoadingQuestions && currentQuestion && (
          <div className="space-y-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>

            <div>
              <p className="font-medium mb-3 text-left">{currentQuestion.question}</p>
              {currentQuestion.type === "radio" && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={handleAnswerChange}
                >
                  {(typeof currentQuestion.options === "function" ? currentQuestion.options(answers) : currentQuestion.options || []).map((opt) => {
                    const otherEnabled = (currentQuestion as any).otherInput?.enabled
                    const otherLabel = (currentQuestion as any).otherInput?.label || opt
                    const useOther = otherEnabled ? isOtherOption(otherLabel) || isOtherOption(opt) : isOtherOption(opt)
                    const value = useOther ? OTHER_VALUE : opt
                    const labelText = useOther && otherEnabled ? otherLabel : opt
                    return (
                      <div key={opt} className="flex items-center space-x-2 py-1">
                        <RadioGroupItem id={`${currentQuestion.id}-${opt}`} value={value} />
                        <Label htmlFor={`${currentQuestion.id}-${opt}`}>{labelText}</Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              )}
              {currentQuestion.type === "radio" && answers[currentQuestion.id] === OTHER_VALUE && (
                <div className="mt-2">
                  <Input
                    placeholder={(currentQuestion as any).otherInput?.placeholder || "Впишіть свій варіант"}
                    value={otherAnswers[currentQuestion.id] || ""}
                    onChange={(e) => setOtherAnswers({ ...otherAnswers, [currentQuestion.id]: e.target.value })}
                  />
                </div>
              )}

              {currentQuestion.type === "select" && (
                <>
                  <Select value={answers[currentQuestion.id]} onValueChange={handleAnswerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть варіант" />
                    </SelectTrigger>
                    <SelectContent>
                      {(typeof currentQuestion.options === "function" ? currentQuestion.options(answers) : currentQuestion.options || []).map((opt) => {
                        const otherEnabled = (currentQuestion as any).otherInput?.enabled
                        const otherLabel = (currentQuestion as any).otherInput?.label || opt
                        const useOther = otherEnabled ? isOtherOption(otherLabel) || isOtherOption(opt) : isOtherOption(opt)
                        const value = useOther ? OTHER_VALUE : opt
                        const labelText = useOther && otherEnabled ? otherLabel : opt
                        return (
                          <SelectItem key={opt} value={value}>{labelText}</SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  {answers[currentQuestion.id] === OTHER_VALUE && (
                    <div className="mt-2">
                      <Input
                        placeholder={(currentQuestion as any).otherInput?.placeholder || "Впишіть свій варіант"}
                        value={otherAnswers[currentQuestion.id] || ""}
                        onChange={(e) => setOtherAnswers({ ...otherAnswers, [currentQuestion.id]: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}

              {(currentQuestion.type === "text" || currentQuestion.type === "number") && (
                <Input
                  type={currentQuestion.type === "number" ? "number" : "text"}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={goToPrevVisible} disabled={visibleIndexes.indexOf(currentIndexSafe) === 0}>Назад</Button>
              <Button onClick={goToNextVisible} disabled={!isCurrentValid}>Далі</Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-3 py-6">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
            <p>Дякуємо за відповіді! Наш менеджер зв'яжеться з вами найближчим часом.</p>
            <Button onClick={() => onOpenChange(false)}>Закрити</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
