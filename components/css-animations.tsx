"use client"

import { ReactNode, useEffect, useState } from "react"

// CSS Animation Components
export const FadeInUp = ({ 
  children, 
  delay = 0, 
  className = "",
  duration = 400 
}: { 
  children: ReactNode
  delay?: number
  className?: string
  duration?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`transition-all ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

export const FadeInLeft = ({ 
  children, 
  delay = 0, 
  className = "",
  duration = 800 
}: { 
  children: ReactNode
  delay?: number
  className?: string
  duration?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`transition-all ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'} ${className}`}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

export const FadeInRight = ({ 
  children, 
  delay = 0, 
  className = "",
  duration = 800 
}: { 
  children: ReactNode
  delay?: number
  className?: string
  duration?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`transition-all ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'} ${className}`}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

export const ScaleIn = ({ 
  children, 
  delay = 0, 
  className = "",
  duration = 600 
}: { 
  children: ReactNode
  delay?: number
  className?: string
  duration?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`transition-all ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${className}`}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

export const WaveAnimation = ({ 
  children, 
  index, 
  className = "" 
}: { 
  children: ReactNode
  index: number
  className?: string
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div 
      className={`transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
      style={{ 
        transitionDelay: `${index * 50}ms`
      }}
    >
      {children}
    </div>
  )
}

// Sleep-themed floating animation using CSS keyframes
export const FloatingAnimation = ({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`animate-floating ${className}`}>
      {children}
      <style jsx>{`
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-floating {
          animation: floating 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Pulse animation for sleep/rest theme
export const PulseAnimation = ({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`animate-gentle-pulse ${className}`}>
      {children}
      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }
        .animate-gentle-pulse {
          animation: gentle-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Button hover animation
export const ButtonHover = ({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl active:scale-95 ${className}`}>
      {children}
    </div>
  )
}

// Logo hover animation
export const LogoHover = ({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`transition-all duration-300 ease-out hover:scale-110 hover:rotate-2 ${className}`}>
      {children}
    </div>
  )
}

// Gradient animation for hero background
export const GradientAnimation = ({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`animate-gradient-shift ${className}`}>
      {children}
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background: linear-gradient(-45deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.15), rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15));
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>
    </div>
  )
}

// Counter animation for statistics
export const CounterAnimation = ({ 
  from, 
  to, 
  duration = 2000,
  className = "" 
}: { 
  from: number
  to: number
  duration?: number
  className?: string
}) => {
  const [count, setCount] = useState(from)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true)
      const increment = (to - from) / (duration / 16) // 60fps
      let current = from
      
      const timer = setInterval(() => {
        current += increment
        if (current >= to) {
          setCount(to)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [from, to, duration, hasStarted])

  return (
    <span className={`transition-all duration-300 ${className}`}>
      {count}
    </span>
  )
}

// Mattress bounce animation for product showcase
export const MattressBounce = ({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`animate-mattress-bounce ${className}`}>
      {children}
      <style jsx>{`
        @keyframes mattress-bounce {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          25% { transform: translateY(-8px) scaleY(0.95); }
          50% { transform: translateY(-4px) scaleY(0.98); }
          75% { transform: translateY(-2px) scaleY(0.99); }
        }
        .animate-mattress-bounce {
          animation: mattress-bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Sleep wave animation for background elements
export const SleepWave = ({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`animate-sleep-wave ${className}`}>
      {children}
      <style jsx>{`
        @keyframes sleep-wave {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-6px) rotate(1deg); }
          66% { transform: translateY(3px) rotate(-0.5deg); }
        }
        .animate-sleep-wave {
          animation: sleep-wave 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Intersection Observer hook for scroll-based animations
export const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(ref) // Only animate once
        }
      },
      { threshold }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return { ref: setRef, isInView }
}

// Scroll-triggered animation wrapper
export const ScrollAnimation = ({ 
  children, 
  animation = "fadeUp",
  delay = 0,
  className = "" 
}: { 
  children: ReactNode
  animation?: "fadeUp" | "fadeLeft" | "fadeRight" | "scale" | "bounce"
  delay?: number
  className?: string
}) => {
  const { ref, isInView } = useInView()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShouldAnimate(true), delay)
      return () => clearTimeout(timer)
    }
  }, [isInView, delay])

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-400 ease-out"
    
    switch (animation) {
      case "fadeUp":
        return `${baseClasses} ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
      case "fadeLeft":
        return `${baseClasses} ${shouldAnimate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`
      case "fadeRight":
        return `${baseClasses} ${shouldAnimate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`
      case "scale":
        return `${baseClasses} ${shouldAnimate ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}`
      case "bounce":
        return `${baseClasses} ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
      default:
        return baseClasses
    }
  }

  return (
    <div 
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
