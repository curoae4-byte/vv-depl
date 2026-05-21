import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import gsap from 'gsap'
import './Preloader.css'

interface PreloaderProps {
  onComplete: () => void
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  // Три стадии: прогресс загрузки → занавес приоткрыт → полное открытие
  const [stage, setStage] = useState<'intro' | 'veil' | 'enter'>('intro')
  const [progress, setProgress] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const leftCurtainRef = useRef<HTMLDivElement>(null)
  const rightCurtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Имитация процесса загрузки в процентах
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Когда 100%, переходим к стадии "занавес приоткрыт"
    if (progress === 100) {
      setTimeout(() => setStage('veil'), 500)
    }
  }, [progress])

  useEffect(() => {
    if (stage === 'veil') {
      // Слегка раздвигаем створки, чтобы был виден маскот
      gsap.to(leftCurtainRef.current, {
        xPercent: -10,
        duration: 2.5,
        ease: 'power2.inOut',
      })
      gsap.to(rightCurtainRef.current, {
        xPercent: 10,
        duration: 2.5,
        ease: 'power2.inOut',
      })
    }
  }, [stage])

  const handleEnter = () => {
    // Финальное открытие занавеса при клике на кнопку "Войти"
    if (isEntering) return
    setIsEntering(true)
    setStage('enter')

    const leftCurtain = leftCurtainRef.current
    const rightCurtain = rightCurtainRef.current
    if (!leftCurtain || !rightCurtain) return

    // Убираем временные эффекты перед полным открытием
    ;[leftCurtain, rightCurtain].forEach((curtain) => {
      gsap.killTweensOf(curtain)
      gsap.set(curtain, { rotateY: 0, rotateZ: 0, skewY: 0 })

      const spot = curtain.querySelector('.curtain-spot') as HTMLDivElement | null
      if (spot) {
        gsap.killTweensOf(spot)
        gsap.set(spot, { opacity: 0 })
      }
    })

    // Створки разъезжаются полностью, открывая сайт
    gsap.to(leftCurtain, {
      xPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      overwrite: 'auto',
    })
    gsap.to(rightCurtain, {
      xPercent: 100,
      duration: 1.5,
      ease: 'power4.inOut',
      overwrite: 'auto',
      onComplete: () => onComplete(),
    })
  }

  const handleCurtainHover = (e: React.MouseEvent) => {
    // Эффект "живой" ткани: занавес реагирует на движение мыши
    if (stage !== 'veil' || isEntering) return

    const target = e.currentTarget as HTMLDivElement
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const isLeft = target === leftCurtainRef.current

    // Вычисляем силу "толчка" ткани
    const innerEdgeDist = isLeft ? (rect.width - x) : x
    const edgeEffect = Math.max(0, 1 - innerEdgeDist / 450)
    const pushAmount = edgeEffect * (isLeft ? -15 : 15)

    const yRel = (y / rect.height - 0.5)

    // Анимируем наклон и растяжение ткани
    gsap.to(target, {
      xPercent: (isLeft ? -10 : 10) + pushAmount,
      rotateY: (isLeft ? 8 : -8) * edgeEffect,
      rotateZ: (isLeft ? -1 : 1) * edgeEffect * 2,
      skewY: yRel * (isLeft ? 4 : -4) * edgeEffect,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    // Двигаем "фонарик" подсветки за мышкой
    const spot = target.querySelector('.curtain-spot') as HTMLDivElement
    if (spot) {
      gsap.to(spot, {
        x: x,
        y: y,
        opacity: 0.4 * edgeEffect + 0.1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
  }

  const handleCurtainLeave = (e: React.MouseEvent) => {
    // Когда мышь уходит, ткань плавно возвращается в покой
    if (stage !== 'veil' || isEntering) return

    const target = e.currentTarget as HTMLDivElement
    const isLeft = target === leftCurtainRef.current
    
    gsap.to(target, {
      xPercent: isLeft ? -10 : 10,
      rotateY: 0,
      rotateZ: 0,
      skewY: 0,
      duration: 1.8,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    })
    
    const spot = target.querySelector('.curtain-spot') as HTMLDivElement
    if (spot) {
      gsap.to(spot, {
        opacity: 0,
        duration: 0.8,
        overwrite: 'auto',
      })
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-[#000000] overflow-hidden">
      {/* фон за занавесами */}
      <div className="absolute inset-0 bg-[#000000] flex flex-col items-center justify-center z-0">
        <AnimatePresence>
          {(stage === 'veil' || stage === 'enter') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col items-center"
            >
              {/* маскот за занавесами */}
              <div className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] mb-8 sm:mb-10 md:mb-12 flex items-center justify-center">
                
                {/* силуэт маскота */}
                <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
                  <defs>
                    <radialGradient id="veilBodyGradient" cx="50%" cy="40%" r="60%" fx="50%" fy="30%">
                      <stop offset="0%" stopColor="#0f0f0f" />
                      <stop offset="100%" stopColor="#000000" />
                    </radialGradient>
                  </defs>
                  
                  {/* Высокий «капюшонный» силуэт ближе к референсу */}
                  <path
                    fill="url(#veilBodyGradient)"
                    d="M100 10C66 10 40 30 34 70L20 184C20 190 26 194 34 194H166C174 194 180 190 180 184L166 70C160 30 134 10 100 10Z"
                  />
                  
                  {/* очки (svg path inline) */}
                  <g transform="translate(36, 66) scale(0.3555)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 55C0 38.5387 11.4523 24.6875 27.6943 15.2305C44.0635 5.69955 66.211 0 90 0C117.361 0 141.278 7.24606 157.647 19.75C165.6 25.825 171.734 30 180 30C188.266 30 194.4 25.825 202.353 19.75C218.722 7.24606 242.639 0 270 0C293.789 0 315.938 5.69945 332.307 15.2305C348.548 24.6875 360 38.5388 360 55C360 71.4612 348.548 85.3125 332.307 94.7695C315.938 104.301 293.789 110 270 110C242.639 110 218.722 102.754 202.353 90.25C194.86 84.5265 187.902 80.3051 180 80.0039C172.098 80.3051 165.14 84.5265 157.647 90.25C141.278 102.754 117.361 110 90 110C66.211 110 44.0635 104.3 27.6943 94.7695C11.4523 85.3125 0 71.4613 0 55ZM160 55C160 75.813 128.524 92 90 92C51.4751 92 20 75.958 20 55.1455C20 34.3325 51.4751 18 90 18C128.524 18 160 34.187 160 55ZM200 55C200 75.813 231.476 92 270 92C308.524 92 340 75.958 340 55.1455C340 34.3325 308.524 18 270 18C231.476 18 200 34.187 200 55Z"
                      fill="white"
                    />
                  </g>

                  {/* Минималистичные черты лица */}
                  <path
                    d="M100 100 L100 124"
                    stroke="#121212"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  
                  <path
                    d="M94 145 L106 145"
                    stroke="#101010"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* шум для "киношности" на весь фон */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.12] mix-blend-overlay" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }}
        />
      </div>

      {/* слой занавесов */}
      <div className="absolute inset-0 z-10 pointer-events-none perspective-[2500px]">
        {/* левый занавес */}
        <div
          ref={leftCurtainRef}
          onMouseMove={handleCurtainHover}
          onMouseLeave={handleCurtainLeave}
          className="curtain-panel curtain-panel--left pointer-events-auto origin-left shadow-[20px_0_100px_rgba(0,0,0,0.8)]"
        >
          <div className="curtain-fabric" />
          <div className="curtain-folds" />
          <div className="curtain-edge" />
          <div className="curtain-spot absolute w-[800px] h-[800px] bg-red-600/20 blur-[150px] rounded-full pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
        </div>
        
        {/* правый занавес */}
        <div
          ref={rightCurtainRef}
          onMouseMove={handleCurtainHover}
          onMouseLeave={handleCurtainLeave}
          className="curtain-panel curtain-panel--right pointer-events-auto origin-right shadow-[-20px_0_100px_rgba(0,0,0,0.8)]"
        >
          <div className="curtain-fabric" />
          <div className="curtain-folds curtain-folds--mirror" />
          <div className="curtain-edge curtain-edge--right" />
          <div className="curtain-spot absolute w-[800px] h-[800px] bg-red-600/20 blur-[150px] rounded-full pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
        </div>
      </div>

      {/* ui поверх всего */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* проценты + полоска */}
              <div className="text-3xl sm:text-4xl font-bounded text-[#E10600] mb-4 tracking-tighter">
                {progress}%
              </div>
              <div className="w-40 sm:w-48 h-[1px] bg-[#F5F7F6]/10 relative">
                <motion.div className="absolute inset-0 bg-[#E10600]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
              </div>
            </motion.div>
          )}
          {/* кнопка "войти" появляется на veil/enter */}
          {(stage === 'veil' || stage === 'enter') && (
            <motion.div
              key="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-28 sm:mt-36 md:mt-52 lg:mt-64" // опускаем кнопку ниже маскота
            >
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.1, textShadow: '0 0 15px rgba(235,0,0,1)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-7 sm:px-9 md:px-12 py-3 sm:py-4 text-lg sm:text-xl md:text-2xl font-bounded tracking-[0.2em] sm:tracking-widest text-[#F5F7F6] overflow-hidden pointer-events-auto"
              >
                <span className="relative z-10">ВОЙТИ</span>
                <div className="absolute inset-0 border border-[#E10600] opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-[#E10600]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Preloader
