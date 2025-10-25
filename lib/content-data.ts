// Content management data structure
export interface SiteContent {
  hero: {
    title: string
    subtitle: string
    ctaButton: string
  }
  video: {
    title: string
    url: string
    description: string
    ctaTitle: string
    ctaButton: string
    ctaSubtitle: string
  }
  benefits: Array<{
    title: string
    description: string
  }>
  benefitsSection: {
    title: string
  }
  partners: {
    title: string
    subtitle: string
  }
  cta: {
    title: string
    subtitle: string
    button: string
  }
  contacts: {
    phone: string
    email: string
    address: string
  }
  factories: Array<{
    name: string
    logo: string
    isPriority?: boolean
  }>
  navigation: {
    benefits: string
    partners: string
    contacts: string
  }
  footer: {
    copyright: string
    benefits: string
    partners: string
    contacts: string
  }
  infoDialogs: {
    benefits: {
      title: string
      content: Array<{
        title: string
        description: string
      }>
    }
    partners: {
      title: string
      description: string
    }
    contacts: {
      title: string
    }
  }
  seo: {
    title: string
    description: string
    keywords: string
  }
}

export const defaultContent: SiteContent = {
  hero: {
    title: "Ідеальний підбір матрацу за 5хв",
    subtitle:
      "Професійний алгоритмічний підбір матрацу з урахуванням ваших індивідуальних особливостей. Програма \"Тарас\" рекомендує лише ті матраци які підійдуть Вам. Не рекламуючи жодного конкретного виробника.",
    ctaButton: "Підібрати матрац за допомогою програми",
  },
  video: {
    title: "Як працює наша програма підбору?",
    url: "",
    description: `Вітаю мене звати Тарас! 🎬

Я унікальна програма, яка створена для правильного підбору матраців.

Як це працює?

Все дуже просто! Натисніть кнопку підібрати матрац та дайте відповіді на запитання і по Вашим параметрам і бюджету я оберу для Вас ідеальний матрац від кращих виробників України, Туреччини, Італії, Німеччини, Іспанії, Румунії.

Я створений, щоб зберегти Ваш час і допомогти виспатися на всі 100%

Мене створювали люди з величезним досвідом та знаннями. Враховується кожна деталь.

Це унікальна технологія яка допомагає швидко і головне ідеально правильно обрати модель матрацу яка підійде саме Вам, або Вашій дитині чи батькам.

Незалежно від фірми чи країни виробника.

Просто, швидко і головне ефективно!

Тож тисни підібрати матрац , бо я вже готовий працювати.`,
    ctaTitle: "Готові розпочати підбір матрацу?",
    ctaButton: "Підібрати матрац за допомогою програми 🛏️",
    ctaSubtitle: "Безкоштовна консультація • Без зобов'язань",
  },
  benefits: [
    {
      title: "Економія часу",
      description: "Замість того, щоб витрачати дні на відвідування магазинів і вивчення характеристик, ви отримаєте персональні рекомендації за 5 хвилин.",
    },
    {
      title: "Професійний алгоритм",
      description: "Наш алгоритм враховує вашу вагу, зріст, позу сну, проблеми зі здоров'ям та інші важливі фактори для ідеального підбору.",
    },
    {
      title: "Широкий вибір",
      description: "Програма не рекомендує конкретного виробника. Тип матрацу і фірма обираються виключно по Ваших характеристиках",
    },
    {
      title: "Експертна підтримка",
      description: "Після тесту з вами зв'яжеться наш експерт, який відповість на всі питання та допоможе зробити остаточний вибір.",
    },
  ],
  benefitsSection: {
    title: "Чому варто довірити підбір нам?",
  },
  partners: {
    title: "Співпраця з фабриками України та Європи",
    subtitle: "Перевірені фабрики-партнери, з якими ми працюємо",
  },
  cta: {
    title: "Готові розпочати підбір матрацу?",
    subtitle: "Серед тисячі ймовірних варіантів матраців програма \"Тарас\" зменшить кількість до 5-ти. А наш менеджер допоможе зробити остаточний вибір. Довірте свій сон професіоналам і супер програмі \"Тарас\"",
    button: "Підібрати матрац за допомогою програми",
  },
  contacts: {
    phone: "+380 XX XXX XX XX",
    email: "info@mattress-selection.ua",
    address: "Київ, Україна",
  },
  factories: [
    { name: 'Adormo', logo: '/logo-2-400x164.png', isPriority: true },
    { name: 'Magniflex', logo: '/logo-magniflex.png', isPriority: true },
    { name: 'Artist', logo: '/logo-kolektsii-dlya-sajtu.150x100.jpg', isPriority: true },
    { name: 'Come-for', logo: '/come-for.png' },
    { name: 'EMM', logo: '/emm.150x100.jpg' },
    { name: 'Evolution', logo: '/evolution_2024.150x100.jpg' },
    { name: 'BRN', logo: '/fabrika_brn-o7uhcpocfs6s1sa5b6n2l3usbvnih4qa43kodvvg9s.png' },
    { name: 'Fashion', logo: '/fashion_logo.150x100.jpg' },
    { name: 'FDM', logo: '/FDM big.png' },
    { name: 'BlueMarine', logo: '/k1-200x120.png' },
    { name: 'Noble', logo: '/k6-200x120.png' },
    { name: 'Zephyr', logo: '/k8-200x120.png' },
    { name: 'Karib', logo: '/karib.png' },
    { name: 'Keiko', logo: '/keiko-col-main-200x120.png' },
    { name: 'Arabeska', logo: '/logo_arabeska_150x100.150x100.png' },
    { name: 'Belsonno', logo: '/logo_belsonno_150x100.150x100.png' },
    { name: 'Palmera', logo: '/logo_palmera.150x100.jpg' },
    { name: 'Matro Lux', logo: '/Logo_ukr.jpg' },
    { name: 'Belsonno Pure', logo: '/logo-belsonno-pure-01-1-150x37.png' },
  ],
  navigation: {
    benefits: "Переваги",
    partners: "Партнери",
    contacts: "Контакти",
  },
  footer: {
    copyright: "© 2025 Підбір Матрацу. Всі права захищені. 💤",
    benefits: "Переваги",
    partners: "Партнери",
    contacts: "Контакти",
  },
  infoDialogs: {
    benefits: {
      title: "Переваги нашої програми",
      content: [
        {
          title: "Економія часу",
          description: "Замість того, щоб витрачати дні на відвідування магазинів і вивчення характеристик, ви отримаєте персональні рекомендації за 5 хвилин."
        },
        {
          title: "Професійний алгоритм",
          description: "Наш алгоритм враховує вашу вагу, зріст, позу сну, проблеми зі здоров'ям та інші важливі фактори для ідеального підбору."
        },
        {
          title: "Широкий вибір",
          description: "Програма не рекомендує конкретного виробника. Тип матрацу і фірма обираються виключно по Ваших характеристиках"
        },
        {
          title: "Експертна підтримка",
          description: "Після тесту з вами зв'яжеться наш експерт, який відповість на всі питання та допоможе зробити остаточний вибір."
        }
      ]
    },
    partners: {
      title: "Наші партнери",
      description: "Ми співпрацюємо з провідними фабриками та брендами матраців — наші партнери допомагають пропонувати найкращі рішення для будь-якого бюджету."
    },
    contacts: {
      title: "Контактна інформація",
    }
  },
  seo: {
    title: "Підбір Матрацу | Програма Тарас",
    description:
      "Ідеальний підбір матрацу за 5хв. Програма \"Тарас\" рекомендує лише ті матраци які підійдуть Вам. Не рекламуючи жодного конкретного виробника.",
    keywords: "підбір матрацу, купити матрац, матраці україна, ортопедичний матрац, консультація матрац, програма тарас",
  },
}
