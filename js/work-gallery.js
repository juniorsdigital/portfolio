import { getProjectById, getProjectsForPage } from './work-projects.js';

let modalEl = null;
let lastFocusedCard = null;
let currentPageKey = 'home';

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildTagsMarkup(project, pageKey) {
  const tagsHtml = project.tags
    .map((t) => '<span class="work-tag">' + escapeHtml(t) + '</span>')
    .join('');
  const resultHtml = project.result
    ? '<span class="work-result">' + escapeHtml(project.result) + '</span>'
    : '';
  const wrapperClass = pageKey === 'portfolio' ? 'work-meta' : 'work-tags';
  return (
    '<div class="' +
    wrapperClass +
    '">' +
    tagsHtml +
    resultHtml +
    '</div>'
  );
}

function getVideoEmbedSrc(item) {
  if (!item.id) return null;
  if (item.provider === 'vimeo') {
    return (
      'https://player.vimeo.com/video/' +
      encodeURIComponent(item.id) +
      '?dnt=1'
    );
  }
  let url =
    'https://www.youtube-nocookie.com/embed/' +
    encodeURIComponent(item.id) +
    '?rel=0';
  if (item.start != null && item.start > 0) {
    url += '&start=' + encodeURIComponent(String(Math.floor(item.start)));
  }
  return url;
}

function renderMediaItem(item, loadVideo, options = {}) {
  const { videoOnly = false } = options;
  if (item.type === 'image') {
    const featured = item.featured ? ' work-modal__media--featured' : '';
    return (
      '<figure class="work-modal__media' +
      featured +
      '"><img src="' +
      escapeHtml(item.src) +
      '" alt="' +
      escapeHtml(item.alt) +
      '" loading="lazy" width="1200" height="750"></figure>'
    );
  }
  if (!loadVideo || !item.id) return '';
  const src = getVideoEmbedSrc(item);
  if (!src) return '';
  const title = escapeHtml(item.title || 'Project video');
  const soloClass = videoOnly ? ' work-modal__media--solo' : ' work-modal__media--featured';
  let html =
    '<figure class="work-modal__media work-modal__media--video' +
    soloClass +
    '"><div class="work-modal__video-wrap"><iframe src="' +
    src +
    '" title="' +
    title +
    '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>';
  if (item.title && !videoOnly) {
    html +=
      '<figcaption class="work-modal__video-label">' + title + '</figcaption>';
  }
  html += '</figure>';
  return html;
}

function isVideoProject(project) {
  return project.category === 'video';
}

function buildModalGalleryHtml(project) {
  if (isVideoProject(project)) {
    return project.media
      .filter((item) => item.type === 'video' && item.id)
      .map((item) => renderMediaItem(item, true, { videoOnly: true }))
      .join('');
  }

  let html = project.media
    .map((item) => renderMediaItem(item, true))
    .filter(Boolean)
    .join('');
  if (!html.trim()) {
    html = renderMediaItem(
      {
        type: 'image',
        src: project.thumbnail.src,
        alt: project.thumbnail.alt,
        featured: true,
      },
      false
    );
  }
  return html;
}

function setModalVideoLayout(modal, isVideo) {
  modal.classList.toggle('work-modal--video', isVideo);
  modal
    .querySelector('.work-modal__body')
    .classList.toggle('work-modal__body--video-only', isVideo);
  modal
    .querySelector('.work-modal__gallery')
    .classList.toggle('work-modal__gallery--video-only', isVideo);
}

function buildCardHtml(project, pageKey, index) {
  const layout = project.layouts[pageKey];
  const thumb = project.thumbnail;
  const splitClass = layout.variant === 'split' ? ' work-card--split' : '';
  const delayClass =
    index > 0 ? ' reveal reveal-delay-' + Math.min(index, 3) : ' reveal';
  const tagsMarkup = buildTagsMarkup(project, pageKey);

  const thumbBlock =
    '<div class="work-thumb-wrap"><img class="work-thumb" src="' +
    escapeHtml(thumb.src) +
    '" alt="' +
    escapeHtml(thumb.alt) +
    '" width="' +
    (thumb.width || 600) +
    '" height="' +
    (thumb.height || 375) +
    '" loading="lazy"></div>';

  const infoBlock =
    '<div class="work-info"><div class="work-client">' +
    escapeHtml(project.client) +
    '</div><h3 class="work-title">' +
    escapeHtml(project.title) +
    '</h3><p class="work-desc">' +
    escapeHtml(project.description) +
    '</p>' +
    tagsMarkup +
    '</div>';

  const inner =
    layout.variant === 'split'
      ? '<div class="work-inner">' + thumbBlock + infoBlock + '</div>'
      : thumbBlock + infoBlock;

  return (
    '<article class="work-card work-card--interactive' +
    splitClass +
    delayClass +
    '" data-category="' +
    escapeHtml(project.category) +
    '" data-project-id="' +
    escapeHtml(project.id) +
    '" data-span="' +
    layout.span +
    '" style="--work-span: ' +
    layout.span +
    '" role="button" tabindex="0" aria-label="View project: ' +
    escapeHtml(project.title) +
    '"><span class="work-card__view-hint" aria-hidden="true">View project</span>' +
    inner +
    '</article>'
  );
}

function ensureModal() {
  if (modalEl) return modalEl;
  modalEl = document.createElement('div');
  modalEl.className = 'work-modal';
  modalEl.setAttribute('aria-hidden', 'true');
  modalEl.innerHTML =
    '<button type="button" class="work-modal__backdrop" aria-label="Close project"></button>' +
    '<div class="work-modal__panel" role="dialog" aria-modal="true" aria-labelledby="work-modal-title">' +
    '<header class="work-modal__header">' +
    '<div class="work-modal__header-text">' +
    '<p class="work-modal__client"></p>' +
    '<h2 class="work-modal__title" id="work-modal-title"></h2>' +
    '<p class="work-modal__desc"></p>' +
    '<div class="work-modal__tags"></div>' +
    '</div>' +
    '<button type="button" class="work-modal__close" aria-label="Close project">' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
    '</button></header>' +
    '<div class="work-modal__body"><div class="work-modal__gallery"></div></div></div>';

  document.body.appendChild(modalEl);
  modalEl
    .querySelector('.work-modal__backdrop')
    .addEventListener('click', closeProjectModal);
  modalEl
    .querySelector('.work-modal__close')
    .addEventListener('click', closeProjectModal);
  modalEl.addEventListener('keydown', onModalKeydown);
  return modalEl;
}

function onModalKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeProjectModal();
    return;
  }
  if (e.key !== 'Tab' || !modalEl) return;
  const panel = modalEl.querySelector('.work-modal__panel');
  const focusable = [...panel.querySelectorAll(FOCUSABLE)].filter(
    (el) => !el.hasAttribute('disabled')
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function trapFocus(e) {
  if (!modalEl || !modalEl.classList.contains('is-open')) return;
  if (!modalEl.contains(e.target)) {
    e.stopPropagation();
    modalEl.querySelector('.work-modal__close')?.focus();
  }
}

export function openProjectModal(id) {
  const project = getProjectById(id, currentPageKey);
  if (!project) return;

  const modal = ensureModal();
  modal.querySelector('.work-modal__client').textContent = project.client;
  modal.querySelector('.work-modal__title').textContent = project.title;
  modal.querySelector('.work-modal__desc').textContent = project.description;

  const tagsEl = modal.querySelector('.work-modal__tags');
  tagsEl.innerHTML = '';
  project.tags.forEach((t) => {
    const span = document.createElement('span');
    span.className = 'work-tag';
    span.textContent = t;
    tagsEl.appendChild(span);
  });
  if (project.result) {
    const res = document.createElement('span');
    res.className = 'work-result';
    res.textContent = project.result;
    tagsEl.appendChild(res);
  }

  const isVideo = isVideoProject(project);
  setModalVideoLayout(modal, isVideo);
  modal.querySelector('.work-modal__gallery').innerHTML =
    buildModalGalleryHtml(project);

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.addEventListener('focusin', trapFocus);
  requestAnimationFrame(() => {
    modal.querySelector('.work-modal__close')?.focus();
  });
}

export function closeProjectModal() {
  if (!modalEl) return;
  modalEl.classList.remove('is-open');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.removeEventListener('focusin', trapFocus);
  modalEl.querySelectorAll('iframe').forEach((frame) => frame.remove());
  modalEl.querySelector('.work-modal__gallery').innerHTML = '';
  setModalVideoLayout(modalEl, false);
  if (lastFocusedCard) {
    lastFocusedCard.focus();
    lastFocusedCard = null;
  }
}

function onCardActivate(card) {
  const id = card.dataset.projectId;
  if (!id) return;
  lastFocusedCard = card;
  openProjectModal(id);
}

function bindCard(card) {
  card.addEventListener('click', () => onCardActivate(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardActivate(card);
    }
  });
}

let filtersBound = false;

export function initWorkFilters() {
  if (filtersBound) return;
  filtersBound = true;
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.work-card').forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

export function renderWorkGrid(container, pageKey) {
  if (!container) return;
  currentPageKey = pageKey;
  const projects = getProjectsForPage(pageKey);
  container.innerHTML = projects
    .map((project, i) => buildCardHtml(project, pageKey, i))
    .join('');

  container.querySelectorAll('.work-card--interactive').forEach(bindCard);

  const revealEls = container.querySelectorAll('.reveal');
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  initWorkFilters();
}

export function initWorkGallery(pageKey) {
  renderWorkGrid(document.getElementById('workGrid'), pageKey);
}
