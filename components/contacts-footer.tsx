"use client"

import { useEffect, useState } from "react"
import { Phone, Mail, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Contacts {
  phone: string
  email: string
  address: string
}

export function ContactsFooter() {
  const [contacts, setContacts] = useState<Contacts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    async function loadContacts() {
      try {
        const response = await fetch('/api/content')
        const content = await response.json()
        setContacts(content.contacts)
      } catch (error) {
        console.error('Failed to load contacts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContacts()
  }, [])

  // Prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-24 mx-auto md:mx-0 bg-gray-700" />
                <Skeleton className="h-4 w-32 mx-auto md:mx-0 bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  if (!contacts) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12 lg:gap-16 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Телефон</span>
            </div>
            <a 
              href={`tel:${contacts.phone.replace(/\s+/g, '')}`}
              className="text-gray-300 hover:text-white transition-colors block"
            >
              {contacts.phone}
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Email</span>
            </div>
            <a 
              href={`mailto:${contacts.email}`}
              className="text-gray-300 hover:text-white transition-colors block"
            >
              {contacts.email}
            </a>
          </div>

          {contacts.address && contacts.address.trim() && (
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="font-medium">Адреса</span>
              </div>
              <span className="text-gray-300 block">
                {contacts.address}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Підбір Матраців. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  )
}
