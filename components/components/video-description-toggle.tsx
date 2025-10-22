"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/css-animations"
import { useIsMobile } from "@/hooks/use-mobile"
import { Video, BookOpen, Play, Pause } from "lucide-react"

interface VideoDescriptionToggleProps {
  onSurveyOpen?: () => void
  ctaButtonText?: string
}

export function VideoDescriptionToggle({ onSurveyOpen, ctaButtonText }: VideoDescriptionToggleProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [content, setContent] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch('/api/content')
        const contentData = await response.json()
        setContent(contentData)
      } catch (error) {
        console.error('Failed to load content:', error)
      }
    }
    
    loadContent()
  }, [])

  const handlePlay = () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = false
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error)
          setVideoError(true)
        })
        setIsPlaying(true)
      } catch (e) {
        console.error('Error in handlePlay:', e)
        setVideoError(true)
      }
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause()
        setIsPlaying(false)
      } catch (e) {
        console.error('Error in handlePause:', e)
      }
    }
  }
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e)
    console.error('Video error details:', {
      error: e.currentTarget.error,
      networkState: e.currentTarget.networkState,
      readyState: e.currentTarget.readyState,
      src: e.currentTarget.currentSrc
    })
    setVideoError(true)
  }

  const retryVideo = () => {
    setVideoError(false)
    if (videoRef.current) {
      // Очищуємо джерела та перезавантажуємо
      videoRef.current.load()
      // Додаємо невелику затримку перед спробою відтворення
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error)
        }
      }, 100)
    }
  }

  return (
    <div className="w-full">
      <ScrollAnimation animation="fadeUp" delay={100}>
        <div className="bg-white/90 backdrop-blur-sm luxury-border rounded-xl md:rounded-2xl premium-shadow overflow-hidden">          {/* Video Container */}
          <div className="relative aspect-[16/9] md:aspect-[3/4] bg-gray-100 max-w-full md:max-w-[280px] mx-auto md:mt-4">
            {videoError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center space-y-4">
                  <Video className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500">Відео тимчасово недоступне</p>                  <button 
                    onClick={retryVideo}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Спробувати знову
                  </button>
                </div>
              </div>
            ) : (
              <>                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={isMobile ? "/preview-pc.png" : "/preview-mobile.png"}
                  onError={handleVideoError}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  preload="metadata"
                  playsInline
                  webkit-playsinline="true"
                  x-webkit-airplay="allow"
                  controls={false}
                  muted
                  crossOrigin="anonymous">{isMobile ? (
                    <>
                      <source src="/video-pc.mp4" type="video/mp4" />
                      <source src="/taras-intro.mp4" type="video/mp4" />
                    </>
                  ) : (
                    <>
                      <source src="/video-mobile.mp4" type="video/mp4" />
                      <source src="/taras-intro.mp4" type="video/mp4" />
                      <source src="/taras-intro.webm" type="video/webm" />
                    </>
                  )}
                  Ваш браузер не підтримує відео.
                </video>
                {!isPlaying && (
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                    aria-label="Відтворити відео"
                  >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </button>
                )}
                {isPlaying && (
                  <button
                    onClick={handlePause}
                    className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center"
                    aria-label="Пауза"
                  >
                    <Pause className="w-5 h-5 text-primary" />
                  </button>
                )}
              </>
            )}
          </div>
          
          {/* Video Caption */}
          <div className="p-3 md:p-4 text-center space-y-2">
            <h3 className="text-lg md:text-xl font-bold">
              {content?.video?.ctaTitle || "Як працює наша програма підбору?"}
            </h3>
            
            <p className="text-sm md:text-base text-muted-foreground">
              {content?.video?.ctaSubtitle || "Подивіться коротке відео і дізнайтесь, як за 5 хвилин знайти ідеальний матрац для себе."}
            </p>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDescription(!showDescription)}
              className="text-primary hover:text-primary/80 whitespace-normal text-center leading-tight"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {showDescription ? "Приховати опис" : "Читати повний опис"}
            </Button>
            
            {/* CTA Button in video block */}
            {onSurveyOpen && ctaButtonText && (
              <div className="mt-4">
                <Button
                  size="lg"
                  className="text-base px-6 py-5 h-auto w-full premium-shadow gold-accent text-white font-semibold animate-mattress-bounce hover:opacity-90 transition-opacity whitespace-normal text-center leading-tight"
                  onClick={onSurveyOpen}
                >
                  {ctaButtonText}
                </Button>
              </div>
            )}
            
            {showDescription && (
              <div className="mt-6 pt-6 border-t">
                <div className="prose prose-sm max-w-none text-justify">
                  {(content?.video?.description || `Вітаю мене звати Тарас! 🎬

Якщо ви дивитесь це відео, то ви вже на правильному шляху до знаходження свого ідеального матрацу! 

За 5 хвилин я покажу вам, як працює наша унікальна програма підбору матрацу, яка враховує всі ваші індивідуальні особливості.

🔍 Що ми робимо:
• Аналізуємо вашу вагу, зріст та сон
• Враховуємо медичні показання
• Підбираємо оптимальну жорсткість
• Вибираємо найкращий матеріал

💡 Чому це працює:
Наша програма розроблена спільно з лікарями-ортопедами та базується на 15-річному досвіді роботи з матрацами.

🎯 Результат:
Ви отримаєте персональні рекомендації від нашого експерта, який зв'яжеться з вами протягом 24 годин.

Готові розпочати? Натисніть кнопку нижче та пройдіть швидкий тест!`).split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollAnimation>
    </div>
  )
}