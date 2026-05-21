import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PageShell } from './PageShell'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const sectionRef   = useRef<HTMLElement>(null)
  const headingRef   = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const btnRef       = useRef<HTMLAnchorElement>(null)
  const lineLeftRef  = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section   = sectionRef.current
    const heading   = headingRef.current
    const sub       = subRef.current
    const btn       = btnRef.current
    const lineLeft  = lineLeftRef.current
    const lineRight = lineRightRef.current
    if (!section || !heading || !sub || !btn) return

    const ctx = gsap.context(() => {
      // Прячем всё перед началом анимации
      gsap.set(heading, { y: 36, opacity: 0, filter: 'blur(6px)' })
      gsap.set([sub, btn],  { opacity: 0, y: 40, filter: 'blur(8px)' })
      gsap.set([lineLeft, lineRight], { scaleX: 0 })

      // Настраиваем очередь анимаций
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%', // Запускаем, когда докрутили до 75% блока
          toggleActions: 'play none none none',
        },
      })

      // 1. Сначала раздвигаем линии в стороны
      tl.to([lineLeft, lineRight], {
        scaleX: 1,
        duration: 0.9,
        ease: 'power3.inOut',
        stagger: 0.06,
      })

      // 2. Затем плавно проявляем заголовок
      tl.to(heading, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.85,
        ease: 'power3.out',
      }, '-=0.5')

      // 3. В конце показываем текст и кнопку
      tl.to([sub, btn], {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.14,
        ease: 'power3.out',
      }, '-=0.4')

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden py-28 sm:py-36 lg:py-48 flex flex-col items-center justify-center"
    >
      <PageShell className="relative z-10 flex flex-col items-center text-center">

        {/* Верхняя линия */}
        <div className="w-full flex items-center gap-6 mb-12 sm:mb-16">
          <div
            ref={lineLeftRef}
            className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-white/25 origin-left"
          />
          <span className="text-[10px] sm:text-xs font-['Bounded'] uppercase tracking-[0.45em] text-[#F5F7F6]/30 shrink-0">
            Поработаем?
          </span>
          <div
            ref={lineRightRef}
            className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-white/25 to-white/25 origin-right"
          />
        </div>

        {/* Заголовок в минималистичном стиле */}
        <h2
          ref={headingRef}
          className="text-[clamp(1.8rem,10vw,6.5rem)] font-bounded tracking-tight sm:tracking-tighter leading-[0.95] text-[#F5F7F6] mb-8 sm:mb-12"
        >
          СВЯЗЬ
        </h2>

        {/* Подзаголовок */}
        <p
          ref={subRef}
          className="max-w-xl text-sm sm:text-lg md:text-xl font-['Bounded'] text-[#F5F7F6]/50 leading-relaxed uppercase tracking-[0.12em] mb-12 sm:mb-16"
        >
          Пиши нам — обсудим идею,<br />
          сроки и что сделает контент незабываемым.
        </p>

        {/* кнопка действия */}
        <a
          ref={btnRef}
          href="mailto:hello@valeryvisuals.com"
          className="group relative inline-flex items-center gap-4 px-10 sm:px-14 py-5 sm:py-6 font-['Bounded'] font-light text-sm sm:text-base tracking-[0.25em] uppercase text-[#F5F7F6] overflow-hidden"
        >
          {/* Фоновый fill при ховере */}
          <span className="absolute inset-0 border border-[#E10600]/50 group-hover:border-[#E10600] transition-colors duration-500" />
          <span className="absolute inset-0 bg-[#E10600] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

          <span className="relative z-10 group-hover:text-black transition-colors duration-300">
            Написать нам
          </span>

          {/* Стрелка */}
          <svg
            className="relative z-10 w-4 h-4 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        {/* Нижняя линия с имейлом */}
        <div className="mt-16 sm:mt-24 flex items-center gap-5 text-[10px] sm:text-xs font-['Bounded'] uppercase tracking-[0.35em] text-[#F5F7F6]/20">
          <div className="w-8 h-[1px] bg-[#F5F7F6]/20" />
          <span>hello@valeryvisuals.com</span>
          <div className="w-8 h-[1px] bg-[#F5F7F6]/20" />
        </div>
      </PageShell>

      {/* Нижняя линия-разделитель */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}

export default Contact
