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

// gsap + scrolltrigger: скролл-сцены (hero/about/contact) + синк с lenis
gsap.registerPlugin(ScrollTrigger)

// Вспомогательные функции для проверки срока жизни сохраненных данных
const checkPreloaderDone = () => {
  // Если мы перешли по внутренней навигации (через Header или Link),
  // то прелоадер показывать не нужно
  const isNavFromInternal = sessionStorage.getItem('vv-nav-from-internal') === 'true';
  const isReferrerInternal = document.referrer && document.referrer.includes(window.location.origin);
  
  if (isNavFromInternal || isReferrerInternal) {
    console.log('Internal navigation detected. Skipping preloader.')
    sessionStorage.removeItem('vv-nav-from-internal') // Очищаем метку после использования
    return true
  }

  // Если пользователь еще не сделал выбор по куки (ни accepted, ни declined),
  // то прелоадер должен показываться каждый раз (возвращаем false)
  const cookieConsent = localStorage.getItem('vv-cookie-consent')
  if (!cookieConsent) {
    console.log('No cookie consent found. Preloader will show every time.')
    return false
  }

  const itemStr = localStorage.getItem('vv-preloader-done')
  if (!itemStr) return false
  try {
    const item = JSON.parse(itemStr)
    const timeLeft = item.expiry - Date.now()
    
    if (timeLeft <= 0) {
      console.log('Preloader timer expired. Showing preloader...')
      localStorage.removeItem('vv-preloader-done')
      return false
    }
    
    console.log(`Preloader skipped. Appears again in: ${Math.round(timeLeft / 1000)}s`)
    return item.value === '1'
  } catch {
    return itemStr === '1'
  }
}

function App() {
  //  загрузка/скролл/якоря
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    // Теперь прелоадер показывается по расписанию, даже если куки приняты
    return !checkPreloaderDone()
  })
  const lenisRef = useRef<Lenis | null>(null)
  const location = useLocation()
  const skipInitialHashScrollRef = useRef(true)

  //  возвращаемся наверх (важно для старта после прелоадера)
  const resetToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  useEffect(() => {
    // инициализируем плавный скролл
    const lenis = new Lenis({
      duration: 1.2, // Было 1.65 - ускоряем реакцию
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 1.0, // Было 0.78 - делаем прокрутку более отзывчивой
      touchMultiplier: 1.5, // Было 0.9 - увеличиваем чувствительность тача
      smoothTouch: false, // Отключаем плавность тача для мобилок, чтобы не было "киселя"
    })
    lenisRef.current = lenis

    // scrolltrigger должен понимать, что скролл крутит lenis
    lenis.on('scroll', ScrollTrigger.update)

    // прокидываем время в lenis через ticker gsap
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)

    // чтобы не было странных "рывков" при лаге
    gsap.ticker.lagSmoothing(1000, 16)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove(onTick)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '[') {
        localStorage.removeItem('vv-cookie-consent')
        localStorage.removeItem('vv-preloader-done')
        console.log('Cookie & Storage cleared. Reloading...')
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
      // пока прелоадер — скролл стопаем и фиксируем страницу
      lenisRef.current?.stop()
      lenisRef.current?.scrollTo(0, { immediate: true, force: true })
      resetToTop()
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
      body.style.touchAction = 'none'
      return
    }

    // после прелоадера стартуем с hero
    resetToTop()
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })

    // мягко включаем скролл после старта анимации появления
    unlockTimer = window.setTimeout(() => {
      lenisRef.current?.start()
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.touchAction = ''
      // обновляем scrolltrigger после появления, иначе pin в about может поехать
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

    const pendingSectionId = sessionStorage.getItem('vv-scroll-target')
    if (pendingSectionId && location.pathname === '/') {
      sessionStorage.removeItem('vv-scroll-target')
      // Даем небольшую задержку, чтобы DOM успел прогрузиться
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

    // после прелоадера не прыгаем сразу к hash, чтобы старт всегда был с hero
    if (skipInitialHashScrollRef.current) {
      skipInitialHashScrollRef.current = false
      return
    }

    // якоря из шапки: /#services, /#contact
    const hash = location.hash.replace('#', '')
    if (!hash) return

    const target = document.getElementById(hash)
    if (!target) return

    // учитываем фиксированный header, чтобы секция не пряталась под ним
    const headerOffset = 100
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }, [loading, location.pathname, location.hash])

  return (
    <main className="bg-[#080808] text-[#F5F7F6] selection:bg-[#E10600] selection:text-[#F5F7F6]">
      {loading && <Preloader onComplete={() => {
        // прелоадер закончен — показываем сайт
        resetToTop()
        const expiry = Date.now() + 24 * 60 * 60 * 1000 // 24 часа в миллисекундах
        localStorage.setItem('vv-preloader-done', JSON.stringify({ value: '1', expiry }))
        setLoading(false)
      }} />}

      {!loading && <Header />}

      {/* основной контент, с мягким reveal после прелоадера */}
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
