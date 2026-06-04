import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { Button, Divider, Title, Typewriter } from 'animal-island-ui'
import { useReducedMotion } from '../hooks/useReducedMotion'
import FloatingLeaves from '../components/FloatingLeaves'
import Bird from '../components/creatures/Bird'
import '../components/creatures/creatures.css'
import './Hero.css'

const heroStats = [
  { value: '4+', label: 'Years Building' },
  { value: '12+', label: 'Shipped Projects' },
  { value: '100', label: 'Lighthouse Obsession' },
]

const heroNotes = [
  '专注前端体验、动效和设计落地之间的连接地带',
  '喜欢把复杂信息做得自然、轻巧、可逛',
  '当前偏爱 React、TypeScript、GSAP 和细腻的 UI 结构',
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!contentRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-reveal',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0.01 : 0.8,
          stagger: reducedMotion ? 0 : 0.12,
          ease: 'power2.out',
        },
      )
    }, contentRef)
    return () => ctx.revert()
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return
    const bg = sectionRef.current.querySelector('.hero-bg') as HTMLElement
    const copy = sectionRef.current.querySelector('.hero-copy') as HTMLElement
    const panel = sectionRef.current.querySelector('.hero-panel') as HTMLElement
    if (!bg) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress
          gsap.set(bg, { y: p * -120 })
          if (copy) gsap.set(copy, { y: p * -60 })
          if (panel) gsap.set(panel, { y: p * -40 })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section className="hero" id="home" ref={sectionRef}>
      <div className="hero-bg" aria-hidden="true" />
      <FloatingLeaves />
      <Bird />
      <div className="hero-content" ref={contentRef}>
        <div className="hero-copy">
          <p className="hero-kicker hero-reveal">Personal Homepage / Island Portal</p>
          <div className="hero-title hero-reveal">
            <Title size="large" color="app-yellow">
              Huangssssx's Island
            </Title>
          </div>
          <div className="hero-typewriter hero-reveal">
            <Typewriter speed={70} autoPlay>
              <p className="hero-typewriter-text">
                Welcome to my island! I build warm interfaces, tidy front-end systems, and interactions that feel alive without getting noisy.
              </p>
            </Typewriter>
          </div>
          <p className="hero-sub hero-reveal">
            这里不是只有一个标题和几个链接的小岛，而是一个更完整的入口:
            你可以快速理解我的能力边界、看我做过的项目、再顺着工具栈继续往里逛。
          </p>
          <div className="hero-badges hero-reveal">
            <span>React + TypeScript</span>
            <span>Design-minded Front-end</span>
            <span>Motion & Interaction</span>
          </div>
          <div className="hero-actions hero-reveal">
            <a href="#projects">
              <Button type="primary" size="middle">
                Visit Projects
              </Button>
            </a>
            <a href="#tools">
              <Button type="default" size="middle">
                Open Toolbox
              </Button>
            </a>
          </div>
        </div>
        <div className="hero-panel hero-reveal">
          <div className="hero-panel-card hero-panel-card-primary">
            <span className="hero-panel-label">Island Bulletin</span>
            <h3 className="hero-panel-title">做出来的东西，要能看、能用、也能讲清楚</h3>
            <p className="hero-panel-text">
              我更偏向把设计语言、组件结构、交互节奏和工程可维护性一起处理，而不是只做其中一块。
            </p>
            <div className="hero-stats">
              {heroStats.map((item) => (
                <div className="hero-stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-panel-card">
            <span className="hero-panel-label">Right Now</span>
            <ul className="hero-note-list">
              {heroNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <Divider type="wave-yellow" className="hero-divider" />
        </div>
        <a href="#projects" className="hero-scroll-hint hero-reveal">
          <span className="hero-scroll-text">Explore</span>
          <span className="hero-scroll-arrow">&#8595;</span>
        </a>
      </div>
    </section>
  )
}
