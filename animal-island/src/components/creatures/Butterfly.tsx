import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function Butterfly() {
  const ref = useRef<SVGSVGElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.to('.bfly-wing-l', {
        rotateY: 70,
        duration: 0.3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'right center',
      })
      gsap.to('.bfly-wing-r', {
        rotateY: -70,
        duration: 0.3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'left center',
      })

      gsap.to(ref.current!, {
        x: '+=60',
        y: '+=30',
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })
    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <svg ref={ref} className="creature creature-butterfly" width="36" height="32" viewBox="0 0 36 32" fill="none" aria-hidden="true">
      <ellipse className="bfly-wing-l" cx="10" cy="10" rx="10" ry="9" fill="#F8A6B2" opacity="0.85" />
      <ellipse className="bfly-wing-r" cx="26" cy="10" rx="10" ry="9" fill="#B77DEE" opacity="0.85" />
      <ellipse className="bfly-wing-l" cx="12" cy="22" rx="7" ry="6" fill="#F7CD67" opacity="0.8" />
      <ellipse className="bfly-wing-r" cx="24" cy="22" rx="7" ry="6" fill="#82D5BB" opacity="0.8" />
      <ellipse cx="18" cy="16" rx="2" ry="10" fill="#5C4033" />
      <line x1="14" y1="6" x2="12" y2="1" stroke="#5C4033" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="6" x2="24" y2="1" stroke="#5C4033" strokeWidth="1" strokeLinecap="round" />
      <circle cx="12" cy="1" r="1.5" fill="#5C4033" />
      <circle cx="24" cy="1" r="1.5" fill="#5C4033" />
    </svg>
  )
}
