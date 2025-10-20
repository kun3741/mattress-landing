"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import type { SiteContent } from "@/lib/content-data"

interface ContentContextType {
  content: SiteContent | null
  isLoading: boolean
  updateContent: (newContent: Partial<SiteContent>) => void
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    async function loadContent() {
      try {
        const response = await fetch('/api/content')
        const data = await response.json()
        setContent(data)
      } catch (error) {
        console.error('Failed to load content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  const updateContent = (newContent: Partial<SiteContent>) => {
    if (content) {
      setContent({ ...content, ...newContent })
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null
  }

  return (
    <ContentContext.Provider value={{ content, isLoading, updateContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

// Hook for specific content sections
export function useContentSection<T extends keyof SiteContent>(section: T): SiteContent[T] | null {
  const { content } = useContent()
  return content ? content[section] : null
}
