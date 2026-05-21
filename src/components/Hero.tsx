import { useEffect, useRef } from 'react'
import { PageShell } from './PageShell'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const stickyRef   = useRef<HTMLDivElement>(null)
  const glassesRef  = useRef<HTMLDivElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)
  const glareLeftRef  = useRef<SVGEllipseElement>(null)
  const glareRightRef = useRef<SVGEllipseElement>(null)

  /* ── Эффект наклона очков и движение бликов при движении мыши ────────────────────────── */
  useEffect(() => {
    const sticky      = stickyRef.current
    const glasses     = glassesRef.current
    const glareLeft   = glareLeftRef.current
    const glareRight  = glareRightRef.current
    if (!sticky || !glasses) return

    const rotateXTo = gsap.quickTo(glasses, 'rotationX', { ease: 'power3', duration: 0.6 })
    const rotateYTo = gsap.quickTo(glasses, 'rotationY', { ease: 'power3', duration: 0.6 })

    // Базовые позиции бликов
    const GLARE_L = { cx: 62, cy: 28 }
    const GLARE_R = { cx: 242, cy: 28 }

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth   // Позиция X (от 0 до 1)
      const ny = e.clientY / window.innerHeight  // Позиция Y (от 0 до 1)

      const rotY = gsap.utils.interpolate(-10, 10, nx)  // Наклон влево-вправо
      const rotX = gsap.utils.interpolate(10, -10, ny)  // Наклон вверх-вниз

      rotateXTo(rotX)
      rotateYTo(rotY)

      // Блики двигаются навстречу повороту, как настоящие отражения
      const dx = rotY * -1.4   // Сдвиг по горизонтали
      const dy = rotX *  0.9   // Сдвиг по вертикали

      if (glareLeft) {
        gsap.to(glareLeft, {
          attr: { cx: GLARE_L.cx + dx, cy: GLARE_L.cy + dy },
          opacity: gsap.utils.interpolate(0.18, 0.42, 1 - nx),
          duration: 0.5, ease: 'power2.out',
        })
      }
      if (glareRight) {
        gsap.to(glareRight, {
          attr: { cx: GLARE_R.cx + dx, cy: GLARE_R.cy + dy },
          opacity: gsap.utils.interpolate(0.18, 0.42, 1 - nx),
          duration: 0.5, ease: 'power2.out',
        })
      }
    }

    const onLeave = () => {
      // Возвращаем в центр, когда мышь уходит
      rotateXTo(0); rotateYTo(0)
      if (glareLeft)  gsap.to(glareLeft,  { attr: { cx: GLARE_L.cx, cy: GLARE_L.cy }, opacity: 0.28, duration: 0.8 })
      if (glareRight) gsap.to(glareRight, { attr: { cx: GLARE_R.cx, cy: GLARE_R.cy }, opacity: 0.28, duration: 0.8 })
    }

    sticky.addEventListener('pointermove', onMove)
    sticky.addEventListener('pointerleave', onLeave)
    return () => {
      sticky.removeEventListener('pointermove', onMove)
      sticky.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  /* ── Анимации при прокрутке страницы ─────────────────────────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current
    const glasses = glassesRef.current
    const text    = textRef.current
    if (!wrapper || !glasses || !text) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Привязываем анимацию к движению скролла
        },
      })

      // Очки плавно исчезают и уменьшаются при скролле вниз
      tl.fromTo(
        glasses,
        { scale: 1.18, opacity: 0.92 },
        { scale: 0.72, opacity: 0.07, ease: 'none' },
        0
      )

      // Текст заголовка плавно появляется
      tl.fromTo(
        text,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'none' },
        0.32
      )

      // Появление строк заголовка по очереди
      tl.fromTo(
        '.hero-title-line',
        { yPercent: 120, rotateX: -24, opacity: 0, filter: 'blur(12px)' },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.12,
          ease: 'none',
        },
        0.38
      )

      // Мягкое появление подзаголовка
      tl.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 24, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'none' },
        0.52
      )
    }, wrapper)

    return () => ctx.revert()
  }, [])

  return (
    /* Внешний контейнер с высотой для скролла */
    <div ref={wrapperRef} className="relative h-[280vh]" id="hero">

      {/* Липкий блок — висит на экране, пока мы крутим страницу */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-28"
        style={{ perspective: '900px' }}
      >
        {/* Декоративные уголки «камеры» */}
        <div className="pointer-events-none absolute inset-0 z-[3] flex justify-center" aria-hidden>
          <div className="relative h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="absolute left-2 top-[5.25rem] h-8 w-8 border-l-2 border-t-2 border-[#F5F7F6]/90 sm:left-3 sm:top-[5.75rem] sm:h-9 sm:w-9 md:left-4 md:top-24" />
            <div className="absolute right-2 top-[5.25rem] h-8 w-8 border-r-2 border-t-2 border-[#F5F7F6]/90 sm:right-3 sm:top-[5.75rem] sm:h-9 sm:w-9 md:right-4 md:top-24" />
            <div className="absolute bottom-24 left-2 h-8 w-8 border-b-2 border-l-2 border-[#F5F7F6]/90 sm:bottom-28 sm:left-3 sm:h-9 sm:w-9 md:bottom-32 md:left-4" />
            <div className="absolute bottom-24 right-2 h-8 w-8 border-b-2 border-r-2 border-[#F5F7F6]/90 sm:bottom-28 sm:right-3 sm:h-9 sm:w-9 md:bottom-32 md:right-4" />
          </div>
        </div>

        {/* Контейнер с очками */}
        <div
          ref={glassesRef}
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d', scale: 1.18, opacity: 0.92 }}
        >
          {/* SVG-рисунок очков */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 360 110"
            fill="none"
            aria-hidden="true"
            className="w-[min(82vw,760px)] select-none"
            style={{ filter: 'drop-shadow(0 4px 32px rgba(0,0,0,0.9)) drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }}
          >
            <defs>
              {/* Оправа — градиент для эффекта металла */}
              <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#e8e8e8" stopOpacity="1" />
                <stop offset="22%"  stopColor="#c0c0c0" stopOpacity="1" />
                <stop offset="55%"  stopColor="#6a6a6a" stopOpacity="1" />
                <stop offset="100%" stopColor="#111111" stopOpacity="1" />
              </linearGradient>

              {/* Линзы — черный цвет */}
              <radialGradient id="lensL" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#050505" stopOpacity="1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="1" />
              </radialGradient>
              <radialGradient id="lensR" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#050505" stopOpacity="1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="1" />
              </radialGradient>

              {/* Эффект тени внутри линз */}
              <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset dx="0" dy="3" result="offsetBlur" />
                <feComposite in="offsetBlur" in2="SourceAlpha" operator="in" result="shadow" />
                <feColorMatrix in="shadow" type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0"
                  result="coloredShadow" />
                <feMerge>
                  <feMergeNode in="coloredShadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Размытие для бликов */}
              <filter id="glareBlur">
                <feGaussianBlur stdDeviation="2.2" />
              </filter>
            </defs>

            {/* ── ОПРАВА ── */}
            <path
              fillRule="evenodd" clipRule="evenodd"
              d="M0 55C0 38.5387 11.4523 24.6875 27.6943 15.2305C44.0635 5.69955 66.211 0 90 0C117.361 0 141.278 7.24606 157.647 19.75C165.6 25.825 171.734 30 180 30C188.266 30 194.4 25.825 202.353 19.75C218.722 7.24606 242.639 0 270 0C293.789 0 315.938 5.69945 332.307 15.2305C348.548 24.6875 360 38.5388 360 55C360 71.4612 348.548 85.3125 332.307 94.7695C315.938 104.301 293.789 110 270 110C242.639 110 218.722 102.754 202.353 90.25C194.86 84.5265 187.902 80.3051 180 80.0039C172.098 80.3051 165.14 84.5265 157.647 90.25C141.278 102.754 117.361 110 90 110C66.211 110 44.0635 104.3 27.6943 94.7695C11.4523 85.3125 0 71.4613 0 55ZM160 55C160 75.813 128.524 92 90 92C51.4751 92 20 75.958 20 55.1455C20 34.3325 51.4751 18 90 18C128.524 18 160 34.187 160 55ZM200 55C200 75.813 231.476 92 270 92C308.524 92 340 75.958 340 55.1455C340 34.3325 308.524 18 270 18C231.476 18 200 34.187 200 55Z"
              fill="url(#rimGrad)"
            />

            {/* ── ЛЕВАЯ ЛИНЗА ── */}
            <path
              d="M160 55C160 75.813 128.524 92 90 92C51.4751 92 20 75.958 20 55.1455C20 34.3325 51.4751 18 90 18C128.524 18 160 34.187 160 55Z"
              fill="url(#lensL)"
              filter="url(#innerShadow)"
            />

            {/* ── ПРАВАЯ ЛИНЗА ── */}
            <path
              d="M200 55C200 75.813 231.476 92 270 92C308.524 92 340 75.958 340 55.1455C340 34.3325 308.524 18 270 18C231.476 18 200 34.187 200 55Z"
              fill="url(#lensR)"
              filter="url(#innerShadow)"
            />

            {/* ── БЛИКИ (двигаются за мышью) ── */}
            <ellipse
              ref={glareLeftRef}
              cx="62" cy="28" rx="24" ry="7"
              fill="white" opacity="0.28"
              filter="url(#glareBlur)"
              transform="rotate(-16 62 28)"
            />
            <ellipse
              ref={glareRightRef}
              cx="242" cy="28" rx="24" ry="7"
              fill="white" opacity="0.28"
              filter="url(#glareBlur)"
              transform="rotate(-16 242 28)"
            />

            {/* ── Тонкий контур очков ── */}
            <path
              fillRule="evenodd" clipRule="evenodd"
              d="M0 55C0 38.5387 11.4523 24.6875 27.6943 15.2305C44.0635 5.69955 66.211 0 90 0C117.361 0 141.278 7.24606 157.647 19.75C165.6 25.825 171.734 30 180 30C188.266 30 194.4 25.825 202.353 19.75C218.722 7.24606 242.639 0 270 0C293.789 0 315.938 5.69945 332.307 15.2305C348.548 24.6875 360 38.5388 360 55C360 71.4612 348.548 85.3125 332.307 94.7695C315.938 104.301 293.789 110 270 110C242.639 110 218.722 102.754 202.353 90.25C194.86 84.5265 187.902 80.3051 180 80.0039C172.098 80.3051 165.14 84.5265 157.647 90.25C141.278 102.754 117.361 110 90 110C66.211 110 44.0635 104.3 27.6943 94.7695C11.4523 85.3125 0 71.4613 0 55ZM160 55C160 75.813 128.524 92 90 92C51.4751 92 20 75.958 20 55.1455C20 34.3325 51.4751 18 90 18C128.524 18 160 34.187 160 55ZM200 55C200 75.813 231.476 92 270 92C308.524 92 340 75.958 340 55.1455C340 34.3325 308.524 18 270 18C231.476 18 200 34.187 200 55Z"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Текстовый блок заголовка */}
        <PageShell className="relative z-10">
          <div
            ref={textRef}
            className="mx-auto max-w-6xl text-center"
            style={{ opacity: 0, transform: 'translateY(36px)' }}
          >
          <div className="mb-8">
            <h1 className="text-[clamp(1.9rem,9.8vw,6rem)] xl:text-[7rem] font-bounded font-black tracking-tight sm:tracking-tighter leading-[0.93] mb-4 text-[#F5F7F6] [perspective:800px] break-normal">
              <span className="block overflow-hidden">
                <span className="hero-title-line block whitespace-nowrap font-black [transform-origin:50%_100%] will-change-transform">
                  <span className="inline-block [transform:scaleX(1.18)]">VALERY</span>
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-title-line block whitespace-nowrap font-black [transform-origin:50%_100%] will-change-transform">
                  <span className="inline-block [transform:scaleX(1.18)]">VISUALS</span>
                </span>
              </span>
            </h1>

            <p className="hero-subtitle text-[12px] sm:text-base md:text-xl lg:text-2xl font-['Bounded'] font-light uppercase tracking-[0.12em] sm:tracking-[0.24em] text-[#F5F7F6]/70 max-w-3xl mx-auto px-1 break-normal">
              Продюсерский центр контента. <br />
              <span className="text-[#E10600]">СТИЛЬ. ЦИФРЫ. ПРОВОКАЦИЯ.</span>
            </p>
          </div>
          </div>
        </PageShell>

        {/* Подсказка для пользователя */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
        >
          <span className="mb-2 sm:mb-3 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.28em] font-medium text-[#F5F7F6]/55">
            Поскроль ;)
          </span>
          <motion.div
            animate={{
              y: [0, 3, 0],
              scaleY: [1, 0.96, 1.02, 1],
              scaleX: [1, 1.02, 0.99, 1],
              opacity: [0.82, 0.95, 0.82],
            }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            className="origin-top"
          >
            <svg
              width="16" height="20" viewBox="0 0 24 30"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_8px_rgba(235,0,0,0.28)]"
              aria-hidden="true"
            >
              <path
                d="M12 2V20M12 20L5 13M12 20L19 13"
                stroke="#E10600" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Эффект шума на фоне */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] z-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>
    </div>
  )
}

export default Hero
