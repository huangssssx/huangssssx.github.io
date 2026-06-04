import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import sparklesData from '../../assets/lottie/sparkles.json'
import LottieBg from './LottieBg'
import SakuraPetals from './SakuraPetals'
import Fireflies from './Fireflies'
import Snowflakes from './Snowflakes'
import './background.css'

export default function BackgroundAnimations() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const layers = wrapRef.current.querySelectorAll<HTMLElement>('.parallax-layer')
    const triggers: ScrollTrigger[] = []

    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed || '0')
      const yDistance = speed * 200

      gsap.set(layer, { y: 0 })

      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          gsap.set(layer, { y: self.progress * yDistance })
        },
      })
      triggers.push(st)
    })

    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <div className="bg-animations" ref={wrapRef} aria-hidden="true">
      <div className="parallax-layer" data-speed="-0.15">
        <LottieBg data={sparklesData} className="lottie-sparkles" opacity={0.08} />
      </div>
      <div className="parallax-layer" data-speed="-0.3">
        <SakuraPetals />
      </div>
      <div className="parallax-layer" data-speed="-0.1">
        <Fireflies />
      </div>
      <div className="parallax-layer" data-speed="-0.4">
        <Snowflakes />
      </div>
    </div>
  )
}
