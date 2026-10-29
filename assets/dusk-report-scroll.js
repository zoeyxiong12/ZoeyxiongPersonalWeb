document.querySelectorAll('#report-walkthrough, #work-history-walkthrough').forEach(root=>{
 const panels=[...root.querySelectorAll('.report-view-panel')];if(panels.length!==2)return;
 const labels=panels.map(p=>p.querySelector('h4').textContent);
 const story=document.createElement('div');story.className='report-scroll-story';
 const stage=document.createElement('div');stage.className='report-scroll-stage';
 panels[0].before(story);story.append(stage);panels.forEach(p=>stage.append(p));
 const controls=document.createElement('div');controls.className='report-stack-controls';controls.setAttribute('aria-label','Choose report preview');
 const dots=panels.map((p,i)=>{const b=document.createElement('button');b.type='button';b.className='report-stack-dot';b.setAttribute('aria-label','Show '+labels[i]);b.addEventListener('click',()=>show(i));controls.append(b);return b;});
 const next=document.createElement('button');next.type='button';next.className='report-stack-next';next.innerHTML='<svg width="22" height="30" viewBox="0 0 22 30" aria-hidden="true"><path d="m6 4 11 11L6 26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';next.addEventListener('click',()=>show(1-index));stage.append(next,controls);
 const rear=document.createElement('button');rear.type='button';rear.className='report-stack-rear-label';rear.addEventListener('click',()=>show(1-index));stage.append(rear);
 const desktop=matchMedia('(min-width:901px)');let index=0;
 function show(value){index=value;render();}
 function render(){const enabled=desktop.matches;root.classList.toggle('report-deck-enabled',enabled);root.classList.toggle('report-show-progress',index===1);
  panels.forEach((p,i)=>{p.classList.toggle('report-is-front',i===index);p.classList.toggle('report-is-back',i!==index);if(enabled)p.setAttribute('aria-hidden',String(i!==index));else p.removeAttribute('aria-hidden');});
  dots.forEach((d,i)=>d.setAttribute('aria-pressed',String(i===index)));
  next.setAttribute('aria-label','Show '+labels[1-index]);rear.textContent=labels[1-index]+' ↗';rear.setAttribute('aria-label',next.getAttribute('aria-label'));
 }
 panels.forEach((p,i)=>p.querySelector('img').addEventListener('click',()=>{if(desktop.matches&&i!==index)show(i);}));
 stage.addEventListener('keydown',e=>{if(!desktop.matches)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(1-index);}});
 desktop.addEventListener('change',render);render();
});
