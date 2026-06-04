import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { Title, Phone } from 'animal-island-ui'
import { useReducedMotion } from '../hooks/useReducedMotion'
import Snail from '../components/creatures/Snail'
import '../components/creatures/creatures.css'
import './Skills.css'

const skillGroups = [
  {
    title: 'Interface',
    items: ['React', 'TypeScript', 'CSS Architecture', 'Responsive UI'],
  },
  {
    title: 'Motion',
    items: ['GSAP', 'Micro-interaction', 'Scroll Storytelling', 'Stateful Feedback'],
  },
  {
    title: 'System',
    items: ['Vite', 'Component Thinking', 'Design Tokens', 'Maintainable Structure'],
  },
  {
    title: 'Collaboration',
    items: ['Figma Handoff', 'Requirement Refining', 'Readable Code', 'Fast Iteration'],
  },
]

const workflow = [
  '先拆清楚页面目标，再决定视觉密度和交互强度',
  '把组件、状态和布局层级先摆对，再开始润色样式',
  '动效只用来解释结构和节奏，不拿来制造噪音',
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return
    const heading = sectionRef.current.querySelector('.skills-heading')
    const content = sectionRef.current.querySelector('.skills-content')
    const phoneWrap = sectionRef.current.querySelector('.skills-phone-wrap')

    const ctx = gsap.context(() => {
      if (heading) {
        ScrollTrigger.create({
          trigger: heading,
          start: 'top 90%',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => gsap.set(heading, { y: self.progress * -40 }),
        })
      }
      if (content) {
        ScrollTrigger.create({
          trigger: content,
          start: 'top 90%',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => gsap.set(content, { y: self.progress * -25 }),
        })
      }
      if (phoneWrap) {
        ScrollTrigger.create({
          trigger: phoneWrap,
          start: 'top 90%',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => gsap.set(phoneWrap, { y: self.progress * -50 }),
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  useEffect(() => {
    if (!sectionRef.current) return
    const elements = sectionRef.current.querySelectorAll('.skills-reveal')
    const animations: gsap.core.Tween[] = []

    elements.forEach((element, index) => {
      const tween = gsap.fromTo(
        element,
        { opacity: 0, y: 36, scale: index === 1 ? 0.94 : 1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: reducedMotion ? 0.01 : 0.8,
          delay: reducedMotion ? 0 : index * 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
      animations.push(tween)
    })

    return () => {
      animations.forEach((animation) => {
        animation.scrollTrigger?.kill()
        animation.kill()
      })
    }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || !phoneRef.current) return
    const phone = phoneRef.current.querySelector(':first-child') as HTMLElement
    if (!phone) return

    const tween = gsap.to(phone, {
      y: -6,
      duration: 2.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })

    return () => {
      tween.kill()
    }
  }, [reducedMotion])

  return (
    <section className="skills" id="tools" ref={sectionRef}>
      <Snail />
      <div className="skills-heading skills-reveal">
        <div className="skills-title-wrap">
          <Title size="large" color="purple" className="skills-title">
            My Tools
          </Title>
        </div>
        <p className="skills-desc">
          手机上展示的是气质，下面这些卡片才是实际工作方式: 我擅长把视觉、组件和交互整理成一个能持续扩展的前端系统。
        </p>
      </div>
      <div className="skills-layout">
        <div className="skills-content skills-reveal">
          <div className="skills-grid">
            {skillGroups.map((group) => (
              <article className="skills-card" key={group.title}>
                <h3>{group.title}</h3>
                <div className="skills-card-items">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="skills-workflow">
            <div className="skills-workflow-card">
              <span className="skills-label">Workflow</span>
              <h3>做页面时，我通常按这个顺序推进</h3>
              <ul>
                {workflow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="skills-workflow-card skills-workflow-card-accent">
              <span className="skills-label">Current Focus</span>
              <h3>我现在更在意的，是页面有没有自己的节奏感</h3>
              <p>
                比起堆功能，我更想把信息密度、情绪氛围、交互反馈和代码可读性一起调顺。这也是这个主页这次补强的方向。
              </p>
            </div>
          </div>
        </div>
        <div className="skills-phone-wrap skills-reveal" ref={phoneRef}>
          <Phone />
          <p className="skills-phone-caption">
            NookPhone 是这个主页的玩味入口，真正的能力表达在左边那套结构化卡片里。
          </p>
        </div>
      </div>
    </section>
  )
}
