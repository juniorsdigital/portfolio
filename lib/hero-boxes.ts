export type HeroBox = {
  id: string;
  title: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  projectId: "ovani";
  shelf: 0 | 1;
  scale: number;
};

export const HERO_BOXES: HeroBox[] = [
  {
    id: "ambient-fantasy",
    title: "Ambient Fantasy Music Pack",
    alt: "Ambient Fantasy Music Pack 3D box art — castle cover and white spine",
    src: "/images/hero-boxes/ambient-fantasy.jpg",
    width: 607,
    height: 862,
    projectId: "ovani",
    shelf: 0,
    scale: 1,
  },
  {
    id: "horror-vol-9",
    title: "Horror Music Pack Volume 9",
    alt: "Horror Music Pack Volume 9 3D box art — reaching hands and dark spine",
    src: "/images/hero-boxes/horror-vol-9.jpg",
    width: 608,
    height: 858,
    projectId: "ovani",
    shelf: 0,
    scale: 0.94,
  },
  {
    id: "epic-vol-5",
    title: "Epic Music Pack Volume 5",
    alt: "Epic Music Pack Volume 5 3D box art — rider on a plain toward a castle",
    src: "/images/hero-boxes/epic-vol-5.jpg",
    width: 608,
    height: 858,
    projectId: "ovani",
    shelf: 0,
    scale: 1.05,
  },
  {
    id: "magical-vol-5",
    title: "Magical Music Pack",
    alt: "Magical Music Pack 3D box art — wizard with a glowing staff",
    src: "/images/hero-boxes/magical-vol-5.jpg",
    width: 607,
    height: 858,
    projectId: "ovani",
    shelf: 0,
    scale: 0.98,
  },
  {
    id: "ambient-vol-13",
    title: "Ambient Music Pack Volume 13",
    alt: "Ambient Music Pack Volume 13 3D box art — sunbeams through a forest",
    src: "/images/hero-boxes/ambient-vol-13.jpg",
    width: 608,
    height: 858,
    projectId: "ovani",
    shelf: 1,
    scale: 1.02,
  },
  {
    id: "dark-fantasy-vol-3",
    title: "Dark Fantasy Music Pack Volume 3",
    alt: "Dark Fantasy Music Pack Volume 3 3D box art — gothic cathedral under a red sky",
    src: "/images/hero-boxes/dark-fantasy-vol-3.jpg",
    width: 608,
    height: 859,
    projectId: "ovani",
    shelf: 1,
    scale: 0.96,
  },
  {
    id: "spooky",
    title: "Spooky Music Pack",
    alt: "Spooky Music Pack 3D box art — sheet ghosts in sunglasses",
    src: "/images/hero-boxes/spooky.jpg",
    width: 607,
    height: 862,
    projectId: "ovani",
    shelf: 1,
    scale: 1,
  },
];
