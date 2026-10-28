import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — design, video & marketing that ships`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "Design, video & marketing that ships.";
const FOOTER = [`Freelance · ${SITE.location}`, "johnswanson.co"];

/**
 * Condensed Archivo 800, subset to the glyphs on the card. Built once at
 * build time; falls back to the default face if Google Fonts is unreachable.
 */
async function archivo() {
  try {
    const text = encodeURIComponent(`${HEADLINE.toUpperCase()}${SITE.name}.${FOOTER.join("")}`);
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62.5,800&text=${text}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await archivo();
  const [lead, last] = [HEADLINE.slice(0, HEADLINE.lastIndexOf(" ")), HEADLINE.split(" ").pop()];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f0f0d",
          color: "#f3f0e9",
          padding: "64px 72px",
          fontFamily: font ? "Archivo" : undefined,
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
          {SITE.name}
          <span style={{ color: "#ff5a1f" }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 118,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            maxWidth: 1000,
          }}
        >
          {lead}&nbsp;<span style={{ color: "#ff5a1f" }}>{last}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #2e2d29",
            paddingTop: 24,
            fontSize: 26,
            color: "#a9a59c",
          }}
        >
          <span>{FOOTER[0]}</span>
          <span>{FOOTER[1]}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Archivo", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
