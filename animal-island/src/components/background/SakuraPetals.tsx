import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const PETALS = [
  { x: 15, size: 14, delay: 0, dur: 8, rot: 60, color: '#FFB7C5' },
  { x: 35, size: 10, delay: 1.5, dur: 10, rot: -45, color: '#FFC8D6' },
  { x: 55, size: 16, delay: 3, dur: 7, rot: 90, color: '#FFD1DC' },
  { x: 75, size: 11, delay: 0.8, dur: 9, rot: -30, color: '#FFB7C5' },
  { x: 90, size: 13, delay: 2.2, dur: 8.5, rot: 75, color: '#FFC8D6' },
  { x: 25, size: 9, delay: 4, dur: 11, rot: -60, color: '#FFD1DC' },
  { x: 60, size: 12, delay: 5, dur: 9.5, rot: 40, color: '#FFB7C5' },
  { x: 80, size: 15, delay: 1, dur: 7.5, rot: -80, color: '#FFC8D6' },
  { x: 45, size: 10, delay: 3.5, dur: 10.5, rot: 55, color: '#FFD1DC' },
  { x: 10, size: 11, delay: 6, dur: 8, rot: -50, color: '#FFB7C5' },
]

function PetalSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M10 0 C10 0, 18 6, 16 12 C14 18, 10 20, 10 20 C10 20, 6 18, 4 12 C2 6, 10 0, 10 0Z"
        fill={color}
        opacity={0.85}
      />
    </svg>
  )
}

export default function SakuraPetals() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return
    const petals = containerRef.current.querySelectorAll('.sakura-petal')

    petals.forEach((el, i) => {
      const p = PETALS[i]
      gsap.set(el, { x: `${p.x}vw`, y: -30, rotation: 0, opacity: 0 })

      gsap.to(el, {
        y: '110vh',
        x: `+=${p.rot}`,
        rotation: p.rot * 3,
        opacity: 0.8,
        duration: p.dur,
        delay: p.delay,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x: string) => {
            const base = parseFloat(x)
            return base + Math.sin(parseFloat(x) * 0.05) * 30 + 'px'
          },
        },
      })
    })

    petals.forEach((el, i) => {
      const p = PETALS[i]
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        delay: p.delay + p.dur - 0.5,
        repeat: -1,
        repeatDelay: p.dur - 0.5,
      })
    })
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div ref={containerRef} className="bg-animation sakura-layer" aria-hidden="true">
      {PETALS.map((p, i) => (
        <div key={i} className="sakura-petal">
          <PetalSVG size={p.size} color={p.color} />
        </div>
      ))}
    </div>
  )
}
