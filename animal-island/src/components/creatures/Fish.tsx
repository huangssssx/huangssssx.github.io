import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function Fish() {
  const ref = useRef<SVGSVGElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 4 })
      tl.fromTo(
        ref.current!,
        { y: 20, opacity: 0, scaleY: 1 },
        {
          y: -40,
          opacity: 1,
          scaleY: 0.9,
          duration: 0.6,
          ease: 'power2.out',
        },
      )
      tl.to(ref.current!, {
        y: 20,
        opacity: 0,
        scaleY: 1.1,
        duration: 0.5,
        ease: 'power2.in',
      })

      gsap.to('.fish-tail', {
        rotate: 15,
        duration: 0.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'left center',
      })
    })
    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <svg ref={ref} className="creature creature-fish" width="40" height="30" viewBox="0 0 40 30" fill="none" aria-hidden="true">
      <ellipse cx="18" cy="15" rx="16" ry="11" fill="#889DF0" />
      <ellipse cx="18" cy="17" rx="12" ry="6" fill="#A8B8F4" opacity="0.6" />
      <polygon className="fish-tail" points="34,15 42,8 42,22" fill="#6B7DD0" />
      <circle cx="10" cy="13" r="3" fill="white" />
      <circle cx="10" cy="13" r="1.5" fill="#2D1B0E" />
      <path d="M18 4 C22 2, 24 4, 22 8" fill="#6B7DD0" opacity="0.7" />
      <ellipse cx="26" cy="14" rx="3" ry="1.5" fill="#B77DEE" opacity="0.5" />
    </svg>
  )
}
