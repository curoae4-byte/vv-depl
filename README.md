# 🎬 VALERY VISUALS — Portfolio

Портфолио/лендинг, созданное для демонстрации визуального контента для ТОО "VALERY VISUALS".&#x20;

## 🛠 Технологический стек

- **Core**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS (v4)
- **Animation**:
  - [GSAP](https://gsap.com/) (ScrollTrigger) — сложные таймлайны и скролл-сцены.
  - [Lenis](https://lenis.darkroom.engineering/) — плавный скролл.
  - [Motion](https://motion.dev/) — UI анимации и модальные окна.
- **Routing**: React Router 7

## 🚀 Быстрый старт

1. **Установка зависимостей**:
   ```bash
   npm install
   ```
2. **Запуск в режиме разработки**:
   ```bash
   npm run dev
   ```
3. **Сборка проекта**:
   ```bash
   npm run build
   ```

## 📂 Структура проекта

```text
src/
├── components/   # Реанимация компонентов и секций (Hero, About, Portfolio)
├── data/         # Контент и данные проектов
├── pages/        # Страницы приложения (Главная, Портфолио, Policy)
├── utils/        # Вспомогательные функции
├── App.tsx       # Основной входной компонент и сборка секций
└── main.tsx      # Точка входа, роутинг и глобальные провайдеры
```

## 📦 Развертывание

Проект настроен для автоматизированного деплоя на **GitHub Pages** (ветка `gh-pages`).

```bash
# Одной командой: сборка + деплой содержимого dist в ветку gh-pages
npm run deploy
```

При запуске `npm run deploy` автоматически выполнится `npm run build`, а затем содержимое папки `dist` будет отправлено в ветку `gh-pages`.
