import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const FLAKES = Array.from({ length: 20 }, () => ({
  x: Math.random() * 100,
  size: 4 + Math.random() * 8,
  delay: Math.random() * 8,
  dur: 6 + Math.random() * 8,
  drift: -30 + Math.random() * 60,
  opacity: 0.3 + Math.random() * 0.5,
}))

function SnowflakeSVG({ size, opacity }: { size: number; opacity: number }) {
  const r = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={r} cy={r} r={r * 0.8} fill="white" opacity={opacity} />
      <circle cx={r} cy={r} r={r * 0.5} fill="white" opacity={opacity * 0.6} />
    </svg>
  )
}

export default function Snowflakes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return
    const ctx = gsap.context(() => {
      FLAKES.forEach((f, i) => {
        const el = containerRef.current!.children[i] as HTMLElement
        if (!el) return

        gsap.set(el, { x: `${f.x}vw`, y: -20, rotation: 0 })

        gsap.to(el, {
          y: '105vh',
          x: `+=${f.drift}`,
          rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
          duration: f.dur,
          delay: f.delay,
          ease: 'none',
          repeat: -1,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div ref={containerRef} className="bg-animation snowflake-layer" aria-hidden="true">
      {FLAKES.map((f, i) => (
        <div key={i} className="snowflake">
          <SnowflakeSVG size={f.size} opacity={f.opacity} />
        </div>
      ))}
    </div>
  )
}
