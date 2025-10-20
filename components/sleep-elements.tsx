"use client"

import { useEffect, useState } from "react"

// Floating sleep-themed decorative elements
export const FloatingSleepElements = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Removed emoji icons from floating background
  return null
}

// Sleep-themed section divider
export const SleepDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex justify-center items-center py-8 ${className}`}>
    <div className="flex items-center gap-4">
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-sleep-pulse"></div>
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-twinkle"></div>
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-sleep-pulse"></div>
    </div>
  </div>
)

// Animated background pattern
export const SleepPattern = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 opacity-5 ${className}`}>
    <div className="absolute inset-0" style={{
      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 75% 25%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 25% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
      backgroundSize: '400px 400px',
      animation: 'gentle-sway 20s ease-in-out infinite'
    }} />
  </div>
)

// Sleep-themed loading spinner
export const SleepSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 text-sm",
    md: "w-8 h-8 text-xl",
    lg: "w-12 h-12 text-3xl"
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <div className="animate-peaceful-breathing">
        <div className="w-3 h-3 rounded-full bg-primary/70 animate-twinkle" />
      </div>
    </div>
  )
}

// Animated sleep quote or tip
export const SleepTip = ({ tip, className = "" }: { tip: string; className?: string }) => (
  <div className={`bg-peaceful-gradient text-white rounded-lg p-4 shadow-dream animate-dream-float ${className}`}>
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-white/40" />
      <div>
        <p className="text-sm font-medium opacity-90">Порада для сну:</p>
        <p className="text-sm opacity-75">{tip}</p>
      </div>
    </div>
  </div>
)

// Sleep quality rating stars
export const SleepRating = ({ rating, maxRating = 5, className = "" }: { 
  rating: number; 
  maxRating?: number; 
  className?: string;
}) => (
  <div className={`flex gap-1 ${className}`}>
    {Array.from({ length: maxRating }).map((_, index) => (
      <div
        key={index}
        className={`size-3 rounded-full transition-all duration-300 ${
          index < rating 
            ? 'bg-yellow-400 animate-twinkle' 
            : 'bg-gray-300 opacity-50'
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      />
    ))}
  </div>
)

// Sleep progress indicator
export const SleepProgress = ({ 
  progress, 
  label = "Прогрес підбору", 
  className = "" 
}: { 
  progress: number; 
  label?: string; 
  className?: string;
}) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sleep ${className}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div 
        className="h-full bg-sleep-gradient transition-all duration-700 ease-out animate-gentle-sway"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
)

// Mattress comfort indicator
export const ComfortMeter = ({ 
  comfort, 
  label = "Рівень комфорту", 
  className = "" 
}: { 
  comfort: number; 
  label?: string; 
  className?: string;
}) => {
  return (
    <div className={`text-center space-y-2 ${className}`}>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex justify-center gap-1">
        <SleepRating rating={Math.ceil(comfort / 2)} />
      </div>
    </div>
  )
}
