"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type UserData } from "@/lib/survey-data"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2 } from "lucide-react"

interface SurveyQuestion {
  id: string
  question: string
  type: "text" | "select" | "radio" | "number"
  options?: string[] | ((answers: Record<string, string>) => string[])
  required?: boolean
  showIf?: (answers: Record<string, string>) => boolean
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Build full conditional survey once
  const questions: SurveyQuestion[] = useMemo(() => {
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

    const q: SurveyQuestion[] = [
      // Загальні
      { id: "audience", question: "Для кого обираємо матрац?", type: "radio", options: ["Дитина", "Дорослий"], required: true },
      { id: "size", question: "Який розмір матрацу Вам потрібен", type: "select", options: ALL_SIZES, required: true },
      { id: "budget", question: "Впишіть ціну 'ДО' яку Ви готові витратити!", type: "radio", required: true, options: (a) => budgetOptions(a["size"]) },

      // Дорослий гілка
      { id: "adults_count", question: "Скільки людей буде спати на матраці?", type: "radio", options: ["1", "2"], required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "adult_1_weight", question: "Ваша вага (кг)", type: "number", required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "adult_1_height", question: "Ваш зріст (см)", type: "number", required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "adult_1_age", question: "Ваш вік", type: "number", required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "adult_2_weight", question: "Вага партнера (кг)", type: "number", required: true, showIf: a => a["adults_count"] === "2" },
      { id: "adult_2_height", question: "Зріст партнера (см)", type: "number", required: true, showIf: a => a["adults_count"] === "2" },
      { id: "adult_2_age", question: "Вік партнера", type: "number", required: true, showIf: a => a["adults_count"] === "2" },

      { id: "pain", question: "Чи є у Вас біль під час сну", type: "radio", options: ["так", "ні"], required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "pain_area", question: "Де саме болить?", type: "radio", options: ["поперек","шийний відділ","грудний відділ","давить в плече","просто вся спина","свій варіант"], required: true, showIf: a => a["audience"] === "Дорослий" && a["pain"] === "так" },
      { id: "pain_custom", question: "опишіть конкретно свій біль або дискомфорт", type: "text", required: true, showIf: a => a["audience"] === "Дорослий" && a["pain_area"] === "свій варіант" },
      { id: "health_issues", question: "Чи є у вас проблеми зі здоров'ям, якщо так, то опишіть конкретно які", type: "text", required: false, showIf: a => a["audience"] === "Дорослий" },

      { id: "current_mattress", question: "На якому матраці Ви спите зараз?", type: "radio", options: ["пружинний","безпружинний","інше (впишіть)"] , required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "current_mattress_name", question: "Якщо знаєте назву – впишіть", type: "text", required: false, showIf: a => a["audience"] === "Дорослий" && a["current_mattress"] === "інше (впишіть)" },

      { id: "dissatisfaction", question: "Що саме вас не влаштовує в матраці на якому спите зараз", type: "radio", options: ["просів","твердий","м'який","просто не зручний","провалююсь","свій варіант"], required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "firmness", question: "Вам зручніше спати на м'якому чи твердому?", type: "radio", options: ["м’який","твердий","мабуть середній"], required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "pillow", question: "На якій подушці любите спати?", type: "radio", options: ["меморі","пух","висока","маленька","сплю без подушки"], required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "base", question: "На чому має лежати матрац", type: "radio", options: ["ламельний каркас","тверда основа ліжка","на іншому матраці","на підлозі"], required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "spring_pref", question: "Віддаєте перевагу пружинним чи безпружинним?", type: "radio", options: ["тільки пружинні","тільки безпружинні","головне щоб комфортно було"], required: true, showIf: a => a["audience"] === "Дорослий" },
      { id: "adult_extra", question: "Особливості Вашого тіла, або Ваші запитання", type: "text", required: false, showIf: a => a["audience"] === "Дорослий" },

      // Дитина
      { id: "child_age", question: "Скільки років дитині", type: "number", required: true, showIf: a => a["audience"] === "Дитина" },
      { id: "child_weight", question: "Яка вага дитини (кг)", type: "number", required: true, showIf: a => a["audience"] === "Дитина" },
      { id: "child_height", question: "Який зріст дитини (см)", type: "number", required: true, showIf: a => a["audience"] === "Дитина" },
      { id: "child_health", question: "Чи є у дитини проблеми зі здоров'ям?", type: "radio", options: ["ні","сколіоз","лордоз","кіфоз","викривлення спини","інше (пропишіть)"], required: true, showIf: a => a["audience"] === "Дитина" },
      { id: "child_health_other", question: "Вкажіть точний діагноз", type: "text", required: false, showIf: a => a["audience"] === "Дитина" && a["child_health"] === "інше (пропишіть)" },
      { id: "child_current_mattress", question: "На чому спить дитина зараз?", type: "radio", options: ["пружинний","безпружинний","диван","люлька","інше (впишіть)"], required: true, showIf: a => a["audience"] === "Дитина" },
      { id: "child_current_name", question: "Назва/модель (за бажанням)", type: "text", required: false, showIf: a => a["audience"] === "Дитина" },
      { id: "child_dissatisfaction", question: "що конкретно не влаштовує зараз під час сну", type: "radio", options: ["просів","твердий","м'який","дитині не зручний","свій варіант","далі"], required: true, showIf: a => a["audience"] === "Дитина" },
      { id: "child_base", question: "На чому має лежати матрац", type: "radio", options: ["ламельний каркас","тверда основа ліжка","на іншому матраці","на підлозі"], required: true, showIf: a => a["audience"] === "Дитина" },
      { id: "child_extra", question: "Особливості дитини / запитання (необов'язково)", type: "text", required: false, showIf: a => a["audience"] === "Дитина" },

      // Фініш для всіх – контактні дані вже зібрані на першому кроці
      // (видалено дублікати "city" та "phone_confirm")
    ]
    return q
  }, [])

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
    if (userData.name && userData.phone && userData.city) {
      handleSubmit()
    }
  }

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
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
        .map((q) => ({ id: q.id, question: q.question, answer: answers[q.id] }))

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
    return typeof val === 'string' && val.trim().length > 0
  }, [currentQuestion, answers])

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
              <Input id="name" className="w-full" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" className="w-full" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="city">Місто/Селище</Label>
              <Input id="city" className="w-full" value={userData.city} onChange={(e) => setUserData({ ...userData, city: e.target.value })} required />
            </div>
            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={goBackFromContact}>Назад</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Відправка...</> : "Відправити"}
              </Button>
            </div>
          </form>
        )}

        {step === "survey" && currentQuestion && (
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
                  {(typeof currentQuestion.options === "function" ? currentQuestion.options(answers) : currentQuestion.options || []).map((opt) => (
                    <div key={opt} className="flex items-center space-x-2 py-1">
                      <RadioGroupItem id={`${currentQuestion.id}-${opt}`} value={opt} />
                      <Label htmlFor={`${currentQuestion.id}-${opt}`}>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === "select" && (
                <Select value={answers[currentQuestion.id]} onValueChange={handleAnswerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть варіант" />
                  </SelectTrigger>
                  <SelectContent>
                    {(typeof currentQuestion.options === "function" ? currentQuestion.options(answers) : currentQuestion.options || []).map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
