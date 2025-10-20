"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ScrollAnimation, 
  WaveAnimation, 
  LogoHover 
} from "@/components/css-animations"
import Image from "next/image"

interface Factory {
  name: string
  logo: string
}

// Helper mappings and utilities to infer proper partner names from logo file paths
const KNOWN_LOGO_NAME_MAP: Record<string, string> = {
  "/come-for.png": "Come-For",
  "/logo-magniflex.png": "Magniflex",
  "/emm.150x100.jpg": "EMM",
  "/evolution_2024.150x100.jpg": "Evolution",
  "/FDM big.png": "FDM",
  "/logo_arabeska_150x100.150x100.png": "Arabeska",
  "/logo_belsonno_150x100.150x100.png": "Belsonno",
  "/logo-belsonno-pure-01-1-150x37.png": "Belsonno",
  "/logo_palmera.150x100.jpg": "Palmera",
  "/fashion_logo.150x100.jpg": "Fashion",
  "/fabrika_brn-o7uhcpocfs6s1sa5b6n2l3usbvnih4qa43kodvvg9s.png": "BRN",
  "/keiko-col-main-200x120.png": "Keiko",
  "/karib.png": "Karib",
  "/k1-200x120.png": "BlueMarine",
  "/k6-200x120.png": "Noble",
  "/k8-200x120.png": "Zephyr",
}

const ACRONYMS = new Set(["EMM", "FDM", "BRN"])

function titleCaseWords(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const upper = w.toUpperCase()
      if (ACRONYMS.has(upper)) return upper
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    })
    .join(" ")
}

function guessNameFromLogoPath(logo?: string) {
  if (!logo) return ""
  const decoded = decodeURIComponent(logo)
  if (KNOWN_LOGO_NAME_MAP[decoded]) return KNOWN_LOGO_NAME_MAP[decoded]
  const base = decoded.split("/").pop() || ""
  let stem = base.replace(/\.[^.]+$/, "") // remove extension
  let lower = stem.toLowerCase()
  // strip known noise tokens and sizes
  lower = lower
    .replace(/\b(logo|pure|main|col|collection|kolektsii|dlya|sajtu|ukr|big)\b/g, " ")
    .replace(/\b\d+x\d+\b/g, " ")
    .replace(/[_\-]+/g, " ")
    .replace(/\b\d{1,4}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // Specific fixes from common filenames
  if (/\bcome\s*for\b/.test(lower)) return "Come-For"
  if (/\bbrn\b/.test(lower)) return "BRN"

  if (!lower) return ""
  const name = titleCaseWords(lower)
  return name
}

function getDisplayName(factory: Factory) {
  const raw = (factory.name || "").trim()
  const isPlaceholder = !raw || /^brand\s*\d*$/i.test(raw) || /^factory$/i.test(raw)
  if (!isPlaceholder) return raw
  const guessed = guessNameFromLogoPath(factory.logo)
  return guessed || raw || "Партнер"
}

export function PartnersSection() {
  const [factories, setFactories] = useState<Factory[]>([])
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    async function loadFactories() {
      try {
        const response = await fetch('/api/content')
        const contentData = await response.json()
        setContent(contentData)
        setFactories(contentData.factories || [])
      } catch (error) {
        console.error('Failed to load factories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFactories()
  }, [])

  // Prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <Skeleton className="h-16 w-24 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Include entries that have either a logo or a name; we'll derive names from logos when needed
  const validFactories = factories.filter(
    (factory) => (factory.logo && factory.logo.trim()) || (factory.name && factory.name.trim())
  )
  // Exclude the site logo (first/Brand 1)
  const partners = validFactories.filter(
    (f) => f && f.logo !== "/1 logo 10.png" && ((f.name || "").toLowerCase() !== "brand 1")
  )
  if (partners.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <ScrollAnimation animation="fadeUp" delay={100}>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              {content?.partners?.title || "Співпраця з фабриками України та Європи"}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {content?.partners?.subtitle || "Перевірені фабрики-партнери, з якими ми працюємо"}
            </p>
          </div>
        </ScrollAnimation>
        <div className="px-2 sm:px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {partners.map((factory, index) => {
              const displayName = getDisplayName(factory)
              return (
                <WaveAnimation key={index} index={index}>
                  <Card className="border-gray-100 hover:shadow-md transition-all duration-200 group h-full bg-gradient-to-br from-slate-50 to-slate-100" aria-label={displayName}>
                    <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center gap-3 h-auto min-h-32 md:min-h-36">
                      {factory.logo ? (
                        <LogoHover>
                          <div className="relative w-24 h-18 sm:w-28 sm:h-20 md:w-32 md:h-24 lg:w-36 lg:h-28 mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Image
                              src={factory.logo}
                              alt={displayName}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform filter grayscale group-hover:grayscale-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          </div>
                        </LogoHover>
                      ) : (
                        <div className="w-24 h-18 sm:w-28 sm:h-20 md:w-32 md:h-24 lg:w-36 lg:h-28 mb-2 bg-slate-200 rounded flex items-center justify-center">
                          <span className="text-slate-400 text-sm">LOGO</span>
                        </div>
                      )}
                      <p className="text-[14px] sm:text-[13px] md:text-[15px] leading-tight font-medium text-gray-800 text-center line-clamp-2 group-hover:text-gray-900 transition-colors">
                        {displayName}
                      </p>
                    </CardContent>
                  </Card>
                </WaveAnimation>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
