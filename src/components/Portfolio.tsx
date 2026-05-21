import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { createPortal } from 'react-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomVideoPlayer from './CustomVideoPlayer'
import { worksProjects as projects } from '../data/worksProjects'
import { PageShell } from './PageShell'

const ProjectCard = ({
  project,
  onOpen,
}: {
  project: typeof projects[0]
  onOpen: () => void
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['-7deg', '7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['7deg', '-7deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const normalizedX = (mouseX / width - 0.5) * 2
    const normalizedY = (mouseY / height - 0.5) * 2

    // Инвертируем вектор, чтобы карточка всегда "отталкивалась" от курсора.
    x.set((-normalizedX) / 2)
    y.set((-normalizedY) / 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.01 }}
      className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border border-[#F5F7F6]/5 bg-[#111] [perspective:1000px] will-change-transform"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center scale-110 filter grayscale group-hover:grayscale-0 transition-[filter] duration-700"
        style={{
          backgroundImage: `url(${project.image})`,
          transformStyle: 'preserve-3d',
          translateZ: '-48px',
        }}
      />

      <div className="absolute inset-0 z-10 bg-black/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-5 text-center sm:p-6 md:p-8 bg-gradient-to-t from-black via-black/55 to-transparent"
        style={{ transform: 'translateZ(48px)' }}
      >
        <p className="font-['Bounded'] font-light text-[10px] uppercase tracking-[0.28em] text-[#F5F7F6] mb-2 sm:mb-3">
          {project.category}
        </p>
        <h3 className="max-w-full font-bounded uppercase text-[#F5F7F6] group-hover:text-[#E10600] transition-colors leading-[0.95] break-words text-[clamp(1.1rem,3.4vw,2.35rem)] sm:text-[clamp(1.25rem,2.9vw,2.65rem)]">
          {project.title}
        </h3>
      </div>

    </motion.div>
  )
}

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [modalPhase, setModalPhase] = useState<'idle' | 'lettersIn' | 'lettersOut' | 'video'>('idle')
  const phaseTimersRef = useRef<number[]>([])

  const clearPhaseTimers = () => {
    phaseTimersRef.current.forEach((id) => window.clearTimeout(id))
    phaseTimersRef.current = []
  }

  const openProject = (project: typeof projects[0]) => {
    clearPhaseTimers()
    setSelectedProject(project)
    setModalPhase('lettersIn')

    const outTimer = window.setTimeout(() => {
      setModalPhase('lettersOut')
    }, 900)

    const videoTimer = window.setTimeout(() => {
      setModalPhase('video')
    }, 1500)

    phaseTimersRef.current.push(outTimer, videoTimer)
  }

  const closeProject = () => {
    clearPhaseTimers()
    setModalPhase('idle')
    setSelectedProject(null)
  }

  useEffect(() => {
    return () => {
      clearPhaseTimers()
    }
  }, [])

  useEffect(() => {
    if (!selectedProject) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedProject])

  useEffect(() => {
    if (!selectedProject) return

    const scrollY = window.scrollY
    const prevBodyOverflow = document.body.style.overflow
    const prevBodyPosition = document.body.style.position
    const prevBodyTop = document.body.style.top
    const prevBodyWidth = document.body.style.width
    const prevHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.documentElement.style.overflow = 'hidden'

    const preventDefault = (e: Event) => {
      e.preventDefault()
    }

    const preventScrollKeys = (e: KeyboardEvent) => {
      const blocked = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar']
      if (blocked.includes(e.key)) e.preventDefault()
    }

    window.addEventListener('wheel', preventDefault, { passive: false })
    window.addEventListener('touchmove', preventDefault, { passive: false })
    window.addEventListener('keydown', preventScrollKeys)

    const onFullscreenChange = () => {
      // После выхода из fullscreen у iframe меняются размеры viewport.
      // Принудительно пересчитываем pin/scrub-триггеры (About/Hero/Contact).
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () => {
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
      window.removeEventListener('keydown', preventScrollKeys)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.body.style.overflow = prevBodyOverflow
      document.body.style.position = prevBodyPosition
      document.body.style.top = prevBodyTop
      document.body.style.width = prevBodyWidth
      document.documentElement.style.overflow = prevHtmlOverflow
      window.scrollTo(0, scrollY)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }, [selectedProject])


  useEffect(() => {
    const shouldUseNativeCursor = Boolean(selectedProject && modalPhase === 'video')
    document.body.classList.toggle('video-modal-open', shouldUseNativeCursor)

    return () => {
      document.body.classList.remove('video-modal-open')
    }
  }, [selectedProject, modalPhase])

  const modalContent = (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeProject()
          }}
        >
          <AnimatePresence mode="wait">
            {modalPhase !== 'video' ? (
              <motion.div
                key="letters"
                className="pointer-events-none flex max-w-[92vw] flex-wrap items-center justify-center gap-x-[0.04em] gap-y-1 text-center font-bounded text-[clamp(2rem,10vw,7rem)] uppercase leading-[0.9] text-[#F5F7F6]"
              >
                {Array.from(selectedProject.title).map((char, index) => (
                  <motion.span
                    key={`${index}-${char}`}
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={
                      modalPhase === 'lettersOut'
                        ? { opacity: 0, y: -20, filter: 'blur(6px)' }
                        : { opacity: 1, y: 0, filter: 'blur(0px)' }
                    }
                    transition={{
                      duration: 0.42,
                      delay: index * 0.026,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="video"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden bg-black border border-[#F5F7F6]/10 shadow-2xl"
              >
                <CustomVideoPlayer 
                  url={selectedProject.video} 
                  title={selectedProject.title}
                  onClose={closeProject}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <section className="relative py-20 sm:py-24 lg:py-32 bg-[#080808] z-10" id="works">
        <PageShell>
        {/* шапка секции */}
        <div className="mb-14 sm:mb-16 lg:mb-24 flex flex-col gap-4 sm:gap-5">
          <span className="text-[10px] sm:text-sm font-['Bounded'] font-light uppercase tracking-[0.32em] sm:tracking-[0.5em] text-[#E10600]">
            ОЦЕНИШЬ?
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Bounded'] font-light tracking-tighter leading-[0.95]">
            ПОРТФОЛИО
          </h2>
          <p className="max-w-2xl text-[#F5F7F6]/40 font-['Bounded'] font-light text-[11px] sm:text-sm md:text-base tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.14em] leading-relaxed break-words normal-case sm:uppercase">
            Наши работы говорят сами за себя.
          </p>
        </div>

        {/* сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {projects.slice(0, 4).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => openProject(project)}
            />
          ))}
        </div>

        {/* кнопка на полный список */}
        <div className="mt-16 sm:mt-20 lg:mt-32 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/portfolio"
              className="group relative inline-flex px-8 sm:px-10 md:px-12 py-4 sm:py-5 overflow-hidden"
            >
              <div className="absolute inset-0 border border-[#E10600] group-hover:bg-[#E10600] transition-colors duration-500" />
              <span className="relative z-10 text-xs sm:text-sm font-['Bounded'] font-light tracking-[0.22em] sm:tracking-[0.3em] uppercase text-[#F5F7F6] group-hover:text-black transition-colors duration-500">
                Смотреть все
              </span>
            </Link>
          </motion.div>
        </div>
        </PageShell>
      </section>
      {typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null}
    </>
  )
}

export default Portfolio
