import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PageShell } from './PageShell'

const NAV = [
  { label: 'О НАС', to: '/', sectionId: 'about' },
  { label: 'РАБОТЫ', to: '/portfolio', sectionId: undefined },
  { label: 'СВЯЗЬ', to: '/', sectionId: 'contact' },
] as const

const Header = () => {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (sectionId?: string) => {
    setOpen(false) // Закрываем мобильное меню при клике

    if (!sectionId) return

    if (location.pathname === '/') {
      // Если мы на главной, плавно скроллим к нужному блоку
      const target = document.getElementById(sectionId)
      if (!target) return
      
      // Находим родительский spacer, если блок зафиксирован (pin) через GSAP
      const targetEl = target.closest('.pin-spacer') || target;
      let top = targetEl.getBoundingClientRect().top + window.scrollY;
      
      if (sectionId !== 'about') {
        const headerOffset = 100 // Отступ, чтобы заголовок не прятался под шапкой
        top -= headerOffset
      }
      
      window.scrollTo({ top, behavior: 'smooth' })
      return
    }

    // Если мы на другой странице, запоминаем цель и переходим на главную
    sessionStorage.setItem('vv-scroll-target', sectionId)
    sessionStorage.setItem('vv-nav-from-internal', 'true')
    navigate('/')
  }

  useEffect(() => {
    if (!open) return
    // Закрытие меню по кнопке Esc
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    // Запрещаем скролл сайта, когда открыто меню
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-[1000] py-4 sm:py-5 lg:py-6 ${
        open ? 'mix-blend-normal bg-[#080808]/95' : 'mix-blend-difference'
      }`}
    >
      {/* Затемнение + ссылки — под полосой шапки (z-0 … z-[5]) */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              role="presentation"
              className="fixed inset-0 z-0 cursor-pointer bg-black/80 backdrop-blur-md md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={menuId}
              className="fixed inset-0 z-[5] flex md:hidden pointer-events-none items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav
                id={menuId}
                className="pointer-events-auto flex w-full max-w-sm flex-col items-center gap-10 sm:gap-12"
              >
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => handleNavClick(item.sectionId)}
                      className="font-bounded text-3xl uppercase tracking-tighter text-[#F5F7F6] transition-colors hover:text-[#E10600] sm:text-4xl"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PageShell className="relative z-10 flex justify-between items-center">
        {/* лого vv */}
        <Link
          to="/"
          className="group shrink-0 cursor-pointer"
          aria-label="На главную"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-[60px] h-[47px] sm:w-[70px] sm:h-[55px] lg:w-[80px] lg:h-[63px] flex items-center justify-center overflow-visible">
            <svg width="80" height="63" viewBox="0 0 381 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-all duration-500 group-hover:scale-110">
              <path d="M341 0H41V300H341V0Z" fill="transparent"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M10.0263 150C10.0263 133.792 21.5088 120.154 37.7935 110.842C54.2057 101.458 76.4116 95.8462 100.263 95.8462C127.696 95.8462 151.676 102.981 168.089 115.292C176.062 121.274 182.212 125.385 190.5 125.385C198.788 125.385 204.938 121.274 212.911 115.292C229.324 102.981 253.304 95.8462 280.737 95.8462C304.589 95.8462 326.795 101.458 343.207 110.842C359.492 120.154 370.974 133.792 370.974 150C370.974 166.208 359.492 179.846 343.207 189.158C326.795 198.542 304.589 204.154 280.737 204.154C253.304 204.154 229.324 197.019 212.911 184.708C205.399 179.072 198.422 174.916 190.5 174.619C182.578 174.916 175.601 179.072 168.089 184.708C151.676 197.019 127.696 204.154 100.263 204.154C76.4116 204.154 54.2057 198.542 37.7935 189.158C21.5088 179.846 10.0263 166.208 10.0263 150ZM170.447 150C170.447 170.493 138.889 186.431 100.263 186.431C61.6369 186.431 30.0789 170.636 30.0789 150.143C30.0789 129.65 61.6369 113.569 100.263 113.569C138.889 113.569 170.447 129.507 170.447 150ZM210.553 150C210.553 170.493 242.111 186.431 280.737 186.431C319.363 186.431 350.921 170.636 350.921 150.143C350.921 129.65 319.363 113.569 280.737 113.569C242.111 113.569 210.553 129.507 210.553 150Z" fill="white" className="group-hover:fill-[#E10600] transition-colors duration-500"/>
            </svg>
          </div>
        </Link>

        {/* навигация (десктоп) */}
        <nav className="hidden md:flex gap-8 lg:gap-12 text-xs lg:text-sm font-['Bounded'] uppercase tracking-[0.22em] lg:tracking-widest font-medium">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => handleNavClick(item.sectionId)}
              className="inline-flex py-1 text-[#F5F7F6] transition-colors duration-300 hover:text-[#E10600]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Бургер — поверх оверлея (z-10 у PageShell) */}
        <button
          type="button"
          className="relative z-20 md:hidden -m-1.5 flex shrink-0 items-center justify-center p-2 text-[#F5F7F6] transition-opacity hover:opacity-70 active:opacity-55"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Закрыть' : 'Меню'}</span>
          {/* Две линии → крестик */}
          <div className="flex h-[9px] w-[22px] flex-col justify-between">
            <motion.span
              className="block h-[1px] w-full rounded-full bg-current [transform-origin:center]"
              animate={open ? { y: 4, rotate: 45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="block h-[1px] w-full rounded-full bg-current [transform-origin:center]"
              animate={open ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </button>
      </PageShell>
    </motion.header>
  )
}

export default Header
