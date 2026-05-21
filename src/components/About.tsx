import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { highlightWords } from '../utils/highlightWords'
import { PageShell } from './PageShell'

gsap.registerPlugin(ScrollTrigger)

const services: { title: string; description: ReactNode }[] = [
  {
    title: 'процесс',
    description: highlightWords(
      `Разработка от идеи до результатов:
        придумали → сняли → собрали → упаковали → проанализировали.`,
      ['придумали', 'сняли', 'собрали', 'упаковали', 'проанализировали']
    ),
  },
  {
    title: 'МИССИЯ',
    description: highlightWords(
      `Мы здесь, чтобы твой контент выделялся. 
      Мы здесь, чтобы твой контент работал и приносил охваты.`,
      ['Мы здесь', 'контент', 'выделялся', 'работал', 'приносил охваты.']
    ),
  },
  {
    title: 'ДОВЕРИЕ',
    description: highlightWords(
      `Мы не пропадаем после сделанной работы.
      Мы смотрим цифры, чистим слабое, усиливаем сильное.`,
      ['Мы не пропадаем', 'Мы смотрим цифры, чистим слабое, усиливаем сильное.']
    ),
  },
  {
    title: 'СЛОГАН',
    description: highlightWords(
      'Стиль как база, провокация как специя, цифры как результат.',
      ['Стиль', 'база','провокация','специя','цифры','результат']
    ),
  },
]

const About = () => {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const faces = gsap.utils.toArray('.cube-face') as HTMLElement[]
      const progressBar = document.querySelector('.about-progress-bar')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%', // 4 шага прокрутки для 4-х частей текста
          pin: true, // Фиксируем блок на экране
          scrub: true, // Привязываем анимацию к движению колесика
        }
      })

      // Начальные настройки для всех частей куба, кроме первой
      gsap.set(faces.slice(1), {
        yPercent: 100,
        rotationX: -50,
        scale: 0.75,
        opacity: 0,
        filter: 'blur(12px)' // Размытие для эффекта глубины
      })

      // Полоска прогресса сверху
      if (progressBar) {
        gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' })
        tl.to(progressBar, { scaleX: 1, ease: 'none', duration: faces.length - 1 }, 0)
      }

      // Настраиваем внутренние элементы каждой части
      faces.forEach((face, i) => {
        if (i > 0) {
          const img = face.querySelector('.face-bg-img')
          const content = face.querySelector('.face-content')
          if (img) gsap.set(img, { scale: 1.3, yPercent: -20 })
          if (content) gsap.set(content, { y: 80, opacity: 0 })
        }
      })

      // Создаем последовательность: одна часть уходит, другая приходит
      faces.forEach((face, i) => {
        if (i < faces.length - 1) {
          const nextFace = faces[i + 1]
          const img = face.querySelector('.face-bg-img')
          const content = face.querySelector('.face-content')
          const nextImg = nextFace.querySelector('.face-bg-img')
          const nextContent = nextFace.querySelector('.face-content')

          // Текущая часть улетает вверх и исчезает
          tl.to(face, {
            yPercent: -100,
            rotationX: 50,
            scale: 0.75,
            opacity: 0,
            filter: 'blur(12px)',
            ease: 'power2.inOut',
            duration: 1
          }, i)

          if (img) tl.to(img, { yPercent: 20, ease: 'power2.inOut', duration: 1 }, i)
          if (content) tl.to(content, { y: -80, opacity: 0, ease: 'power2.inOut', duration: 1 }, i)

          // Новая часть вылетает снизу и становится четкой
          tl.to(nextFace, {
            yPercent: 0,
            rotationX: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power2.inOut',
            duration: 1
          }, i)

          if (nextImg) tl.to(nextImg, { scale: 1, yPercent: 0, ease: 'power2.inOut', duration: 1 }, i)
          if (nextContent) tl.to(nextContent, { y: 0, opacity: 1, ease: 'power2.inOut', duration: 1 }, i)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="relative h-[100svh] w-full bg-[#080808] overflow-hidden z-10" 
      id="about"
      style={{ perspective: '2000px' }}
    >
      {/* прогресс по граням */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F5F7F6]/5 z-50">
        <div className="about-progress-bar h-full bg-[#E10600] w-full" />
      </div>

      {/* первая грань */}
      <div className="cube-face absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#080808] will-change-transform">
        <PageShell className="flex flex-col items-center text-center">
          <div className="face-content flex flex-col items-center">
            <h2 className="text-[clamp(1.55rem,8.3vw,5.7rem)] font-bounded tracking-tight sm:tracking-tighter mb-6 sm:mb-8 leading-[0.95]">
              НАША СУЩНОСТЬ
            </h2>
            <p className="max-w-2xl whitespace-pre-line text-sm sm:text-lg md:text-xl lg:text-2xl font-['Bounded'] font-light text-[#F5F7F6]/60 leading-relaxed break-words">
              {highlightWords(
                `Мы не просто студия монтажа.
                Мы — продюсерский центр контента.`,
                ['Мы — продюсерский центр контента.']
              )}
            </p>
          </div>
        </PageShell>
      </div>

      {/* остальные грани */}
      {services.map((service, index) => (
        <div 
          key={service.title} 
          className="cube-face absolute inset-0 w-full h-full bg-[#080808] will-change-transform"
        >
          {/* Фон — сплошной, как НАША СУЩНОСТЬ (без фото и градиентов) */}

          {/* контент — вертикальные поля сохранены, горизонталь как у всего сайта */}
          <div className="face-content relative z-10 flex h-full min-h-0 w-full max-w-full flex-col overflow-x-hidden py-4 sm:py-10 md:py-16 lg:py-24 xl:py-28">
            <PageShell className="flex h-full min-h-0 flex-1 flex-col justify-between">
            {/* верх */}
            <div className="flex justify-between items-center border-b border-[#F5F7F6]/10 pb-6 sm:pb-8">
              <span className="text-[#E10600] font-['Bounded'] font-light tracking-widest text-sm sm:text-lg">0{index + 1} / 04</span>
              <span className="text-[#F5F7F6]/30 font-['Bounded'] font-light tracking-[0.3em] uppercase text-[10px] sm:text-xs">Фаза</span>
            </div>

            {/* центр — min-w-0 + флюидный шрифт, чтобы длинные слова не резало */}
            <div className="flex min-w-0 w-full max-w-full flex-col gap-5 sm:gap-8">
              <h2
                className="w-full min-w-0 max-w-full font-['Bounded'] font-black text-[#F5F7F6] drop-shadow-2xl break-words [font-size:clamp(2rem,10vw,5rem)] sm:[font-size:clamp(2.5rem,8vw,6.5rem)] lg:[font-size:clamp(2.75rem,calc(2.8vw+1.35rem),7rem)] xl:[font-size:clamp(3rem,calc(2.2vw+1.5rem),7.5rem)] leading-[0.88] tracking-tight sm:tracking-tighter uppercase"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                {service.title}
              </h2>
              <p className="min-w-0 w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl whitespace-pre-line text-sm sm:text-lg md:text-2xl font-['Bounded'] font-light text-[#F5F7F6]/60 leading-relaxed break-words">
                {service.description}
              </p>
            </div>

            {/* низ */}
            <div className="flex items-center gap-4 pt-6 sm:pt-8 border-t border-[#F5F7F6]/10">
              <div
                className="rec-indicator-dot h-2 w-2 shrink-0 rounded-full bg-[#E10600] shadow-[0_0_10px_rgba(235,0,0,0.8)]"
                aria-hidden
              />
              <span className="text-[10px] sm:text-xs font-['Bounded'] font-light tracking-widest uppercase text-[#F5F7F6]/40">Valery Visuals</span>
            </div>
            </PageShell>
          </div>
        </div>
      ))}
    </section>
  )
}

export default About
