"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/css-animations"
import { Video, BookOpen } from "lucide-react"

const tarasDescription = `Вітаю мене звати Тарас! 🎬

Я унікальна програма, яка створена для правильного підбору матраців.

Як це працює?

Все дуже просто! Натисніть кнопку підібрати матрац та дайте відповіді на запитання і по Вашим параметрам і бюджету я оберу для Вас ідеальний матрац від кращих виробників України, Туреччини, Італії, Німеччини, Іспанії, Румунії.

Я створений, щоб зберегти Ваш час і допомогти виспатися на всі 100%

Мене створювали люди з величезним досвідом та знаннями. Враховується кожна деталь.

Це унікальна технологія яка допомагає швидко і головне ідеально правильно обрати модель матрацу яка підійде саме Вам, або Вашій дитині чи батькам.

Незалежно від фірми чи країни виробника.

Просто, швидко і головне ефективно!

Тож тисни підібрати матрац , бо я вже готовий працювати.`

export function VideoDescriptionToggle() {
  const [showDescription, setShowDescription] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = false
        void videoRef.current.play()
        setIsPlaying(true)
      } catch (e) {
        // ignore
      }
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause()
        setIsPlaying(false)
      } catch (e) {
        // ignore
      }
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-16" aria-label="Секція з відео та описом роботи програми">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation animation="scale" delay={100}>
          <div className="bg-white/90 backdrop-blur-sm luxury-border rounded-xl md:rounded-2xl premium-shadow p-4 md:p-8 space-y-6 md:space-y-8">
            <ScrollAnimation animation="fadeUp" delay={200}>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-balance">
                Як працює наша програма підбору?
              </h3>
            </ScrollAnimation>
            
            {/* Content Layout: Text + Video + CTA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Text Content */}
              <div className="space-y-6 order-1 lg:order-1">
                <ScrollAnimation animation="fadeUp" delay={300}>
                  <div className="space-y-4">
                    <h4 className="text-xl md:text-2xl font-semibold text-gray-900">
                      Професійний підбір матрацу за 5 хвилин
                    </h4>
                    <div className="space-y-3 text-gray-700 leading-relaxed">
                      <p>
                        Наша унікальна програма створена для правильного підбору матраців з урахуванням ваших індивідуальних особливостей.
                      </p>
                      <p>
                        <strong>Як це працює?</strong> Все дуже просто! Дайте відповіді на запитання, і по ваших параметрах та бюджеті я оберу для вас ідеальний матрац від кращих виробників України, Туреччини, Італії, Німеччини, Іспанії, Румунії.
                      </p>
                      <p>
                        Я створений, щоб зберегти ваш час і допомогти виспатися на всі 100%. Це унікальна технологія, яка допомагає швидко і головне ідеально правильно обрати модель матрацу.
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Toggle between video and full description */}
                <ScrollAnimation animation="fadeUp" delay={400}>
                  <div className="flex justify-center lg:justify-start gap-3 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDescription(!showDescription)}
                      className="gap-2"
                    >
                      {showDescription ? (
                        <>
                          <Video className="w-4 h-4" />
                          Показати відео
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" />
                          Читати повний опис
                        </>
                      )}
                    </Button>
                  </div>
                </ScrollAnimation>

                {/* Full description when toggled */}
                {showDescription && (
                  <ScrollAnimation animation="fadeUp" delay={500}>
                    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg p-6 max-h-96 overflow-y-auto shadow-sm border border-blue-100/50">
                      <div className="space-y-3 text-gray-800 leading-relaxed font-medium text-sm md:text-base">
                        {tarasDescription.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="text-justify">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </ScrollAnimation>
                )}
              </div>

              {/* Video Content */}
              <div className="space-y-4 order-2 lg:order-2">
                <ScrollAnimation animation="fadeUp" delay={400}>
                  <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-[280px] md:max-w-[320px] lg:max-w-[280px] aspect-[9/16] bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden shadow-lg relative group border border-slate-300">
                      {/* Background pattern to mask low quality */}
                      <div className="absolute inset-0 opacity-3 pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(100,100,100,0.02)_25%,rgba(100,100,100,0.02)_50%,transparent_50%,transparent_75%,rgba(100,100,100,0.02)_75%,rgba(100,100,100,0.02))] bg-[length:40px_40px]"></div>
                      </div>

                      {/* Watermark/background effect */}
                      <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-4xl mb-1">🛏️</div>
                          <p className="text-[10px] font-bold text-slate-600 tracking-widest">TARAS</p>
                        </div>
                      </div>

                      {/* Video element or fallback */}
                      {!videoError ? (
                        <video
                          ref={videoRef}
                          className="w-full h-full object-contain bg-black"
                          playsInline
                          preload="metadata"
                          poster="/placevideo.jpg"
                          aria-label="Вступне відео про програму підбору матраців"
                          onError={() => setVideoError(true)}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                        >
                          {/* Try webm first if available, then mp4 */}
                          <source src="/taras-intro.webm" type="video/webm" />
                          <source src="/taras-intro.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                          <div className="text-center text-slate-600 text-xs px-4">
                            Відео тимчасово недоступне. Перевірте файл у папці public або завантажте напряму
                            {" "}
                            <a href="/taras-intro.mp4" className="underline" target="_blank" rel="noreferrer">/taras-intro.mp4</a>.
                          </div>
                        </div>
                      )}

                      {/* Play/Pause overlays */}
                      {!isPlaying && !videoError && (
                        <button
                          type="button"
                          onClick={handlePlay}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                          aria-label="Відтворити відео"
                        >
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-blue-600 fill-current ml-1" viewBox="0 0 24 24" aria-hidden>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </button>
                      )}
                      {isPlaying && !videoError && (
                        <button
                          type="button"
                          onClick={handlePause}
                          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center"
                          aria-label="Пауза"
                        >
                          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" aria-hidden>
                            <rect x="6" y="5" width="4" height="14" rx="1"></rect>
                            <rect x="14" y="5" width="4" height="14" rx="1"></rect>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>

            {/* CTA Section */}
            <ScrollAnimation animation="fadeUp" delay={500}>
              <div className="text-center space-y-4 pt-4 border-t border-gray-200">
                <p className="text-lg text-gray-700 font-medium">
                  Готові розпочати підбір матрацу?
                </p>
                <Button
                  size="lg"
                  className="text-base md:text-lg px-6 py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto premium-shadow gold-accent text-white font-semibold animate-mattress-bounce hover:opacity-90 transition-opacity"
                  onClick={() => {
                    // This will be handled by parent component
                    const event = new CustomEvent('openSurvey')
                    window.dispatchEvent(event)
                  }}
                >
                  Підібрати матрац за допомогою програми 🛏️
                </Button>
                <p className="text-sm text-muted-foreground">Безкоштовна консультація • Без зобов'язань</p>
              </div>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
