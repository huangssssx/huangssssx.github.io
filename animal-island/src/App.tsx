import { useEffect, useState, useRef } from 'react'
import { gsap } from './lib/gsap'
import { Cursor, Loading, Footer } from 'animal-island-ui'
import Fish from './components/creatures/Fish'
import BackgroundAnimations from './components/background/BackgroundAnimations'
import './components/creatures/creatures.css'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading || !shellRef.current) return
    const timer = setTimeout(() => {
      gsap.to(shellRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => setLoading(false),
      })
    }, 800)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <Cursor>
      <BackgroundAnimations />
      <div className="app-shell" ref={shellRef} style={{ opacity: loading ? 0 : 1 }}>
        <header className="island-dock">
          <a href="#home" className="island-brand">
            Huangssssx's Island
          </a>
          <nav className="island-nav" aria-label="Section navigation">
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#tools">Tools</a>
            <a href="#contact">Next</a>
          </nav>
        </header>
        <main className="app">
          <Hero />
          <Projects />
          <Skills />
          <section className="outro" id="contact">
            <Fish />
            <div className="outro-card">
              <span className="outro-kicker">Next Stop</span>
              <h2 className="outro-title">这个主页现在终于像个主页了</h2>
              <p className="outro-text">
                我把它补成了一个更完整的小岛入口: 有定位、有项目证明、有工具栈，也有继续探索的下一步。
              </p>
              <div className="outro-actions">
                <a href="#projects" className="outro-link">
                  Revisit Projects
                </a>
                <a href="../" className="outro-link outro-link-secondary">
                  Back To Main Site
                </a>
              </div>
            </div>
          </section>
          <Footer type="sea" />
        </main>
        <footer className="site-footer">
          <span>Built with React, animal-island-ui and GSAP.</span>
          <span>Warm, playful, and still production-minded.</span>
        </footer>
      </div>
      {loading && (
        <div className="loading-overlay">
          <Loading />
        </div>
      )}
    </Cursor>
  )
}

export default App
