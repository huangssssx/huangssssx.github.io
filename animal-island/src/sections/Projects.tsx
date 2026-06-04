import { useEffect, useRef, useCallback } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { Title, Card, Button, Divider } from 'animal-island-ui'
import { useReducedMotion } from '../hooks/useReducedMotion'
import Butterfly from '../components/creatures/Butterfly'
import '../components/creatures/creatures.css'
import './Projects.css'

const projects = [
  {
    title: 'Masonry Layout',
    eyebrow: 'Interactive Showcase',
    desc: '一个更偏视觉实验和布局表达的项目，把 masonry 排布、材质层次和响应式控制做成了可以直接感知的体验。',
    color: 'app-blue' as const,
    tags: ['Isotope.js', 'Responsive', 'AVIF / WebP'],
    highlights: ['自适应列数控制', '玻璃质感 UI', '图片性能优化'],
    result: 'Layout + Visual Polish',
    role: 'Front-end / UI',
    href: '/masonry-layout/index.html',
  },
  {
    title: 'Landing Page',
    eyebrow: 'Performance Case',
    desc: '偏工程导向的落地页案例，在不引入框架的前提下，把性能、叙事节奏和视觉效果压进非常轻的体积里。',
    color: 'app-green' as const,
    tags: ['Lighthouse 100', 'Service Worker', 'Canvas'],
    highlights: ['Lighthouse 100/100/100/100', '不到 20 KB 的视觉效果', '离线缓存策略'],
    result: 'Performance + Storytelling',
    role: 'Architecture / Front-end',
    href: '/landingpage/index.html',
  },
  {
    title: 'Northstar',
    eyebrow: 'Commerce Front-end',
    desc: '更接近真实业务页面的电商前端，重点放在多页结构、暗色模式切换和一条完整的联系流程上。',
    color: 'app-orange' as const,
    tags: ['Multi-Page', 'Dark Mode', 'Form Validation'],
    highlights: ['多页面信息架构', '暗色模式体验', '表单交互闭环'],
    result: 'UX + Business Flow',
    role: 'Product UI / Front-end',
    href: '/e-commerce-websit/index.html',
  },
]

const projectSignals = [
  {
    title: '不是只会做卡片',
    desc: '我会把 landing、展示型页面、偏业务页面拆成不同的目标，再决定视觉、动效和代码结构怎么配。',
  },
  {
    title: '会在结果上给证据',
    desc: '我倾向用 Lighthouse、体积、可维护性、交互完整度这些可验证的东西说话。',
  },
  {
    title: '会留出增长空间',
    desc: '即使是展示型项目，我也会先想后续怎么扩展、怎么复用、怎么继续长成一个更大的站点。',
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return
    const heading = sectionRef.current.querySelector('.projects-heading')
    const grid = sectionRef.current.querySelector('.projects-grid')
    const signals = sectionRef.current.querySelector('.projects-signals')

    const ctx = gsap.context(() => {
      if (heading) {
        ScrollTrigger.create({
          trigger: heading,
          start: 'top 90%',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => gsap.set(heading, { y: self.progress * -50 }),
        })
      }
      if (grid) {
        ScrollTrigger.create({
          trigger: grid,
          start: 'top 90%',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => gsap.set(grid, { y: self.progress * -30 }),
        })
      }
      if (signals) {
        ScrollTrigger.create({
          trigger: signals,
          start: 'top 90%',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => gsap.set(signals, { y: self.progress * -20 }),
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  useEffect(() => {
    if (!sectionRef.current) return
    const elements = sectionRef.current.querySelectorAll('.projects-reveal')
    const animations: gsap.core.Tween[] = []

    elements.forEach((element, index) => {
      const tween = gsap.fromTo(
        element,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0.01 : 0.7,
          delay: reducedMotion ? 0 : index * 0.05,
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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion) return
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -6
      const rotateY = ((x - centerX) / centerX) * 6

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      })
    },
    [reducedMotion],
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion) return
      gsap.to(e.currentTarget, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
    },
    [reducedMotion],
  )

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <Butterfly />
      <div className="projects-heading projects-reveal">
        <div>
          <div className="projects-title-wrap">
            <Title size="large" color="app-teal" className="projects-title">
              My Projects
            </Title>
          </div>
          <p className="projects-desc">
            不只是"点进去看看"，这里更像是 3 个不同方向的能力切面: 视觉布局、性能取向、产品化页面。
          </p>
        </div>
        <div className="projects-summary">
          <div>
            <strong>3</strong>
            <span>Public Cases</span>
          </div>
          <div>
            <strong>UI</strong>
            <span>From Idea To Polish</span>
          </div>
          <div>
            <strong>100</strong>
            <span>Lighthouse Highlight</span>
          </div>
        </div>
      </div>
      <div className="projects-grid">
        {projects.map((p) => (
          <div
            className="project-card-wrap projects-reveal"
            key={p.title}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Card color={p.color} className="project-card">
              <span className="project-card-eyebrow">{p.eyebrow}</span>
              <h3 className="project-card-title">{p.title}</h3>
              <div className="project-card-meta">
                <span>{p.role}</span>
                <span>{p.result}</span>
              </div>
              <p className="project-card-desc">{p.desc}</p>
              <div className="project-card-highlights">
                {p.highlights.map((item) => (
                  <span className="project-highlight" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="project-card-tags">
                {p.tags.map((tag) => (
                  <span className="project-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <a href={p.href} target="_blank" rel="noopener noreferrer">
                <Button type="primary" size="middle" className="project-btn">
                  Visit &rarr;
                </Button>
              </a>
            </Card>
          </div>
        ))}
      </div>
      <div className="projects-signals">
        {projectSignals.map((signal) => (
          <article className="projects-signal-card projects-reveal" key={signal.title}>
            <h3>{signal.title}</h3>
            <p>{signal.desc}</p>
          </article>
        ))}
      </div>
      <Divider type="wave-yellow" className="projects-divider" />
    </section>
  )
}
