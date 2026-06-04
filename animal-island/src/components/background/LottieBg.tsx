import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface LottieBgProps {
  data: object
  className?: string
  opacity?: number
}

export default function LottieBg({ data, className = '', opacity = 0.6 }: LottieBgProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!containerRef.current) return
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: !reducedMotion,
      animationData: data,
    })
    return () => anim.destroy()
  }, [data, reducedMotion])

  return (
    <div
      ref={containerRef}
      className={`bg-animation lottie-layer ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}
