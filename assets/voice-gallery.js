(() => {
 const gallery = document.querySelector('.voice-repo-gallery');
 if (!gallery) return;
 const slides = [...gallery.querySelectorAll('.voice-gallery-slide')];
 const dots = [...gallery.querySelectorAll('.voice-gallery-dots button')];
 const next = gallery.querySelector('.voice-gallery-next');
 let current = 0;
 function show(index) {
  current = index;
  slides.forEach((slide, i) => {
   slide.classList.toggle('is-front', i === current);
   slide.classList.toggle('is-back', i !== current);
   slide.setAttribute('aria-hidden', String(i !== current));
   dots[i].setAttribute('aria-pressed', String(i === current));
  });
  gallery.querySelector('#voice-gallery-title').textContent = slides[current].dataset.title;
  gallery.querySelector('#voice-gallery-count').textContent = `0${current + 1} / 02`;
  next.setAttribute('aria-label', current === 0 ? 'Show README setup tutorial' : 'Show Python script');
  gallery.querySelector('.voice-gallery-announcement').textContent = slides[current].dataset.title;
 }
 next.addEventListener('click', () => show((current + 1) % slides.length));
 dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
 gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
   event.preventDefault(); show((current + 1) % slides.length);
  }
 });
})();
