/** @typedef {'design'|'video'|'web'} WorkCategory */
/** @typedef {'home'|'portfolio'} WorkPageKey */

/**
 * @typedef {Object} WorkThumbnail
 * @property {string} src
 * @property {string} alt
 * @property {number} [width]
 * @property {number} [height]
 */

/**
 * @typedef {Object} WorkImageMedia
 * @property {'image'} type
 * @property {string} src
 * @property {string} alt
 * @property {boolean} [featured]
 */

/**
 * @typedef {Object} WorkVideoMedia
 * @property {'video'} type
 * @property {'youtube'|'vimeo'} provider
 * @property {string} id
 * @property {string} [title]
 */

/**
 * @typedef {WorkImageMedia|WorkVideoMedia} WorkMediaItem
 */

/**
 * @typedef {Object} WorkLayout
 * @property {number} span
 * @property {number} order
 * @property {'split'} [variant]
 */

/**
 * @typedef {Object} WorkProject
 * @property {string} id
 * @property {WorkCategory} category
 * @property {string} client
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 * @property {string} [result]
 * @property {WorkThumbnail} thumbnail
 * @property {Record<WorkPageKey, WorkLayout>} layouts
 * @property {WorkMediaItem[]} media
 */

/** @type {WorkProject[]} */
export const WORK_PROJECTS = [
  {
    id: 'ryzagrow',
    category: 'design',
    client: 'Ryza, LLC.',
    title: 'RyzaGrow — DTC Campaign',
    description:
      'Full campaign management, content creation, and social direction for a direct-to-consumer mushroom grow kit brand.',
    tags: ['Graphic Design', 'Social Media', 'SEO'],
    result: '↑ 2× Sales',
    thumbnail: {
      src: 'images/work-ryzagrow.png',
      alt: 'RyzaGrow campaign — split product panels with terracotta and cream backgrounds, JRS portfolio frame',
      width: 800,
      height: 500,
    },
    layouts: {
      home: { span: 7, order: 0 },
      portfolio: { span: 7, order: 0 },
    },
    media: [
      {
        type: 'image',
        src: 'images/work-ryzagrow.png',
        alt: 'RyzaGrow campaign — split product panels with terracotta and cream backgrounds',
        featured: true,
      },
    ],
  },
  {
    id: 'ovani',
    category: 'design',
    client: 'OvaniSound',
    title: '60+ E-Commerce Product Covers',
    description:
      '2D and 3D product cover designs for a sound design e-commerce catalog. 30 covers in one week.',
    tags: ['Product Design', '3D Render'],
    result: '30 in 1 week',
    thumbnail: {
      src: 'images/work-ovani.png',
      alt: 'Ovani Sound — e-commerce product covers, 2D stickers and 3D pack renders',
      width: 600,
      height: 375,
    },
    layouts: {
      home: { span: 5, order: 1 },
      portfolio: { span: 5, order: 1 },
    },
    media: [
      {
        type: 'image',
        src: 'images/work-ovani.png',
        alt: 'Ovani Sound — e-commerce product covers, 2D stickers and 3D pack renders',
        featured: true,
      },
    ],
  },
  {
    id: 'she-who-flies',
    category: 'video',
    client: 'Red Bull (Mock)',
    title: 'She Who Flies — Documentary',
    description: 'Re-edited documentary trailer with custom title treatment.',
    tags: ['Video Edit'],
    result: '7.7K Views',
    thumbnail: {
      src: 'images/work-she-who-flies.png',
      alt: 'She Who Flies — mock documentary trailer graphic with script title and mountain imagery',
      width: 600,
      height: 375,
    },
    layouts: {
      home: { span: 4, order: 2 },
      portfolio: { span: 4, order: 2 },
    },
    media: [
      {
        type: 'image',
        src: 'images/work-she-who-flies.png',
        alt: 'She Who Flies — documentary trailer title treatment',
        featured: true,
      },
      {
        type: 'video',
        provider: 'youtube',
        id: 'OAVv1vL3SaY',
        title: 'She Who Flies — Trailer',
      },
    ],
  },
  {
    id: 'bgcb',
    category: 'design',
    client: 'Boys & Girls Club of Boston',
    title: 'Teen Registration Campaign',
    description: 'Full-service campaign to drive teen registration.',
    tags: ['Campaign', 'OOH'],
    thumbnail: {
      src: 'images/work-bgcb.png',
      alt: 'Boys & Girls Club of Boston — teen registration OOH campaign mockup',
      width: 600,
      height: 375,
    },
    layouts: {
      home: { span: 4, order: 3 },
      portfolio: { span: 6, order: 4 },
    },
    media: [
      {
        type: 'image',
        src: 'images/work-bgcb.png',
        alt: 'Boys & Girls Club of Boston — teen registration campaign',
        featured: true,
      },
    ],
  },
  {
    id: 'lancecrm',
    category: 'web',
    client: 'LanceCRM',
    title: 'Freelancer CRM UI',
    description:
      'Dashboard and UX design for a CRM and project management tool built for freelancers.',
    tags: ['UI/UX', 'Web Design'],
    thumbnail: {
      src: 'images/work-lancecrm.png',
      alt: 'LanceCRM — freelancer CRM and project dashboard UI mockup',
      width: 600,
      height: 375,
    },
    layouts: {
      home: { span: 4, order: 4 },
      portfolio: { span: 8, order: 3 },
    },
    media: [
      {
        type: 'image',
        src: 'images/work-lancecrm.png',
        alt: 'LanceCRM — freelancer dashboard UI',
        featured: true,
      },
    ],
  },
  {
    id: 'winter-heroes',
    category: 'video',
    client: 'Red Bull (Mock)',
    title: 'Winter Heroes — Multi-Format Video',
    description:
      'Long-form documentary repurposed across short-form social cuts. Strategy and edit demonstrating the full content pipeline from single source to multi-channel distribution.',
    tags: ['Video Editing', 'Content Strategy', 'Short-Form'],
    thumbnail: {
      src: 'images/work-winter-heroes.png',
      alt: 'Winter Heroes — title treatment over snow-capped peaks above a cloud layer, Juniors Digital production',
      width: 800,
      height: 600,
    },
    layouts: {
      home: { span: 12, order: 5, variant: 'split' },
      portfolio: { span: 6, order: 5 },
    },
    media: [
      {
        type: 'image',
        src: 'images/work-winter-heroes.png',
        alt: 'Winter Heroes — cinematic title over mountains and clouds',
        featured: true,
      },
      {
        type: 'video',
        provider: 'youtube',
        id: 'Go_kBKhxUrc',
        start: 7,
        title: 'Winter Heroes — Documentary',
      },
    ],
  },
];

/** Portfolio page uses slightly different copy for some cards. */
export const PORTFOLIO_COPY_OVERRIDES = {
  ryzagrow: {
    title: 'RyzaGrow DTC Campaign',
    description:
      'Full campaign management, content creation, and social direction for a direct-to-consumer mushroom grow kit brand.',
    tags: ['Graphic Design', 'Social Media', 'SEO'],
    result: '↑ 2× Sales',
  },
  ovani: {
    title: '60 E-Commerce Product Covers',
    description:
      '2D and 3D product cover designs for a sound design e-commerce catalog. 30 covers in one week — delivered on time, every one distinct.',
    result: '30 in 1 Week',
  },
  'she-who-flies': {
    client: 'Red Bull (Mockup)',
    title: 'She Who Flies Documentary',
    description:
      'Re-edited documentary trailer with custom title treatment. Organic reach, no paid promotion, cinematic storytelling.',
    tags: ['Video Edit', 'Motion'],
  },
  lancecrm: {
    title: 'Freelancer CRM Dashboard UI',
    description:
      'Dashboard and UX design for a CRM and project management tool built for freelancers. Clean, functional, conversion-oriented.',
    tags: ['UI/UX', 'Web Design', 'Figma'],
  },
  bgcb: {
    description:
      'Full-service campaign to drive teen registration. OOH, print, and digital assets coordinated for maximum reach.',
    tags: ['Campaign', 'OOH', 'Nonprofit'],
  },
  'winter-heroes': {
    client: 'Red Bull (Mockup)',
    title: 'Winter Heroes Multi-Format Video',
    description:
      'Long-form documentary repurposed across short-form social cuts. Single source → multi-channel distribution strategy and edit.',
  },
};

/**
 * @param {WorkPageKey} pageKey
 * @returns {WorkProject[]}
 */
export function getProjectsForPage(pageKey) {
  return [...WORK_PROJECTS]
    .map((project) => {
      if (pageKey !== 'portfolio') return project;
      const overrides = PORTFOLIO_COPY_OVERRIDES[project.id];
      return overrides ? { ...project, ...overrides } : project;
    })
    .sort(
      (a, b) => a.layouts[pageKey].order - b.layouts[pageKey].order
    );
}

/**
 * @param {string} id
 * @param {WorkPageKey} pageKey
 * @returns {WorkProject|undefined}
 */
export function getProjectById(id, pageKey) {
  return getProjectsForPage(pageKey).find((p) => p.id === id);
}
