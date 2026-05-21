// данные карточек портфолио (главная и страница /portfolio)
export type WorkProject = {
  id: number
  title: string
  tagline: string
  category: string
  client: string
  type: string
  agency: string
  release: string
  image: string
  video: string
}

export const worksProjects: WorkProject[] = [
  {
    id: 1,
    title: 'PROJECT 1',
    tagline: 'Описание 1',
    category: 'CINEMATIC SHORT',
    client: 'VALERY VISUALS',
    type: 'Film / Short',
    agency: 'In-house',
    release: '2024',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_1.mp4',
  },
  {
    id: 2,
    title: 'PROJECT 2',
    tagline: 'Описание 2',
    category: 'FASHION FILM',
    client: 'Private Label',
    type: 'Fashion Film',
    agency: 'VV Studio',
    release: '2024',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_2.mp4',
  },
  {
    id: 3,
    title: 'PROJECT 3',
    tagline: 'Описание 3',
    category: 'MUSIC VIDEO',
    client: 'Independent Artist',
    type: 'Music Video',
    agency: 'VV Studio',
    release: '2023',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_3.mp4',
  },
  {
    id: 4,
    title: 'PROJECT 4',
    tagline: 'Описание 4',
    category: 'BRAND FILM',
    client: 'Tech Brand',
    type: 'Brand Film',
    agency: 'Partner Agency',
    release: '2023',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_4.mp4',
  },
  {
    id: 5,
    title: 'PROJECT 5',
    tagline: 'Рекламный ролик для digital-кампании: динамика и чистый монтаж.',
    category: 'COMMERCIAL',
    client: 'Retail Group',
    type: 'Commercial',
    agency: 'VV Studio',
    release: '2023',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_5.mp4',
  },
  {
    id: 6,
    title: 'PROJECT 6',
    tagline: 'Интерактивный опыт: звук и картинка в одном ритме.',
    category: 'EXPERIENCE',
    client: 'Culture Fund',
    type: 'Installation / Film',
    agency: 'VV × Lab',
    release: '2022',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_6.mp4',
  },
]
