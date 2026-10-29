(() => {
  // Equal-height rows sized by the actual content width, preserving each source ratio.
  const fittedRows = [...document.querySelectorAll('.fitted-row')];
  function fitRows() {
    const desktop = innerWidth > 900;
    const preferred = innerWidth >= 1800 ? 250 : Math.max(190, Math.min(innerWidth * .17, 250));
    for (const row of fittedRows) {
      if (!desktop) { row.style.removeProperty('--row-height'); continue; }
      const figures = [...row.querySelectorAll(':scope > .journal-figure')];
      const sum = figures.reduce((total, figure) => total + Number(figure.style.getPropertyValue('--media-ratio')), 0);
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const available = row.getBoundingClientRect().width - gap * (figures.length - 1);
      const height = row.closest('#undergrad > .journal-collections, #graduation, #final-project, #outside-work') ? available / sum : Math.min(preferred, available / sum);
      const value = `${Math.max(1, height - .1).toFixed(2)}px`;
      if (row.style.getPropertyValue('--row-height') !== value) row.style.setProperty('--row-height', value);
    }
  }
  const rowObserver = new ResizeObserver(fitRows);
  fittedRows.forEach(row => rowObserver.observe(row));
  addEventListener('resize', fitRows);
  fitRows();

  // Mirror the project's contents navigation; nested dates stay within their parent periods.
  const links = [...document.querySelectorAll('.experience-toc a')];
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  let pending = false;
  function updateContents() {
    pending = false;
    const boundary = (document.querySelector('body > header')?.getBoundingClientRect().bottom || 0) + Math.min(innerHeight * .25, 200);
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= boundary) current = section;
    }
    const atBottom = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    if (atBottom && sections.length) current = sections[sections.length - 1];
    for (const link of links) {
      const active = link.hash === '#' + current?.id;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(updateContents); }
  }, { passive: true });
  addEventListener('resize', updateContents);
  updateContents();

  const videos = [...document.querySelectorAll('.journal-video')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let modalOpen = false;
  const inView = new Set();
  function playVisible() {
    for (const video of videos) {
      if (inView.has(video) && !motion.matches && !modalOpen && !document.hidden) {
        video.play().catch(() => {});
      } else video.pause();
    }
  }
  for (const video of videos) {
    video.muted = true;
    video.defaultMuted = true;
    if (motion.matches) { video.autoplay = false; video.pause(); }
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) inView.add(entry.target);
      else inView.delete(entry.target);
    }
    playVisible();
  }, { threshold: .15 });
  videos.forEach(video => observer.observe(video));
  motion.addEventListener('change', playVisible);
  document.addEventListener('visibilitychange', playVisible);

  // Enlargement is optional: every photo and video is already displayed in the page.
  const dialog = document.querySelector('.photo-dialog');
  const image = dialog.querySelector('.album-image');
  const caption = dialog.querySelector('figcaption');
  const data = JSON.parse(document.querySelector('#journey-albums').textContent);
  let album = [];
  let index = 0;
  let opener;
  function show(position) {
    index = (position + album.length) % album.length;
    const item = album[index];
    image.src = `assets/journey/${item.full || item.name + ".jpg"}`;
    image.alt = item.caption;
    caption.textContent = item.caption;
  }
  document.querySelectorAll('.journal-photo').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const original = data[link.dataset.gallery];
      const chosen = original[Number(link.dataset.index)];
      album = original.filter(item => item.kind !== 'video');
      opener = link;
      show(album.indexOf(chosen));
      modalOpen = true;
      playVisible();
      document.body.classList.add("photo-modal-open");
      dialog.showModal();
    });
  });
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove("photo-modal-open");
    modalOpen = false;
    opener?.focus({ preventScroll: true });
    playVisible();
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();

// Match the introduction height to the viewport below the navigation.
(() => {
  if (!document.body.classList.contains('about-page')) return;
  const header = document.querySelector('body > header');
  if (!header) return;
  const measureHeader = () => document.documentElement.style.setProperty('--about-nav-height', `${header.getBoundingClientRect().height}px`);
  new ResizeObserver(measureHeader).observe(header);
  measureHeader();
})();
