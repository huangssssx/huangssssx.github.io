import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function Bird() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return
    const bird = ref.current
    const section = bird.closest('.hero') as HTMLElement
    const panel = section?.querySelector('.hero-panel') as HTMLElement
    if (!section || !panel) return

    const ctx = gsap.context(() => {
      const birdW = bird.offsetWidth
      const birdH = bird.offsetHeight

      gsap.set(bird, {
        x: 0,
        y: 0,
        opacity: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 0.96,
        transformOrigin: '50% 65%',
      })

      const wingEl = bird.querySelector('.bird-wing')
      const wingTween = gsap.to(wingEl, {
        rotateY: 180,
        duration: 0.2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: '50% 100%',
      })

      function flyAndLand() {
        const sectionRect = section.getBoundingClientRect()
        const panelRect = panel.getBoundingClientRect()

        const panelRelX = panelRect.left - sectionRect.left
        const panelRelY = panelRect.top - sectionRect.top
        const landingInsetRatio = 0.14
        const landingLiftRatio = 0.85
        const landingRightOffset = 12
        const landingDropOffset = 2

        const targetX = Math.min(
          panelRelX + panelRect.width * landingInsetRatio,
          sectionRect.width - birdW - 10,
        )
        const targetY = Math.max(panelRelY - birdH * landingLiftRatio, 18)
        const startX = Math.max(panelRelX - 52, 18)
        const startY = Math.max(panelRelY - birdH * 0.98, 24)
        const apexX = Math.min(targetX + 148, sectionRect.width - birdW - 12)
        const apexY = Math.max(targetY - 56, 22)
        const settleX = targetX + landingRightOffset
        const settleY = targetY + landingDropOffset
        const outwardPath = [
          { x: startX, y: startY },
          { x: startX + 44, y: startY - 32 },
          { x: targetX + 88, y: targetY - 76 },
          { x: apexX, y: apexY },
        ]
        const returnPath = [
          { x: apexX, y: apexY },
          // { x: targetX + 120, y: targetY - 0 },
          { x: targetX + 52, y: targetY -0 },
          { x: settleX, y: settleY },
        ]

        const tl = gsap.timeline({
          defaults: {
            ease: 'sine.inOut',
          },
        })

        gsap.set(bird, {
          x: startX,
          y: startY,
          opacity: 0,
          rotation: -8,
          scaleX: 1,
          scaleY: 0.96,
        })

        tl.to(bird, { opacity: 1, duration: 0.35 })
        tl.to(
          bird,
          {
            motionPath: {
              path: outwardPath,
              curviness: 1.6,
            },
            rotation: -14,
            scaleY: 1,
            duration: 1.15,
            ease: 'power1.inOut',
          },
          0,
        )
        tl.to(bird, {
          rotation: 12,
          duration: 0.2,
          ease: 'power1.in',
        })
        tl.to(bird, {
          scaleX: -1,
          rotation: -8,
          duration: 0.18,
          ease: 'power1.inOut',
        })
        tl.to(bird, {
          motionPath: {
            path: returnPath,
            curviness: 1.4,
          },
          rotation: 12,
          duration: 0.92,
          ease: 'power2.inOut',
        })
        tl.to(bird, {
          x: settleX,
          y: settleY,
          rotation: 16,
          duration: 0.34,
          ease: 'power2.in',
        })
        tl.to(bird, {
          x: targetX,
          y: targetY,
          rotation: 0,
          duration: 0.22,
          ease: 'power2.out',
          onComplete: () => {
            wingTween.kill()
            gsap.set(wingEl, { rotateY: 0 })
            startPecking()
          },
        })
      }

      function startPecking() {
        const facing = Number(gsap.getProperty(bird, 'scaleX')) >= 0 ? 1 : -1
        const peckTl = gsap.timeline({ repeat: -1, repeatDelay: 4, delay: 2 })
        peckTl.to(bird, { rotation: 25 * facing, y: '+=4', duration: 0.18, ease: 'power2.in' })
        peckTl.to(bird, { rotation: 40 * facing, y: '+=6', duration: 0.14, ease: 'power2.in' })
        peckTl.to(bird, { rotation: 0, y: '-=10', duration: 0.3, ease: 'back.out(1.4)' })
        peckTl.to(bird, { y: '+=0', duration: 0.6 })
        peckTl.to(bird, { rotation: 25 * facing, y: '+=4', duration: 0.18, ease: 'power2.in' })
        peckTl.to(bird, { rotation: 40 * facing, y: '+=6', duration: 0.14, ease: 'power2.in' })
        peckTl.to(bird, { rotation: 0, y: '-=10', duration: 0.3, ease: 'back.out(1.4)' })
        peckTl.to(bird, { y: '+=0', duration: 0.8 })
        peckTl.to(bird, { rotation: 30 * facing, y: '+=5', duration: 0.18, ease: 'power2.in' })
        peckTl.to(bird, { rotation: 0, y: '-=5', duration: 0.25, ease: 'back.out(1.4)' })
      }

      gsap.delayedCall(1.6, flyAndLand)
    }, section)

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div ref={ref} className="creature creature-bird" aria-hidden="true">
      <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
        <ellipse cx="20" cy="24" rx="14" ry="12" fill="#5C4033" />
        <circle cx="32" cy="18" r="9" fill="#6B4C3B" />
        <path className="bird-wing" d="M12 18 C6 8, -2 10, 0 22 C4 16, 10 16, 12 18Z" fill="#7D5A4C" />
        <circle cx="35" cy="16" r="3" fill="white" />
        <circle cx="35" cy="16" r="1.5" fill="#2D1B0E" />
        <path d="M41 18 L45 19.5 L41 20" fill="#E8A838" stroke="#C4882A" strokeWidth="0.5" />
        <path d="M10 28 L6 24 L9 30" fill="#E8A838" />
      </svg>
    </div>
  )
}
