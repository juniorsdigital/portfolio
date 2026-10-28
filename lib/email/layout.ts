import { CASE_STUDIES, projectHref, type Project } from "@/lib/projects";
import { SITE } from "@/lib/site";

/**
 * Email building blocks in the site's palette. Mail clients ignore stylesheets,
 * so every style is inline and layout is tables. Colors match app/globals.css.
 */
const C = {
  ink: "#0f0f0d",
  paper: "#f3f0e9",
  card: "#ffffff",
  rule: "#d3cec2",
  ruleSoft: "#e8e4da",
  body: "#3a3934",
  slate: "#55534d",
  stone: "#a9a59c",
  signal: "#ff5a1f",
  signalInk: "#b83d0e",
};
const SANS = "Arial,Helvetica,sans-serif";
const MONO = "Menlo,Consolas,monospace";

/** Resend swaps this for the contact's preference page when a broadcast goes out. */
export const UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}";

export type Email = { subject: string; previewText: string; html: string; text: string };

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Site paths become absolute URLs, since an email has no origin to resolve against. */
export function abs(path: string) {
  return path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("{{{")
    ? path
    : `${SITE.url}${path}`;
}

export const kicker = (text: string) =>
  `<p style="margin:0 0 10px;color:${C.signalInk};font-family:${MONO};font-size:13px;letter-spacing:0.04em;text-transform:uppercase;">${text}</p>`;

export const h1 = (text: string) =>
  `<h1 style="margin:0 0 16px;color:${C.ink};font-family:${SANS};font-size:32px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;">${text}</h1>`;

export const h2 = (text: string) =>
  `<h2 style="margin:32px 0 10px;color:${C.ink};font-family:${SANS};font-size:22px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;">${text}</h2>`;

export const p = (text: string) =>
  `<p style="margin:0 0 16px;color:${C.body};font-family:${SANS};font-size:16px;line-height:1.6;">${text}</p>`;

export const small = (text: string) =>
  `<p style="margin:0 0 12px;color:${C.slate};font-family:${SANS};font-size:14px;line-height:1.55;">${text}</p>`;

export const link = (href: string, text: string) =>
  `<a href="${escapeHtml(abs(href))}" style="color:${C.ink};text-decoration:underline;text-decoration-color:${C.signal};">${text}</a>`;

export const button = (href: string, text: string) =>
  `<p style="margin:24px 0 8px;"><a href="${escapeHtml(abs(href))}" style="display:inline-block;background:${C.signal};color:${C.ink};font-family:${SANS};font-weight:700;font-size:16px;text-decoration:none;padding:14px 22px;">${text} &rarr;</a></p>`;

export const rule = () =>
  `<hr style="margin:28px 0;border:0;border-top:1px solid ${C.ruleSoft};" />`;

export const list = (items: string[]) =>
  `<ul style="margin:0 0 16px;padding:0 0 0 20px;color:${C.body};font-family:${SANS};font-size:16px;line-height:1.6;">${items
    .map((i) => `<li style="margin:0 0 6px;">${i}</li>`)
    .join("")}</ul>`;

/** Label/value rows, e.g. a summary of what the client sent. */
export function rows(pairs: [string, string][]) {
  const body = pairs
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${C.ruleSoft};color:${C.slate};font-family:${MONO};font-size:13px;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${C.ruleSoft};color:${C.ink};font-family:${SANS};font-size:16px;white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 16px;">${body}</table>`;
}

/** A big number and what it means, in signal orange. */
export const stat = (value: string, label: string) =>
  `<table role="presentation" style="width:100%;border-collapse:collapse;margin:8px 0 20px;"><tr>
    <td style="padding:18px 20px;background:${C.ink};">
      <div style="color:${C.signal};font-family:${SANS};font-size:36px;line-height:1;font-weight:800;">${value}</div>
      <div style="color:${C.paper};font-family:${SANS};font-size:15px;line-height:1.45;margin-top:8px;">${label}</div>
    </td>
  </tr></table>`;

type CaseStudyProject = (typeof CASE_STUDIES)[number];

/** A case study as a card: the share image, title, one line and a link. */
export function workCard(project: CaseStudyProject, note?: string) {
  const href = abs(projectHref(project));
  const image = abs(`/images/work/${project.id}-og.jpg`);
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 20px;border:1px solid ${C.rule};background:${C.card};"><tr><td>
    <a href="${escapeHtml(href)}" style="display:block;text-decoration:none;">
      <img src="${escapeHtml(image)}" width="582" alt="${escapeHtml(project.thumbnail.alt)}" style="display:block;width:100%;max-width:582px;height:auto;border:0;" />
    </a>
    <div style="padding:16px 18px 18px;">
      <div style="color:${C.slate};font-family:${MONO};font-size:12px;letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(project.client)}${project.result ? ` · ${escapeHtml(project.result)}` : ""}</div>
      <div style="margin-top:6px;color:${C.ink};font-family:${SANS};font-size:19px;line-height:1.25;font-weight:800;">${escapeHtml(project.title)}</div>
      <div style="margin-top:6px;color:${C.body};font-family:${SANS};font-size:15px;line-height:1.55;">${escapeHtml(note ?? project.description)}</div>
      <a href="${escapeHtml(href)}" style="display:inline-block;margin-top:12px;color:${C.ink};font-family:${SANS};font-size:15px;font-weight:700;text-decoration:underline;text-decoration-color:${C.signal};">Read the case study &rarr;</a>
    </div>
  </td></tr></table>`;
}

export function caseStudy(id: string) {
  const project = CASE_STUDIES.find((p) => p.id === id);
  if (!project) throw new Error(`No case study with id "${id}"`);
  return project;
}

export function caseStudyText(project: Project, note?: string) {
  return `${project.title}\n${note ?? project.description}\n${abs(projectHref(project))}`;
}

/**
 * Wraps body HTML in the branded frame: ink masthead, white card, small footer.
 * `footer` replaces the default sign-off line (broadcasts pass an unsubscribe link).
 */
export function shell({
  label,
  previewText,
  body,
  footer,
}: {
  label: string;
  previewText: string;
  body: string;
  footer?: string;
}) {
  const footerHtml =
    footer ??
    `${SITE.name} · ${SITE.byline} ${SITE.location}, PA.<br /><a href="${SITE.url}" style="color:${C.slate};">${SITE.url.replace("https://", "")}</a>`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(label)}</title>
  </head>
  <body style="margin:0;padding:0;background:${C.paper};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper};">${escapeHtml(previewText)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
    <div style="margin:0;background:${C.paper};padding:32px 16px;font-family:${SANS};">
      <table role="presentation" style="width:100%;max-width:640px;margin:0 auto;border-collapse:collapse;background:${C.card};border:1px solid ${C.rule};">
        <tr>
          <td style="padding:24px 28px;background:${C.ink};">
            <a href="${SITE.url}" style="color:${C.paper};font-size:20px;font-weight:800;letter-spacing:-0.01em;text-decoration:none;">${SITE.name}<span style="color:${C.signal};">.</span></a>
            <div style="color:${C.stone};font-family:${MONO};font-size:13px;margin-top:6px;">${escapeHtml(label)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px 12px;">${body}</td>
        </tr>
        <tr>
          <td style="padding:20px 28px 28px;border-top:1px solid ${C.ruleSoft};color:${C.slate};font-family:${SANS};font-size:13px;line-height:1.6;">${footerHtml}</td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}

/** Footer for anything sent to the list: who it's from and a way out. */
export function listFooter(reason: string) {
  return `You're getting this because ${reason} at ${SITE.url.replace("https://", "")}.<br />
    <a href="${UNSUBSCRIBE_URL}" style="color:${C.slate};">Manage what you get or unsubscribe</a> · ${SITE.name}, ${SITE.location}, PA`;
}

export function listFooterText(reason: string) {
  return `—\nYou're getting this because ${reason} at ${SITE.url.replace("https://", "")}.\nManage what you get or unsubscribe: ${UNSUBSCRIBE_URL}`;
}
