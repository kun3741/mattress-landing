"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SurveyModal } from "@/components/survey-modal"
import { InfoDialog } from "@/components/info-dialog"
import { PartnersSection } from "@/components/partners-section"
import { VideoDescriptionToggle } from "@/components/video-description-toggle"
import { BrandsBackground } from "@/components/brands-background"
import { ContactsFooter } from "@/components/contacts-footer"
import { ContentProvider, useContent, useContentSection } from "@/components/content-provider"
import { 
  ScrollAnimation, 
  ButtonHover, 
  WaveAnimation,
  GradientAnimation
} from "@/components/css-animations"
import { 
  // FloatingSleepElements, 
  SleepDivider, 
  SleepPattern 
} from "@/components/sleep-elements"
import { CheckCircle2, Clock, Users, Factory, Phone, Mail, MapPin, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { SheetClose } from "@/components/ui/sheet"

export default function Home() {
  return (
    <ContentProvider>
      <HomePage />
    </ContentProvider>
  )
}

function HomePage() {
  const [surveyOpen, setSurveyOpen] = useState(false)
  const [infoDialog, setInfoDialog] = useState<{ open: boolean; type: "benefits" | "factories" | "contacts" | null }>({
    open: false,
    type: null,
  })
  
  const { content, isLoading } = useContent()
  const hero = useContentSection('hero')
  const benefits = useContentSection('benefits')
  const contacts = useContentSection('contacts')
  const cta = useContentSection('cta')
  const factories = useContentSection('factories')

  // Icon mapping for benefits
  const benefitIcons = [Clock, CheckCircle2, Factory, Users]

  const openInfoDialog = (type: "benefits" | "factories" | "contacts") => {
    setInfoDialog({ open: true, type })
  }

  const closeInfoDialog = () => {
    setInfoDialog({ open: false, type: null })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-purple-50/20 to-pink-50/30">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-[500px] mx-auto" />
            <Skeleton className="h-12 w-64 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <GradientAnimation className="min-h-screen relative">
      {/* Background brands icons */}
      <BrandsBackground />

      {/* Floating sleep elements for decoration */}
      {/* <FloatingSleepElements /> */}
      
      {/* Background pattern */}
      <SleepPattern />
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <ScrollAnimation animation="fadeUp" delay={100}>
          <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
            <ScrollAnimation animation="fadeUp" delay={100}>
              <div className="h-8 md:h-9 flex items-center">
                <Image
                  src="/1 logo 10.png"
                  alt="Підбір матрацу — логотип"
                  width={140}
                  height={36}
                  className="h-8 md:h-9 w-auto"
                  priority
                />
              </div>
            </ScrollAnimation>

            <nav className="hidden md:flex gap-4">
              <ButtonHover>
                <Button variant="ghost" size="sm" onClick={() => openInfoDialog("benefits")}>
                  Переваги
                </Button>
              </ButtonHover>
              <ButtonHover>
                <Button variant="ghost" size="sm" onClick={() => openInfoDialog("factories")}>
                  Партнери
                </Button>
              </ButtonHover>
              <ButtonHover>
                <Button variant="ghost" size="sm" onClick={() => openInfoDialog("contacts")}>
                  Контакти
                </Button>
              </ButtonHover>
            </nav>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" aria-label="Відкрити меню">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent aria-label="Мобільне меню">
                <nav className="flex flex-col gap-4 mt-8">
                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start" onClick={() => openInfoDialog("benefits")}>
                      Переваги
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start" onClick={() => openInfoDialog("factories")}>
                      Партнери
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start" onClick={() => openInfoDialog("contacts")}>
                      Контакти
                    </Button>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </ScrollAnimation>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <ScrollAnimation animation="fadeUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                {hero?.title || "Знайдіть ідеальний матрац за 5 хвилин"} ✨
              </h2>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fadeUp" delay={200}>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-2">
                {hero?.subtitle || "Професійний алгоритмічний підбір матрацу з урахуванням ваших індивідуальних особливостей."}
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation animation="scale" delay={300}>
              <ButtonHover>
                <Button
                  size="lg"
                  className="text-base md:text-lg px-6 py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto shadow-lg animate-mattress-bounce"
                  onClick={() => setSurveyOpen(true)}
                >
                  {hero?.ctaButton || "Пройти тест і отримати підбір матрацу"} 🛏️
                </Button>
              </ButtonHover>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fadeUp" delay={400}>
              <p className="text-xs md:text-sm text-muted-foreground">Безкоштовна консультація • Без зобов'язань</p>
            </ScrollAnimation>
          </div>
        </section>

      {/* Sleep divider */}
      <SleepDivider />

      {/* Video Section */}
      <VideoDescriptionToggle />

      {/* Sleep divider */}
      <SleepDivider />

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation animation="fadeUp" delay={100}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-balance px-2">
              Чому варто довірити підбір нам?
            </h3>
          </ScrollAnimation>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {benefits?.map((benefit, index) => {
              const IconComponent = benefitIcons[index] || CheckCircle2
              return (
                <WaveAnimation key={index} index={index} className="h-full">
                  <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 space-y-3 h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center animate-peaceful-breathing">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-base md:text-lg">{benefit.title}</h4>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </WaveAnimation>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sleep divider */}
      <SleepDivider />

      {/* Partners Section */}
      <PartnersSection />

      {/* Sleep divider */}
      <SleepDivider />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <ScrollAnimation animation="scale" delay={100}>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-purple-100/50 to-pink-100/50 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 text-center space-y-4 md:space-y-6 shadow-lg">
            <ScrollAnimation animation="fadeUp" delay={200}>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                {cta?.title || "Готові знайти свій ідеальний матрац?"} 🌙
              </h3>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeUp" delay={300}>
              <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto px-2">
                {cta?.subtitle || "Пройдіть швидкий тест, і наш експерт зв'яжеться з вами з персональними рекомендаціями"}
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="scale" delay={400}>
              <ButtonHover>
                <Button
                  size="lg"
                  className="text-base md:text-lg px-6 py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto shadow-lg animate-mattress-bounce"
                  onClick={() => setSurveyOpen(true)}
                >
                  Розпочати підбір зараз ✨
                </Button>
              </ButtonHover>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-12 md:mt-16">
        <ScrollAnimation animation="fadeUp" delay={100}>
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-xs md:text-sm text-muted-foreground">© 2025 Підбір Матрацу. Всі права захищені. 💤</p>
              <div className="flex gap-4">
                <ButtonHover>
                  <Button variant="ghost" size="sm" onClick={() => openInfoDialog("contacts")}>
                    Контакти
                  </Button>
                </ButtonHover>
                <ButtonHover>
                  <Button variant="ghost" size="sm" onClick={() => openInfoDialog("factories")}>
                    Партнери
                  </Button>
                </ButtonHover>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </footer>

      {/* Survey Modal */}
      <SurveyModal open={surveyOpen} onOpenChange={setSurveyOpen} />

      {/* Info Dialogs */}
      <InfoDialog
        open={infoDialog.open && infoDialog.type === "benefits"}
        onOpenChange={closeInfoDialog}
        title="Переваги нашої програми"
        content={
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Економія часу
              </h4>
              <p className="text-muted-foreground">
                Замість того, щоб витрачати дні на відвідування магазинів і вивчення характеристик, ви отримаєте
                персональні рекомендації за 5 хвилин.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Професійний алгоритм
              </h4>
              <p className="text-muted-foreground">
                Наш алгоритм враховує вашу вагу, зріст, позу сну, проблеми зі здоров'ям та інші важливі фактори для
                ідеального підбору.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Factory className="w-5 h-5 text-primary" />
                Широкий вибір
              </h4>
              <p className="text-muted-foreground">
                Співпраця з 12 провідними фабриками дає доступ до сотень моделей матраців різних цінових категорій.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Експертна підтримка
              </h4>
              <p className="text-muted-foreground">
                Після тесту з вами зв'яжеться наш експерт, який відповість на всі питання та допоможе зробити остаточний
                вибір.
              </p>
            </div>
          </div>
        }
      />

      <InfoDialog
        open={infoDialog.open && infoDialog.type === "factories"}
        onOpenChange={closeInfoDialog}
        title="Наші партнери"
        content={
          <div className="px-6 md:px-8">
            <p className="text-muted-foreground">
              Ми співпрацюємо з провідними фабриками та брендами матраців — наші партнери допомагають пропонувати найкращі рішення для будь-якого бюджету.
            </p>
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {(factories || [])
                  .filter((f) => f && f.logo !== "/1 logo 10.png" && (f.name || "").toLowerCase() !== "brand 1")
                  .map((factory, idx) => (
                    <div key={idx} className="rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center min-h-28">
                      <div className="relative w-20 h-12 mb-2 opacity-80">
                        {factory.logo ? (
                          <Image src={factory.logo} alt={factory.name} fill className="object-contain" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">LOGO</div>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 text-center line-clamp-2">{factory.name}</div>
                    </div>
                ))}
                {(!factories || factories.length === 0) && (
                  Array.from({ length: 12 }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="rounded-xl border bg-white p-4 min-h-28 flex items-center justify-center text-muted-foreground text-sm">
                      Фабрика {i + 1}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        }
      />

      <InfoDialog
        open={infoDialog.open && infoDialog.type === "contacts"}
        onOpenChange={closeInfoDialog}
        title="Контактна інформація"
        content={
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Телефон</p>
                  <p className="text-muted-foreground">{contacts?.phone || "+380 XX XXX XX XX"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">{contacts?.email || "info@mattress-selection.ua"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Адреса</p>
                  <p className="text-muted-foreground">{contacts?.address || "Київ, Україна"}</p>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* Footer */}
      <ContactsFooter />
    </GradientAnimation>
  )
}
