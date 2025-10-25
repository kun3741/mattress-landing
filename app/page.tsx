"use client"

import React, { useState } from "react"
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
  const benefitsSection = useContentSection('benefitsSection')
  const partners = useContentSection('partners')
  const contacts = useContentSection('contacts')
  const cta = useContentSection('cta')
  const factories = useContentSection('factories')
  const navigation = useContentSection('navigation')
  const footer = useContentSection('footer')
  const infoDialogs = useContentSection('infoDialogs')

  // Handle survey opening from video section
  React.useEffect(() => {
    const handleOpenSurvey = () => setSurveyOpen(true)
    window.addEventListener('openSurvey', handleOpenSurvey)
    return () => window.removeEventListener('openSurvey', handleOpenSurvey)
  }, [])

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
    <GradientAnimation className="min-h-screen relative luxury-gradient">
      {/* Background brands icons */}
      <BrandsBackground />

      {/* Floating sleep elements for decoration */}
      {/* <FloatingSleepElements /> */}
      
      {/* Background pattern */}
      <SleepPattern />
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <ScrollAnimation animation="fadeUp" delay={100}>
          <div className="container mx-auto px-4 py-2 md:py-3 flex justify-between items-center">
            <ScrollAnimation animation="fadeUp" delay={100}>
              <div className="h-8 md:h-10 flex items-center">
                <Image
                  src="/1 logo 10.png"
                  alt="Підбір матрацу — логотип"
                  width={150}
                  height={40}
                  className="h-8 md:h-10 w-auto"
                  priority
                />
              </div>
            </ScrollAnimation>

            <nav className="hidden md:flex gap-4">
              <ButtonHover>
                <Button variant="ghost" size="sm" onClick={() => openInfoDialog("benefits")} className="whitespace-normal text-center leading-tight">
                  {navigation?.benefits || "Переваги"}
                </Button>
              </ButtonHover>
              <ButtonHover>
                <Button variant="ghost" size="sm" onClick={() => openInfoDialog("factories")} className="whitespace-normal text-center leading-tight">
                  {navigation?.partners || "Партнери"}
                </Button>
              </ButtonHover>
              <ButtonHover>
                <Button variant="ghost" size="sm" onClick={() => openInfoDialog("contacts")} className="whitespace-normal text-center leading-tight">
                  {navigation?.contacts || "Контакти"}
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
                    <Button variant="ghost" className="justify-start whitespace-normal text-left leading-tight" onClick={() => openInfoDialog("benefits")}>
                      {navigation?.benefits || "Переваги"}
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start whitespace-normal text-left leading-tight" onClick={() => openInfoDialog("factories")}>
                      {navigation?.partners || "Партнери"}
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start whitespace-normal text-left leading-tight" onClick={() => openInfoDialog("contacts")}>
                      {navigation?.contacts || "Контакти"}
                    </Button>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </ScrollAnimation>
      </header>

      {/* Hero Section with Video */}
      <section className="container mx-auto px-4 py-6 md:py-2 lg:py-2">
        <div className="max-w-6xl mx-auto">
          {/* Mobile title - shown only on mobile */}
          <div className="block lg:hidden text-center mb-6">
            <ScrollAnimation animation="fadeUp" delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold text-balance leading-tight">
                {hero?.title || "Ідеальний підбір матрацу за 5хв"} ✨
              </h2>
            </ScrollAnimation>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left space-y-4 md:space-y-6 order-2 lg:order-1">
              {/* Desktop title - hidden on mobile */}
              <div className="hidden lg:block">
                <ScrollAnimation animation="fadeUp" delay={100}>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                    {hero?.title || "Ідеальний підбір матрацу за 5хв"} ✨
                  </h2>
                </ScrollAnimation>
              </div>
              
              <ScrollAnimation animation="fadeUp" delay={200}>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto lg:mx-0 px-2">
                  {hero?.subtitle || "Професійний алгоритмічний підбір матрацу з урахуванням ваших індивідуальних особливостей. Програма \"Тарас\" рекомендує лише ті матраци які підійдуть Вам. Не рекламуючи жодного конкретного виробника."}
                </p>
              </ScrollAnimation>

            </div>

            {/* Right side - Video */}
            <div className="order-1 lg:order-2">
              <VideoDescriptionToggle 
                onSurveyOpen={() => setSurveyOpen(true)}
                ctaButtonText={hero?.ctaButton || "Підібрати матрац за допомогою програми"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sleep divider */}
      <div className="my-4 md:my-2">
        <SleepDivider />
      </div>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-6 md:py-2">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation animation="fadeUp" delay={100}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-4 text-balance px-2">
              {benefitsSection?.title || "Чому варто довірити підбір нам?"}
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

      {/* Call-to-Action Section after Benefits */}
      <section className="container mx-auto px-4 py-8 md:py-4">
        <ScrollAnimation animation="scale" delay={100}>
          <div className="max-w-4xl mx-auto luxury-border rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-center space-y-3 md:space-y-4 premium-shadow bg-white/90 backdrop-blur-sm">
            <ScrollAnimation animation="fadeUp" delay={200}>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                {cta?.title || "Готові розпочати підбір матрацу?"} 🌙
              </h3>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeUp" delay={300}>
              <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto px-2">
                {cta?.subtitle || "Серед тисячі ймовірних варіантів матраців програма \"Тарас\" зменшить кількість до 5-ти. А наш менеджер допоможе зробити остаточний вибір. Довірте свій сон професіоналам і супер програмі \"Тарас\""}
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="scale" delay={400}>
              <ButtonHover>
                <Button
                  size="lg"
                  className="text-base md:text-lg px-6 py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto premium-shadow gold-accent text-white font-semibold animate-mattress-bounce hover:opacity-90 transition-opacity whitespace-normal text-center leading-tight"
                  onClick={() => setSurveyOpen(true)}
                >
                  {cta?.button || "Підібрати матрац за допомогою програми"}
                </Button>
              </ButtonHover>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
      </section>

      {/* Sleep divider */}
      <SleepDivider />

      {/* Partners Section */}
      <PartnersSection />

      {/* Sleep divider */}
      <SleepDivider />

      {/* Survey Modal */}
      <SurveyModal open={surveyOpen} onOpenChange={setSurveyOpen} />

      {/* Info Dialogs */}
      <InfoDialog
        open={infoDialog.open && infoDialog.type === "benefits"}
        onOpenChange={closeInfoDialog}
        title={infoDialogs?.benefits?.title || "Переваги нашої програми"}
        content={
          <div className="space-y-4">
            {(infoDialogs?.benefits?.content || [
              { title: "Економія часу", description: "Замість того, щоб витрачати дні на відвідування магазинів і вивчення характеристик, ви отримаєте персональні рекомендації за 5 хвилин." },
              { title: "Професійний алгоритм", description: "Наш алгоритм враховує вашу вагу, зріст, позу сну, проблеми зі здоров'ям та інші важливі фактори для ідеального підбору." },
              { title: "Широкий вибір", description: "Програма не рекомендує конкретного виробника. Тип матрацу і фірма обираються виключно по Ваших характеристиках" },
              { title: "Експертна підтримка", description: "Після тесту з вами зв'яжеться наш експерт, який відповість на всі питання та допоможе зробити остаточний вибір." }
            ]).map((item, index) => {
              const icons = [Clock, CheckCircle2, Factory, Users]
              const IconComponent = icons[index] || CheckCircle2
              return (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-primary" />
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        }
      />

      <InfoDialog
        open={infoDialog.open && infoDialog.type === "factories"}
        onOpenChange={closeInfoDialog}
        title={infoDialogs?.partners?.title || "Наші партнери"}
        content={
          <div className="px-6 md:px-8">
            <p className="text-muted-foreground">
              {infoDialogs?.partners?.description || "Ми співпрацюємо з провідними фабриками та брендами матраців — наші партнери допомагають пропонувати найкращі рішення для будь-якого бюджету."}
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
        title={infoDialogs?.contacts?.title || "Контактна інформація"}
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
              {contacts?.address && contacts.address.trim() && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Адреса</p>
                    <p className="text-muted-foreground">{contacts.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* Bottom CTA Section */}
      <section className="container mx-auto px-4 py-8 md:py-10">
        <ScrollAnimation animation="scale" delay={100}>
          <div className="max-w-4xl mx-auto luxury-border rounded-xl md:rounded-2xl p-6 md:p-8 text-center space-y-4 premium-shadow bg-white/90 backdrop-blur-sm">
            <ScrollAnimation animation="fadeUp" delay={200}>
              <h3 className="text-2xl md:text-3xl font-bold">
                Готові знайти ідеальний матрац? 🌙
              </h3>
            </ScrollAnimation>
            <ScrollAnimation animation="scale" delay={300}>
              <ButtonHover>
                <Button
                  size="lg"
                  className="text-base md:text-lg px-6 py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto premium-shadow gold-accent text-white font-semibold animate-mattress-bounce hover:opacity-90 transition-opacity whitespace-normal text-center leading-tight"
                  onClick={() => setSurveyOpen(true)}
                >
                  Підібрати матрац за допомогою програми
                </Button>
              </ButtonHover>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
      </section>

      {/* Footer */}
      <ContactsFooter />
    </GradientAnimation>
  )
}
