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
    category: 'категория_1',
    client: 'клиент_1',
    type: 'тип_1',
    agency: 'VV Studio',
    release: '2024',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_1.mp4',
  },
  {
    id: 2,
    title: 'PROJECT 2',
    tagline: 'Описание 2',
    category: 'категория_2',
    client: 'клиент_2',
    type: 'тип_2',
    agency: 'VV Studio',
    release: '2024',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_2.mp4',
  },
  {
    id: 3,
    title: 'PROJECT 3',
    tagline: 'Описание 3',
    category: 'категория_3',
    client: 'клиент_3',
    type: 'тип_3',
    agency: 'VV Studio',
    release: '2023',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_3.mp4',
  },
  {
    id: 4,
    title: 'PROJECT 4',
    tagline: 'Описание 4',
    category: 'категория_4',
    client: 'клиент_4',
    type: 'тип_4',
    agency: 'VV Studio',
    release: '2024',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_4.mp4',
  },
  {
    id: 5,
    title: 'PROJECT 5',
    tagline: 'Описание 5',
    category: 'категория_5',
    client: 'клиент_5',
    type: 'тип_5',
    agency: 'VV Studio',
    release: '2023',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_5.mp4',
  },
  {
    id: 6,
    title: 'PROJECT 6',
    tagline: 'Описание 6',
    category: 'категория_6',
    client: 'клиент_6',
    type: 'тип_6',
    agency: 'VV × Lab',
    release: '2022',
    image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=1400',
    video: 'videos/project_6.mp4',
  },
]
