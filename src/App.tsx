import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'

// Настройка плагинов для плавной прокрутки и появления элементов
gsap.registerPlugin(ScrollTrigger)

// Проверяем, нужно ли показывать заставку (прелоадер)
const checkPreloaderDone = () => {
  // Если перешли с другой страницы этого же сайта, заставку не показываем
  const isNavFromInternal = sessionStorage.getItem('vv-nav-from-internal') === 'true';
  const isReferrerInternal = document.referrer && document.referrer.includes(window.location.origin);
  
  if (isNavFromInternal || isReferrerInternal) {
    console.log('Внутренний переход. Пропускаем заставку.')
    sessionStorage.removeItem('vv-nav-from-internal')
    return true
  }

  // Если пользователь еще не принял куки, показываем заставку всегда
  const cookieConsent = localStorage.getItem('vv-cookie-consent')
  if (!cookieConsent) {
    console.log('Куки не приняты. Показываем заставку.')
    return false
  }

  // Проверяем, не истекло ли время "сна" заставки (24 часа)
  const itemStr = localStorage.getItem('vv-preloader-done')
  if (!itemStr) return false
  try {
    const item = JSON.parse(itemStr)
    const timeLeft = item.expiry - Date.now()
    
    if (timeLeft <= 0) {
      console.log('Время ожидания вышло. Снова показываем заставку.')
      localStorage.removeItem('vv-preloader-done')
      return false
    }
    
    console.log(`Заставка пропущена. Появится снова через: ${Math.round(timeLeft / 1000)} сек.`)
    return item.value === '1'
  } catch {
    return itemStr === '1'
  }
}

function App() {
  // Настройки загрузки, прокрутки и якорей
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    return !checkPreloaderDone()
  })
  const lenisRef = useRef<Lenis | null>(null)
  const location = useLocation()
  const skipInitialHashScrollRef = useRef(true)

  // Функция сброса страницы в самое начало (вверх)
  const resetToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  useEffect(() => {
    // Настраиваем мягкий скролл
    const lenis = new Lenis({
      duration: 1.65,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.78,
      touchMultiplier: 0.9,
      syncTouch: true,
    })
    lenisRef.current = lenis

    // Соединяем скролл с анимациями
    lenis.on('scroll', ScrollTrigger.update)

    // Запускаем обновление кадров
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)

    // Убираем рывки при торможении сайта
    gsap.ticker.lagSmoothing(1000, 16)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove(onTick)
    }
  }, [])

  useEffect(() => {
    // Секретная клавиша для очистки памяти сайта (клавиша [ )
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '[') {
        localStorage.removeItem('vv-cookie-consent')
        localStorage.removeItem('vv-preloader-done')
        console.log('Память очищена. Перезагрузка...')
        window.location.reload()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    let unlockTimer: number | null = null

    if (loading) {
      // Пока идет загрузка, запрещаем крутить страницу
      lenisRef.current?.stop()
      lenisRef.current?.scrollTo(0, { immediate: true, force: true })
      resetToTop()
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
      body.style.touchAction = 'none'
      return
    }

    // После загрузки возвращаемся наверх и включаем скролл
    resetToTop()
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })

    // Мягко разрешаем листать страницу
    unlockTimer = window.setTimeout(() => {
      lenisRef.current?.start()
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.touchAction = ''
      // Обновляем позиции анимаций через секунду
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 1000)
    }, 420)

    return () => {
      if (unlockTimer) window.clearTimeout(unlockTimer)
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.touchAction = ''
    }
  }, [loading])

  useEffect(() => {
    if (loading) return

    // Логика перехода к нужному блоку (например, при клике в футере)
    const pendingSectionId = sessionStorage.getItem('vv-scroll-target')
    if (pendingSectionId && location.pathname === '/') {
      sessionStorage.removeItem('vv-scroll-target')
      setTimeout(() => {
        const target = document.getElementById(pendingSectionId)
        if (!target) return
        
        const targetEl = target.closest('.pin-spacer') || target;
        let top = targetEl.getBoundingClientRect().top + window.scrollY;
        
        if (pendingSectionId !== 'about') {
          const headerOffset = 100
          top -= headerOffset
        }
        
        window.scrollTo({ top, behavior: 'smooth' })
      }, 100)
      return
    }

    // Пропускаем прыжок к якорю при самом первом запуске
    if (skipInitialHashScrollRef.current) {
      skipInitialHashScrollRef.current = false
      return
    }

    // Плавный скролл к секциям по ссылке (типа /#contact)
    const hash = location.hash.replace('#', '')
    if (!hash) return

    const target = document.getElementById(hash)
    if (!target) return

    const headerOffset = 100
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }, [loading, location.pathname, location.hash])

  return (
    <main className="bg-[#080808] text-[#F5F7F6] selection:bg-[#E10600] selection:text-[#F5F7F6]">
      {/* Экран загрузки */}
      {loading && <Preloader onComplete={() => {
        resetToTop()
        const expiry = Date.now() + 24 * 60 * 60 * 1000 // Запоминаем на 24 часа
        localStorage.setItem('vv-preloader-done', JSON.stringify({ value: '1', expiry }))
        setLoading(false)
      }} />}

      {!loading && <Header />}

      {/* Основное содержимое сайта */}
      <div className={`app-shell ${loading ? '' : 'app-shell--ready'}`} aria-hidden={loading}>
        <div className="relative">
          <Hero />
          <About />
          <Portfolio />
          <Contact />
          <Footer />
        </div>
      </div>

      <CookieBanner />
    </main>
  )
}

export default App
