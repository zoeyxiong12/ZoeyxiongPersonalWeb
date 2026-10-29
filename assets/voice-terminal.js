(() => {
 const demo = document.querySelector('.voice-terminal-demo');
 if (!demo) return;
 const log = demo.querySelector('.voice-terminal-log');
 const count = demo.querySelector('.voice-terminal-count');
 const state = demo.querySelector('.voice-terminal-state span');
 const bar = demo.querySelector('.voice-terminal-track div');
 const button = demo.querySelector('.voice-terminal-toggle');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let n = 0, timer, paused = reduced.matches, visible = true;
 function append(text, type) {
  const row = document.createElement('div'); row.className = type || '';
  row.textContent = text; log.append(row);
  while (log.children.length > 15) log.firstElementChild.remove();
  log.scrollTop = log.scrollHeight;
 }
 function reset() {
  n = 0; log.replaceChildren();
  append('Switch GPT weights: 200', 'voice-terminal-muted');
  append('Switch SoVITS weights: 200', 'voice-terminal-muted');
  state.textContent = 'Generating audio';
 }
 function step() {
  if (paused || !visible || document.hidden) { timer = setTimeout(step, 200); return; }
  if (n === 249) { reset(); timer = setTimeout(step, 650); return; }
  n++;
  const folder = n <= 20 ? 'greeting' : n <= 50 ? 'interaction' : n <= 90 ? 'reaction' : n <= 130 ? 'exploration' : n <= 170 ? 'battle' : n <= 210 ? 'reward' : 'farewell';
  append('OK  D:\\Voice\\character_A\\' + folder + '\\voice_' + String(n).padStart(3, '0') + '.wav', 'voice-terminal-ok');
  count.textContent = n + ' / 249'; bar.style.width = (n / 249 * 100) + '%';
  if (n === 249) {
   append('Done 249, skipped (empty line) 0, failed 0', 'voice-terminal-summary');
   state.textContent = 'Batch complete'; timer = setTimeout(step, 3500);
  } else timer = setTimeout(step, 95);
 }
 button.addEventListener('click', () => {
  paused = !paused; button.textContent = paused ? 'Play' : 'Pause';
  button.setAttribute('aria-pressed', String(paused));
 });
 new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(demo);
 if (reduced.matches) {
  reset();
  for (let i = 237; i <= 249; i++) append('OK  D:\\Voice\\character_A\\farewell\\voice_' + i + '.wav', 'voice-terminal-ok');
  n = 249; count.textContent = '249 / 249'; bar.style.width = '100%';
  state.textContent = 'Batch complete'; append('Done 249, skipped (empty line) 0, failed 0', 'voice-terminal-summary');
  button.textContent = 'Play'; button.setAttribute('aria-pressed', 'true');
 }
 timer = setTimeout(step, 550);
})();
