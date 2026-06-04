import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './FloatingLeaves.css'

const leaves = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: 16 + Math.random() * 20,
  x: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 8 + Math.random() * 6,
  rotation: Math.random() * 360,
  drift: -30 + Math.random() * 60,
}))

export default function FloatingLeaves() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return

    const ctx = gsap.context(() => {
      const items = containerRef.current!.querySelectorAll('.floating-leaf')
      items.forEach((leaf, i) => {
        const data = leaves[i]
        gsap.set(leaf, {
          x: `${data.x}vw`,
          y: -40,
          rotation: data.rotation,
          scale: 0.6 + Math.random() * 0.4,
        })

        gsap.to(leaf, {
          y: '110vh',
          x: `+=${data.drift}`,
          rotation: `+=${180 + Math.random() * 360}`,
          duration: data.duration,
          delay: data.delay,
          ease: 'none',
          repeat: -1,
        })

        gsap.to(leaf, {
          opacity: 0.3 + Math.random() * 0.4,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div className="floating-leaves" ref={containerRef} aria-hidden="true">
      {leaves.map((leaf) => (
        <svg
          key={leaf.id}
          className="floating-leaf"
          width={leaf.size}
          height={leaf.size}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.5-3 11-8 0 0-1.5-.5-2-1z"
            fill="rgba(106, 182, 113, 0.6)"
          />
          <path
            d="M17 8C8 10 5.9 16.17 3.82 21.34"
            stroke="rgba(90, 155, 95, 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  )
}
