import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Instagram, Youtube, ArrowUpRight } from 'lucide-react'
import { PageShell } from './PageShell'
import { InstagramBannedNote } from './InstagramBannedNote'

const VkIcon = ({ className, size = 18 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden
  >
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 11.056 4.03 8.934 4.03 8.53c0-.204.102-.39.593-.39h1.744c.44 0 .612.204.78.678.847 2.454 2.27 4.613 2.862 4.613.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.322-.474.763-.474h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 3.605-2.354 3.605-.356.474-.474.678 0 1.203.254.305 1.084 1.084 1.084 1.084.508.542.678 1.017.508 1.49-.135.44-.593.474-1.084.474z" />
  </svg>
)

const TelegramIcon = ({ className, size = 18 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

type PopWord = {
  id: number
  text: 'э' | 'ой' | 'потише' | 'эй'
  x: number
  y: number
  delay: number
  rotate: number
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [popWords, setPopWords] = useState<PopWord[]>([])
  const [clickFxId, setClickFxId] = useState(0)
  const [clickPoint, setClickPoint] = useState({ x: 0, y: 0 })
  const [glassesTilt, setGlassesTilt] = useState({ rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 })
  const clearTimersRef = useRef<number[]>([])
  const tiltResetTimerRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleFooterNavClick = (sectionId?: string) => {
    if (!sectionId) return

    if (location.pathname === '/') {
      const target = document.getElementById(sectionId)
      if (!target) return
      
      const targetEl = target.closest('.pin-spacer') || target;
      let top = targetEl.getBoundingClientRect().top + window.scrollY;
      
      if (sectionId !== 'about') {
        const headerOffset = 100
        top -= headerOffset
      }
      
      window.scrollTo({ top, behavior: 'smooth' })
      return
    }

    sessionStorage.setItem('vv-scroll-target', sectionId)
    sessionStorage.setItem('vv-nav-from-internal', 'true')
    navigate('/')
  }

  const triggerGlassesWords = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const originX = event.clientX - rect.left - rect.width / 2
    const originY = event.clientY - rect.top - rect.height / 2

    const texts: Array<PopWord['text']> = ['э', 'ой', 'потише', 'эй']
    const angle = Math.random() * Math.PI * 2
    const radius = 120 + Math.random() * 110
    const wordId = Date.now() + Math.floor(Math.random() * 1000)
    const generated = [{
      id: wordId,
      text: texts[Math.floor(Math.random() * texts.length)],
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.58,
      delay: 0,
      rotate: -16 + Math.random() * 32,
    }]

    setPopWords((prev) => [...prev, ...generated])
    setClickPoint({ x: originX, y: originY })
    setClickFxId(Date.now())

    const randomSigned = (min: number, max: number) => {
      const value = min + Math.random() * (max - min)
      return Math.random() > 0.5 ? value : -value
    }

    setGlassesTilt({
      rotateX: randomSigned(2.5, 5),
      rotateY: randomSigned(3, 6),
      rotateZ: randomSigned(0.8, 2.2),
      scale: 0.97,
    })

    if (tiltResetTimerRef.current) window.clearTimeout(tiltResetTimerRef.current)
    tiltResetTimerRef.current = window.setTimeout(() => {
      setGlassesTilt({ rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 })
      tiltResetTimerRef.current = null
    }, 180)

    const timerId = window.setTimeout(() => {
      setPopWords((prev) => prev.filter((word) => word.id !== wordId))
      clearTimersRef.current = clearTimersRef.current.filter((id) => id !== timerId)
    }, 1400)
    clearTimersRef.current.push(timerId)
  }

  useEffect(() => {
    return () => {
      clearTimersRef.current.forEach((id) => window.clearTimeout(id))
      clearTimersRef.current = []
      if (tiltResetTimerRef.current) window.clearTimeout(tiltResetTimerRef.current)
    }
  }, [])

  return (
    <footer className="relative bg-[#080808] border-t border-[#F5F7F6]/5 pt-20 sm:pt-24 lg:pt-32 pb-10 sm:pb-12 z-10" id="contact">
      <PageShell>
        {/* Основной контент футера */}
        {/* Адаптивная сетка: на мобилках в один столбец, на планшетах и выше — в несколько */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-14 lg:gap-16 mb-16 sm:mb-20 lg:mb-24">
          {/* Блок бренда */}
          <div className="col-span-1 min-w-0 md:col-span-2 lg:col-span-2">
            <h2 className="text-[clamp(1rem,4.2vw,3.2rem)] font-bounded tracking-tight sm:tracking-tighter mb-6 sm:mb-8 leading-[0.94]">
              <span className="block whitespace-nowrap">VALERY</span>
              <span className="block whitespace-nowrap">VISUALS</span>
            </h2>
            <p className="max-w-md text-[#F5F7F6]/40 font-['Bounded'] font-light text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 lg:mb-12 uppercase tracking-[0.12em] sm:tracking-[0.28em] break-words">
              Продюсерский центр контента, где эстетика встречается с результатом.
            </p>
            
            {/* Ссылки на соцсети */}
            <div className="flex flex-wrap items-start gap-4 sm:gap-6">
              <div className="flex w-10 flex-col items-center gap-1.5 sm:w-12">
                <motion.a
                  href="#"
                  aria-label="Instagram"
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F5F7F6]/10 text-[#F5F7F6] transition-[color,border-color] duration-200 ease-out hover:border-[#E10600] hover:text-[#E10600] sm:h-12 sm:w-12"
                >
                  <Instagram size={18} className="sm:h-5 sm:w-5" />
                </motion.a>
                <InstagramBannedNote />
              </div>
              {[
                { href: '#', label: 'ВКонтакте', Icon: VkIcon },
                { href: '#', label: 'Telegram', Icon: TelegramIcon },
                { href: '#', label: 'YouTube', Icon: Youtube },
              ].map(({ href, label, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F5F7F6]/10 text-[#F5F7F6] transition-[color,border-color] duration-200 ease-out hover:border-[#E10600] hover:text-[#E10600] sm:h-12 sm:w-12"
                >
                  <Icon size={18} className="sm:w-5 sm:h-5 text-inherit" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <div className="flex flex-col gap-6 sm:gap-8 min-w-0">
            <span className="text-[10px] font-['Bounded'] font-light uppercase tracking-[0.35em] sm:tracking-[0.5em] text-[#E10600]">НАВИГАЦИЯ</span>
            <ul className="flex flex-col gap-3 sm:gap-4 font-bounded text-base sm:text-lg md:text-xl uppercase tracking-tighter">
              {[
                { label: 'О нас', to: '/', sectionId: 'about' },
                { label: 'Работы', to: '/portfolio' },
                { label: 'Связь', to: '/', sectionId: 'contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => handleFooterNavClick(item.sectionId)}
                    className="inline-flex py-1 text-[#F5F7F6] transition-colors duration-300 hover:text-[#E10600]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div className="flex flex-col gap-6 sm:gap-8 min-w-0">
            <span className="text-[10px] font-['Bounded'] font-light uppercase tracking-[0.35em] sm:tracking-[0.5em] text-[#E10600]">ПООБЩАЕМСЯ?</span>
            <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
              <a
                href="mailto:hello@valeryvisuals.com"
                className="group relative flex w-full min-w-0 max-w-full items-start gap-3 sm:gap-4 overflow-visible"
              >
                {/* Почта с небольшим наклоном для стиля */}
                <div className="inline-block min-w-0 max-w-[calc(100%-2rem)] origin-left -rotate-[3.5deg] border-l-2 border-[#E10600]/45 pl-3 sm:pl-4 py-1 transition-[border-color,transform] duration-300 ease-out group-hover:-rotate-2 group-hover:border-[#E10600]">
                  <span className="block font-['Bounded'] font-light uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[clamp(0.66rem,2.6vw,0.98rem)] text-[#F5F7F6] leading-[1.15] transition-colors group-hover:text-[#E10600]">
                    hello@
                  </span>
                  <span className="block font-['Bounded'] font-light uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[clamp(0.62rem,2.35vw,0.92rem)] text-[#F5F7F6]/90 leading-[1.2] transition-colors group-hover:text-[#E10600]">
                    valeryvisuals.com
                  </span>
                </div>
                <ArrowUpRight
                  size={20}
                  className="mt-1 shrink-0 text-[#F5F7F6]/50 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-[#E10600]"
                />
              </a>
              <p className="text-[#F5F7F6]/40 font-['Bounded'] font-light text-xs sm:text-sm uppercase tracking-[0.12em] sm:tracking-widest leading-relaxed break-words">
                мы везде. <br />
                мы все видим.
              </p>
            </div>
          </div>
        </div>

        {/* Плашки наград (декоративные) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 py-8 sm:py-10 lg:py-12 border-y border-[#F5F7F6]/5 mb-10 sm:mb-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {['PRIZZZ', 'NAGRADA', 'necmotri', 'ladno'].map((award) => (
            <div key={award} className="flex items-center justify-center text-[9px] sm:text-[10px] font-['Bounded'] font-light tracking-[0.18em] sm:tracking-[0.3em] uppercase text-center">
              {award}
            </div>
          ))}
        </div>

        {/* Фирменные очки с анимацией */}
        <div className="mb-10 sm:mb-12 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -6, 0], rotateX: [0, 6, 0], rotateY: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
            style={{ transformStyle: 'preserve-3d', perspective: 900 }}
            aria-hidden="true"
            onClick={triggerGlassesWords}
          >
            <motion.div
              animate={glassesTilt}
              transition={{ type: 'spring', stiffness: 360, damping: 20, mass: 0.5 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 360 110"
                fill="none"
                className="w-[min(58vw,360px)] cursor-pointer select-none"
              >
                <defs>
                  <linearGradient id="footerRimGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f1f1f1" stopOpacity="1" />
                    <stop offset="25%" stopColor="#bdbdbd" stopOpacity="1" />
                    <stop offset="58%" stopColor="#6a6a6a" stopOpacity="1" />
                    <stop offset="100%" stopColor="#151515" stopOpacity="1" />
                  </linearGradient>
                  <radialGradient id="footerLensGrad" cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stopColor="#080808" stopOpacity="1" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                  </radialGradient>
                </defs>

                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 55C0 38.5387 11.4523 24.6875 27.6943 15.2305C44.0635 5.69955 66.211 0 90 0C117.361 0 141.278 7.24606 157.647 19.75C165.6 25.825 171.734 30 180 30C188.266 30 194.4 25.825 202.353 19.75C218.722 7.24606 242.639 0 270 0C293.789 0 315.938 5.69945 332.307 15.2305C348.548 24.6875 360 38.5388 360 55C360 71.4612 348.548 85.3125 332.307 94.7695C315.938 104.301 293.789 110 270 110C242.639 110 218.722 102.754 202.353 90.25C194.86 84.5265 187.902 80.3051 180 80.0039C172.098 80.3051 165.14 84.5265 157.647 90.25C141.278 102.754 117.361 110 90 110C66.211 110 44.0635 104.3 27.6943 94.7695C11.4523 85.3125 0 71.4613 0 55ZM160 55C160 75.813 128.524 92 90 92C51.4751 92 20 75.958 20 55.1455C20 34.3325 51.4751 18 90 18C128.524 18 160 34.187 160 55ZM200 55C200 75.813 231.476 92 270 92C308.524 92 340 75.958 340 55.1455C340 34.3325 308.524 18 270 18C231.476 18 200 34.187 200 55Z"
                  fill="url(#footerRimGrad)"
                />
                <path
                  d="M160 55C160 75.813 128.524 92 90 92C51.4751 92 20 75.958 20 55.1455C20 34.3325 51.4751 18 90 18C128.524 18 160 34.187 160 55Z"
                  fill="url(#footerLensGrad)"
                />
                <path
                  d="M200 55C200 75.813 231.476 92 270 92C308.524 92 340 75.958 340 55.1455C340 34.3325 308.524 18 270 18C231.476 18 200 34.187 200 55Z"
                  fill="url(#footerLensGrad)"
                />
              </svg>
            </motion.div>

            {clickFxId > 0 && (
              <motion.span
                key={clickFxId}
                className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F5F7F6]/35"
                style={{ x: clickPoint.x, y: clickPoint.y }}
                initial={{ opacity: 0.8, scale: 0.35 }}
                animate={{ opacity: 0, scale: 3.1 }}
                transition={{ duration: 0.46, ease: 'easeOut' }}
              />
            )}

            {popWords.map((word) => (
              <motion.span
                key={word.id}
                className="pointer-events-none absolute left-1/2 top-1/2 font-['Bounded'] font-light uppercase text-[#F5F7F6]/90 text-xs sm:text-sm tracking-[0.18em] sm:tracking-[0.26em] whitespace-nowrap"
                style={{ x: word.x, y: word.y }}
                initial={{ opacity: 0, scale: 0.35, filter: 'blur(6px)' }}
                animate={{ opacity: [0, 1, 0], scale: [0.35, 1, 0.92], y: [word.y, word.y - 16, word.y - 26], rotate: [word.rotate, word.rotate + 6, word.rotate - 4], filter: ['blur(6px)', 'blur(0px)', 'blur(3px)'] }}
                transition={{ duration: 1.05, delay: word.delay, ease: 'easeOut' }}
              >
                {word.text}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Нижняя строка с копирайтом */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-8 text-[9px] sm:text-[10px] font-['Bounded'] font-light uppercase tracking-[0.12em] sm:tracking-[0.3em] text-[#F5F7F6]/20 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p className="break-words">© {currentYear} VALERY VISUALS.</p>
            <Link to="/cookie-policy" className="hover:text-[#F5F7F6] transition-colors underline underline-offset-4 decoration-[#F5F7F6]/20 hover:decoration-[#F5F7F6]">
              Политика Cookie
            </Link>
          </div>
          <p className="flex items-center gap-2">
            ЗАДИЗАЙНЕНО И СДЕЛАНО <span className="text-[#E10600] opacity-100">lipa</span>
          </p>
        </div>
      </PageShell>
    </footer>
  )
}

export default Footer
