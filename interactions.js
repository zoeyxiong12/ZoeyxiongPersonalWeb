(() => {
  const fine = matchMedia("(hover:hover) and (pointer:fine)");
  const reduced = matchMedia("(prefers-reduced-motion:reduce)");
  const cursor = document.createElement("div");
  cursor.className = "interaction-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML =
    '<svg class="cursor-arrow" viewBox="0 0 28 32" aria-hidden="true"><path d="M4 3Q3 2 3.3 4L8.8 27Q9.3 29 10.3 27L14 20.5L22 20Q24 20 22.5 18.6L4 3Z" fill="#FF851B" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg><span class="cursor-label"><span class="cursor-symbol" aria-hidden="true"></span><span class="cursor-text">Exploring</span></span>';
  document.body.append(cursor);
  const cursorLabel = cursor.querySelector(".cursor-text");
  const status = document.createElement("div");
  status.className = "interaction-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  document.body.append(status);
  let timer;
  const labelFor = (link) => {
    if (link.classList.contains("journal-photo")) return "Exploring";
    const href = link.getAttribute("href") || "";
    if (link.classList.contains("project"))
      return "View " + (link.querySelector("h3")?.textContent || "project") + " ↗";
    if (href.startsWith("mailto:")) return "Email ↗";
    if (href.includes("linkedin.com")) return "LinkedIn ↗";
    if (href.includes("github.com")) return "GitHub ↗";
    if (href.includes("viewer")) return "View CV ↗";
    if (link.classList.contains("brand")) return "Home";
    if (href.includes("inspiration")) return "Inspiration";
    if (href.includes("about")) return "About me";
    if (href.includes("personal")) return "Outside work";
    if (href.startsWith("#")) return "Jump to section";
    return link.textContent.includes("Back") ? "Back" : "Explore";
  };
  document.addEventListener("pointermove", (event) => {
    if (document.body.classList.contains("photo-modal-open")) {
      cursor.style.visibility = "hidden";
      document.documentElement.classList.remove("custom-cursor");
      return;
    }
    if (!fine.matches || event.pointerType !== "mouse") return;
    document.documentElement.classList.add("custom-cursor");
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
    cursor.style.visibility = "visible";
    const link = event.target.closest("a");
    const inContents = !!event.target.closest(".toc, .experience-toc");
    const inHotspot = !!event.target.closest('.capture-hotspot:not([aria-pressed="true"]), .capture-step:not(.is-current):not([hidden])');
    cursor.classList.toggle("is-step-click", inHotspot);
    const inProject = /(?:^|\/)(?:dusk|voice|sketch|tally)\.html$/.test(location.pathname);
    cursor.classList.toggle("is-link", !!link || inContents);
    cursor.classList.toggle("is-browsing", inProject && !link && !inContents && !inHotspot);
    cursorLabel.textContent = inHotspot ? "Click" : inContents
      ? "Jump to section"
      : link
        ? labelFor(link).replace(" ↗", "")
        : inProject ? "Browsing" : "Exploring";
  });
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) {
      cursor.style.visibility = "hidden";
      document.documentElement.classList.remove("custom-cursor");
    }
  });
  document.addEventListener("keydown", () =>
    document.documentElement.classList.remove("custom-cursor"),
  );
  fine.addEventListener("change", () => document.documentElement.classList.remove("custom-cursor"));
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (event.detail && fine.matches && !reduced.matches) {
      cursor.classList.remove("is-clicked");
      void cursor.offsetWidth;
      cursor.classList.add("is-clicked");
      setTimeout(() => cursor.classList.remove("is-clicked"), 220);
      const ring = document.createElement("div");
      ring.className = "click-feedback";
      ring.style.setProperty("--x", event.clientX + "px");
      ring.style.setProperty("--y", event.clientY + "px");
      document.body.append(ring);
      ring.addEventListener("animationend", () => ring.remove());
    }
    if (href.startsWith("mailto:") || link.target === "_blank") {
      status.textContent = href.startsWith("mailto:")
        ? "Opening your email app…"
        : "Opening in a new tab…";
      status.classList.add("visible");
      clearTimeout(timer);
      timer = setTimeout(() => status.classList.remove("visible"), 1800);
    }
  });
})();

(() => {
  const walkthrough = document.querySelector('.capture-walkthrough');
  if (!walkthrough) return;
  const buttons = [...walkthrough.querySelectorAll('.capture-hotspot')];
  const panels = [...walkthrough.querySelectorAll('.capture-step')];
  let active = 1;
  function select(step, animate = true) {
    const direction = step >= active ? 1 : -1;
    active = step;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.step) === step)));
    panels.forEach(panel => {
      const number = Number(panel.dataset.step);
      const current = number === step;
      const previous = number === step - 1;
      const next = number === step + 1;
      const preview = previous || next;
      panel.hidden = !current && !preview;
      panel.classList.toggle('is-current', current);
      panel.classList.toggle('is-preview', preview);
      panel.classList.toggle('is-previous', previous);
      panel.classList.toggle('is-next', next);
      panel.setAttribute('aria-hidden', String(panel.hidden));
      panel.setAttribute('role', 'button');
      panel.setAttribute('tabindex', panel.hidden ? '-1' : '0');
      panel.setAttribute('aria-pressed', String(current));
      if (current && animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        panel.animate([{opacity: 0, transform: `translateY(${direction * 18}px)`}, {opacity: 1, transform: 'translateY(0)'}], {duration: 280, easing: 'ease-out'});
      }
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const step = Number(button.dataset.step);
    if (step !== active) select(step);
  }));
  panels.forEach(panel => {
    const activate = () => {const step = Number(panel.dataset.step);if(step !== active)select(step);};
    panel.addEventListener('click', activate);
    panel.addEventListener('keydown', event => {if(event.key === 'Enter' || event.key === ' '){event.preventDefault();activate();}});
  });
  select(1, false);
})();

(() => {
 const layout=document.querySelector('.review-detail-layout');if(!layout)return;
 const heading=layout.previousElementSibling;if(heading&&heading.classList.contains('review-subheading'))layout.prepend(heading);
 const art=layout.querySelector(':scope > img');
 const sizeArt=()=>layout.style.setProperty('--review-art-height',art.getBoundingClientRect().height+'px');
 new ResizeObserver(sizeArt).observe(art);art.addEventListener('load',sizeArt);
 const flow=layout.querySelector('.review-flow');
 const steps=[...flow.querySelectorAll('.review-flow-step')];
 const track=document.createElement('div');track.className='review-scroll-story';
 layout.before(track);track.append(layout);track.style.setProperty('--review-count',steps.length);
 flow.setAttribute('aria-label','Entry review workflow, advanced by scrolling the page');
 const hint=flow.querySelector('.review-scroll-hint');if(hint)hint.textContent='Scroll to explore · 1 / '+steps.length;
 let active=-1,pending=false;
 let gestureUsed=false,gestureDelta=0,gestureEnd,lastAdvance=0;
 function bounds(){const rect=track.getBoundingClientRect();return {start:scrollY+rect.top-100,distance:Math.max(1,track.offsetHeight-layout.offsetHeight)};}
 function wheel(event){
  if(!matchMedia('(min-width:851px)').matches||event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY)return;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  const {start,distance}=bounds(),end=start+distance;
  const entersDown=scrollY<start&&scrollY+delta>=start;
  const entersUp=scrollY>end&&scrollY+delta<=end;
  const inside=scrollY>=start-.5&&scrollY<=end+.5;
  if(!inside&&!entersDown&&!entersUp)return;
  const direction=Math.sign(delta);
  // Allow leaving only with a fresh gesture after the first/last step.
  if(inside&&!gestureUsed&&((active===steps.length-1&&direction>0)||(active===0&&direction<0)))return;
  event.preventDefault();
  clearTimeout(gestureEnd);gestureEnd=setTimeout(()=>{gestureUsed=false;gestureDelta=0;},200);
  if(entersDown||entersUp){
   const index=entersDown?0:steps.length-1;
   gestureUsed=true;lastAdvance=performance.now();
   scrollTo({top:start+(index+.2)/steps.length*distance,behavior:'instant'});schedule();return;
  }
  if(gestureUsed)return;
  gestureDelta+=delta;
  if(Math.abs(gestureDelta)<44||performance.now()-lastAdvance<380)return;
  gestureUsed=true;lastAdvance=performance.now();
  const next=Math.max(0,Math.min(steps.length-1,active+Math.sign(gestureDelta)));
  scrollTo({top:start+(next+.2)/steps.length*distance,behavior:'instant'});schedule();
 }
 addEventListener('wheel',wheel,{passive:false});
 function render(){
  pending=false;const desktop=matchMedia('(min-width:851px)').matches;
  const rect=track.getBoundingClientRect();
  const distance=Math.max(1,track.offsetHeight-layout.offsetHeight);
  const progress=Math.max(0,Math.min(.9999,(100-rect.top)/distance));
  const index=desktop?Math.min(steps.length-1,Math.floor(progress*steps.length)):0;
  if(index===active&&layout.dataset.desktop===String(desktop))return;
  active=index;layout.dataset.desktop=String(desktop);
  steps.forEach((step,i)=>{
   step.classList.toggle('is-active',i===index);step.classList.toggle('is-before',i<index);step.classList.toggle('is-after',i>index);
   step.setAttribute('aria-hidden',String(desktop&&i!==index));
   if(i===index)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');
  });
  if(hint)hint.textContent=String(index+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0');
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(render);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);render();
})();

(() => {
  const host = document.querySelector('.capture-explanation');
  const step = host?.querySelector('.capture-step[data-step="2"]');
  const heading = step?.querySelector('h3');
  if (!host || !step || !heading) return;
  const cue = document.createElement('span');
  cue.className = 'capture-step2-pulse';
  cue.setAttribute('aria-hidden', 'true');
  host.append(cue);
  const place = () => {
    cue.hidden = step.hidden || !step.classList.contains('is-next');
    if (cue.hidden) return;
    const box = heading.getBoundingClientRect();
    const parent = host.getBoundingClientRect();
    cue.style.left = `${box.left - parent.left + box.width / 2}px`;
    cue.style.top = `${box.top - parent.top + box.height / 2}px`;
  };
  new MutationObserver(place).observe(step, {attributes:true,attributeFilter:['class','hidden']});
  new ResizeObserver(place).observe(host);
  addEventListener('resize', place);
  document.fonts?.ready.then(place);
  place();
})();
