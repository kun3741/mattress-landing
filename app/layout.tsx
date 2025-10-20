import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Підбір Матрацу | Професійна консультація онлайн",
  description:
    "Знайдіть ідеальний матрац за 5 хвилин. Професійний алгоритмічний підбір з урахуванням ваших індивідуальних особливостей. Співпраця з 12 провідними фабриками України.",
  keywords: "підбір матрацу, купити матрац, матраці україна, ортопедичний матрац, консультація матрац",
  openGraph: {
    title: "Підбір Матрацу | Професійна консультація онлайн",
    description: "Знайдіть ідеальний матрац за 5 хвилин",
    type: "website",
    locale: "uk_UA",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
