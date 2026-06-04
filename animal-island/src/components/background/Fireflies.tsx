import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const FIREFLIES = Array.from({ length: 12 }, () => ({
  x: 10 + Math.random() * 80,
  y: 20 + Math.random() * 60,
  size: 3 + Math.random() * 4,
  delay: Math.random() * 5,
  glowDur: 2 + Math.random() * 3,
  moveDur: 4 + Math.random() * 4,
  driftX: -40 + Math.random() * 80,
  driftY: -30 + Math.random() * 60,
}))

export default function Fireflies() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return
    const ctx = gsap.context(() => {
      FIREFLIES.forEach((f, i) => {
        const el = containerRef.current!.children[i] as HTMLElement
        if (!el) return

        gsap.set(el, { x: `${f.x}vw`, y: `${f.y}vh`, opacity: 0, scale: 0.5 })

        gsap.to(el, {
          opacity: 0.9,
          scale: 1,
          duration: f.glowDur * 0.4,
          delay: f.delay,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          repeatDelay: f.glowDur * 0.3,
        })

        gsap.to(el, {
          x: `+=${f.driftX}`,
          y: `+=${f.driftY}`,
          duration: f.moveDur,
          delay: f.delay,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div ref={containerRef} className="bg-animation firefly-layer" aria-hidden="true">
      {FIREFLIES.map((f, i) => (
        <div
          key={i}
          className="firefly"
          style={{
            width: f.size,
            height: f.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffe87c 0%, #ffd700 40%, transparent 70%)',
            boxShadow: `0 0 ${f.size * 3}px ${f.size}px rgba(255, 232, 124, 0.5), 0 0 ${f.size * 6}px ${f.size * 2}px rgba(255, 215, 0, 0.2)`,
          }}
        />
      ))}
    </div>
  )
}
