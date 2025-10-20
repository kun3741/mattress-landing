"use client"

import { motion, useMotionValue, animate } from "framer-motion"
import { ReactNode, useState } from "react"

// Анімація появи знизу
export const FadeInUp = ({ children, delay = 0, className = "" }: { 
  children: ReactNode, 
  delay?: number, 
  className?: string 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація появи зліва
export const FadeInLeft = ({ children, delay = 0, className = "" }: { 
  children: ReactNode, 
  delay?: number, 
  className?: string 
}) => (
  <motion.div
    initial={{ opacity: 0, x: -60 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація появи справа
export const FadeInRight = ({ children, delay = 0, className = "" }: { 
  children: ReactNode, 
  delay?: number, 
  className?: string 
}) => (
  <motion.div
    initial={{ opacity: 0, x: 60 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація масштабування
export const ScaleIn = ({ children, delay = 0, className = "" }: { 
  children: ReactNode, 
  delay?: number, 
  className?: string 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 0.6, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація хвилі для карток
export const WaveAnimation = ({ children, index, className = "" }: { 
  children: ReactNode, 
  index: number, 
  className?: string 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ 
      duration: 0.6, 
      delay: index * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    whileHover={{ 
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація плавання (для елементів що імітують сон)
export const FloatingAnimation = ({ children, className = "" }: { 
  children: ReactNode, 
  className?: string 
}) => (
  <motion.div
    animate={{ 
      y: [-10, 10, -10],
    }}
    transition={{ 
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація пульсації
export const PulseAnimation = ({ children, className = "" }: { 
  children: ReactNode, 
  className?: string 
}) => (
  <motion.div
    animate={{ 
      scale: [1, 1.05, 1],
    }}
    transition={{ 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація для кнопок
export const ButtonHover = ({ children, className = "" }: { 
  children: ReactNode, 
  className?: string 
}) => (
  <motion.div
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ 
      duration: 0.2,
      ease: "easeOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація для логотипів партнерів
export const LogoHover = ({ children, className = "" }: { 
  children: ReactNode, 
  className?: string 
}) => (
  <motion.div
    whileHover={{ 
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { 
        rotate: { duration: 0.5, ease: "easeInOut" },
        scale: { duration: 0.2, ease: "easeOut" }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація градієнта для героя
export const GradientAnimation = ({ children, className = "" }: { 
  children: ReactNode, 
  className?: string 
}) => (
  <motion.div
    animate={{
      background: [
        "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
        "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
        "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
      ]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Анімація для статистики/цифр
export const CounterAnimation = ({ 
  from, 
  to, 
  duration = 2,
  className = ""
}: { 
  from: number, 
  to: number, 
  duration?: number,
  className?: string 
}) => {
  const mv = useMotionValue(from)
  const [value, setValue] = useState(from)
  const [started, setStarted] = useState(false)

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        if (started) return
        setStarted(true)
        animate(mv, to, { duration, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) })
      }}
      className={className}
    >
      {value}
    </motion.span>
  )
}
