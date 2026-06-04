import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function Snail() {
  const ref = useRef<SVGSVGElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        x: '+=180',
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })

      gsap.to('.snail-antenna-l', {
        rotate: -8,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'bottom center',
      })
      gsap.to('.snail-antenna-r', {
        rotate: 8,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'bottom center',
      })
    })
    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <svg ref={ref} className="creature creature-snail" width="56" height="36" viewBox="0 0 56 36" fill="none" aria-hidden="true">
      <ellipse cx="38" cy="30" rx="18" ry="6" fill="#D4C9B4" />
      <ellipse cx="12" cy="28" rx="12" ry="5" fill="#C4B89E" />
      <path d="M22 28 C22 12, 38 4, 42 16 C46 24, 36 28, 30 24" fill="#E59266" stroke="#C4882A" strokeWidth="1.5" />
      <path d="M32 16 C34 12, 38 14, 36 20" fill="#F7CD67" opacity="0.6" />
      <line className="snail-antenna-l" x1="8" y1="24" x2="4" y2="10" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
      <line className="snail-antenna-r" x1="16" y1="24" x2="20" y2="10" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="9" r="2.5" fill="#8B7355" />
      <circle cx="20" cy="9" r="2.5" fill="#8B7355" />
      <circle cx="4" cy="8.5" r="1" fill="white" />
      <circle cx="20" cy="8.5" r="1" fill="white" />
    </svg>
  )
}
