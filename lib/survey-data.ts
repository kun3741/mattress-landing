// Survey questions with branching logic
export interface SurveyQuestion {
  id: string
  question: string
  type: "text" | "select" | "radio" | "number"
  options?: string[]
  nextQuestion?: string | ((answer: string) => string)
  required?: boolean
}

export const surveyQuestions: SurveyQuestion[] = [
  // Загальні
  {
    id: "audience",
    question: "Для кого обираємо матрац?",
    type: "radio",
    options: ["Дитина", "Дорослий"],
    required: true,
  },
  {
    id: "size",
    question: "Який розмір матрацу Вам потрібен",
    type: "select",
    options: [
      "80*190",
      "80*200",
      "90*200",
      "90*190",
      "120*190",
      "120*200",
      "140*190",
      "140*200",
      "150*190",
      "150*200",
      "160*190",
      "160*200",
      "180*190",
      "180*200",
      "200*200",
      "свій варіант",
    ],
    required: true,
  },
  {
    id: "budget",
    question: "Впишіть ціну 'ДО' яку Ви готові витратити!",
    type: "radio",
    options: [
      "до 5000грн.",
      "5000-8000грн.",
      "9000-15000грн.",
      "можна і більше 15000грн",
    ],
    required: true,
  },

  // Дорослий
  {
    id: "adults_count",
    question: "Скільки людей буде спати на матраці?",
    type: "radio",
    options: ["1", "2"],
    required: true,
  },
  { id: "adult_1_weight", question: "Ваша вага (кг)", type: "number", required: true },
  { id: "adult_1_height", question: "Ваш зріст (см)", type: "number", required: true },
  { id: "adult_1_age", question: "Ваш вік", type: "number", required: true },
  { id: "adult_2_weight", question: "Вага партнера (кг)", type: "number", required: true },
  { id: "adult_2_height", question: "Зріст партнера (см)", type: "number", required: true },
  { id: "adult_2_age", question: "Вік партнера", type: "number", required: true },

  { id: "pain", question: "Чи є у Вас біль під час сну", type: "radio", options: ["так", "ні"], required: true },
  {
    id: "pain_area",
    question: "Де саме болить?",
    type: "radio",
    options: [
      "поперек",
      "шийний відділ",
      "грудний відділ",
      "давить в плече",
      "просто вся спина",
      "свій варіант",
    ],
    required: true,
  },
  { id: "pain_custom", question: "опишіть конкретно свій біль або дискомфорт", type: "text", required: true },
  { id: "health_issues", question: "Чи є у вас проблеми зі здоров'ям, якщо так, то опишіть конкретно які", type: "text", required: false },

  {
    id: "current_mattress",
    question: "На якому матраці Ви спите зараз?",
    type: "radio",
    options: ["пружинний", "безпружинний", "інше (впишіть)"],
    required: true,
  },
  { id: "current_mattress_name", question: "Якщо знаєте назву – впишіть", type: "text", required: false },

  {
    id: "dissatisfaction",
    question: "Що саме вас не влаштовує в матраці на якому спите зараз",
    type: "radio",
    options: [
      "просів",
      "твердий",
      "м'який",
      "просто не зручний",
      "провалююсь",
      "свій варіант",
    ],
    required: true,
  },
  {
    id: "firmness",
    question: "Вам зручніше спати на м'якому чи твердому?",
    type: "radio",
    options: ["м’який", "твердий", "мабуть середній"],
    required: true,
  },
  {
    id: "pillow",
    question: "На якій подушці любите спати?",
    type: "radio",
    options: ["меморі", "пух", "висока", "маленька", "сплю без подушки"],
    required: true,
  },
  {
    id: "base",
    question: "На чому має лежати матрац",
    type: "radio",
    options: [
      "ламельний каркас",
      "тверда основа ліжка",
      "на іншому матраці",
      "на підлозі",
    ],
    required: true,
  },
  {
    id: "spring_pref",
    question: "Віддаєте перевагу пружинним чи безпружинним?",
    type: "radio",
    options: ["тільки пружинні", "тільки безпружинні", "головне щоб комфортно було"],
    required: true,
  },
  { id: "adult_extra", question: "Особливості Вашого тіла, або Ваші запитання", type: "text", required: false },

  // Дитина
  { id: "child_age", question: "Скільки років дитині", type: "number", required: true },
  { id: "child_weight", question: "Яка вага дитини (кг)", type: "number", required: true },
  { id: "child_height", question: "Який зріст дитини (см)", type: "number", required: true },
  {
    id: "child_health",
    question: "Чи є у дитини проблеми зі здоров'ям?",
    type: "radio",
    options: ["ні", "сколіоз", "лордоз", "кіфоз", "викривлення спини", "інше (пропишіть)"],
    required: true,
  },
  { id: "child_health_other", question: "Вкажіть точний діагноз", type: "text", required: false },
  {
    id: "child_current_mattress",
    question: "На чому спить дитина зараз?",
    type: "radio",
    options: ["пружинний", "безпружинний", "диван", "люлька", "інше (впишіть)"],
    required: true,
  },
  { id: "child_current_name", question: "Назва/модель (за бажанням)", type: "text", required: false },
  {
    id: "child_dissatisfaction",
    question: "що конкретно не влаштовує зараз під час сну",
    type: "radio",
    options: ["просів", "твердий", "м'який", "дитині не зручний", "свій варіант", "далі"],
    required: true,
  },
  {
    id: "child_base",
    question: "На чому має лежати матрац",
    type: "radio",
    options: [
      "ламельний каркас",
      "тверда основа ліжка",
      "на іншому матраці",
      "на підлозі",
    ],
    required: true,
  },
  { id: "child_extra", question: "Особливості дитини / запитання (необов'язково)", type: "text", required: false },
]

export interface UserData {
  name: string
  phone: string
  city: string
}

export interface SurveyResponse {
  userData: UserData
  answers: Record<string, string>
  timestamp: string
}
