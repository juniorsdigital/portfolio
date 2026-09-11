export type HeroCover = {
  id: string;
  title: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  projectId: "ovani";
};

/** Drop-in slots: replace the PNG in public/images/hero-covers/ with the same name.
 *  Hero footage: overwrite public/videos/she-who-flies-hero.mp4 (muted H.264, 16:9).
 */
const SIZE = { width: 1187, height: 1678 };

function cover(n: number): HeroCover {
  const id = `cover-${String(n).padStart(2, "0")}`;
  const title = `Cover ${String(n).padStart(2, "0")}`;
  return {
    id,
    title,
    alt: `${title} — 3D product box art`,
    src: `/images/hero-covers/${id}.png`,
    ...SIZE,
    projectId: "ovani",
  };
}

export const HERO_COVERS: HeroCover[] = [
  cover(1),
  cover(2),
  cover(3),
  cover(4),
  cover(5),
  cover(6),
  cover(7),
  cover(8),
  cover(9),
  cover(10),
  cover(11),
];
