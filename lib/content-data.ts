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
  }
  benefits: Array<{
    title: string
    description: string
  }>
  cta: {
    title: string
    subtitle: string
  }
  contacts: {
    phone: string
    email: string
    address: string
  }
  factories: Array<{
    name: string
    logo: string
  }>
  seo: {
    title: string
    description: string
    keywords: string
  }
}

export const defaultContent: SiteContent = {
  hero: {
    title: "Знайдіть ідеальний матрац за 5 хвилин",
    subtitle:
      "Професійний алгоритмічний підбір матрацу з урахуванням ваших індивідуальних особливостей. Співпраця з 12 провідними фабриками України.",
    ctaButton: "Пройти тест і отримати підбір матрацу",
  },
  video: {
    title: "Як працює наша програма підбору?",
    url: "",
  },
  benefits: [
    {
      title: "Економія часу",
      description: "Не потрібно витрачати години на пошук ідеального матрацу",
    },
    {
      title: "Професійний підбір",
      description: "Алгоритм враховує ваші індивідуальні особливості",
    },
    {
      title: "12 фабрик-партнерів",
      description: "Доступ до найкращих виробників матраців в Україні",
    },
    {
      title: "Експертна консультація",
      description: "Персональні рекомендації від фахівців",
    },
  ],
  cta: {
    title: "Готові знайти свій ідеальний матрац?",
    subtitle: "Пройдіть швидкий тест, і наш експерт зв'яжеться з вами з персональними рекомендаціями",
  },
  contacts: {
    phone: "+380 XX XXX XX XX",
    email: "info@mattress-selection.ua",
    address: "Київ, Україна",
  },
  factories: [
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
    { name: 'Adormo', logo: '/logo-2-400x164.png' },
    { name: 'Belsonno Pure', logo: '/logo-belsonno-pure-01-1-150x37.png' },
    { name: 'Artist', logo: '/logo-kolektsii-dlya-sajtu.150x100.jpg' },
    { name: 'Magniflex', logo: '/logo-magniflex.png' },
  ],
  seo: {
    title: "Підбір Матрацу | Taras",
    description:
      "Знайдіть ідеальний матрац за 5 хвилин. Професійний алгоритмічний підбір з урахуванням ваших індивідуальних особливостей. Співпраця з 12 провідними фабриками України.",
    keywords: "підбір матрацу, купити матрац, матраці україна, ортопедичний матрац, консультація матрац",
  },
}
