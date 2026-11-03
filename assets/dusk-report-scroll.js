(()=>{
 const root=document.querySelector('.worklog-gallery');if(!root)return;
 const slides=[...root.querySelectorAll('.worklog-slide')],tabs=[...root.querySelectorAll('[role="tab"]')];
 const stage=root.querySelector('.worklog-stage'),next=root.querySelector('.worklog-next'),status=root.querySelector('.worklog-status');
 const labels=['Daily standup','Progress update','Calendar','Dashboard'],starts=[0,2,3];let index=0,busy=false;
 const dots=slides.map((slide,i)=>{const b=document.createElement('button');b.type='button';b.className='worklog-dot';b.setAttribute('aria-label','Show '+labels[i]);b.addEventListener('click',()=>show(i));root.querySelector('.worklog-dots').append(b);return b;});
 async function show(i,instant=false){
  const target=(i+slides.length)%slides.length;
  if(busy)return;
  if(!instant&&target!==index&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   busy=true;const current=slides[index].querySelector('img');
   const box=current.getBoundingClientRect(),host=stage.getBoundingClientRect();
   const distance=(target-index+slides.length)%slides.length;
   const rail=document.createElement('div');rail.className='worklog-motion-rail';
   Object.assign(rail.style,{left:(box.left-host.left)+'px',top:(box.top-host.top)+'px',height:box.height+'px',gap:'18px'});
   for(let k=0;k<=distance+1;k++){const img=slides[(index+k)%slides.length].querySelector('img').cloneNode();img.removeAttribute('loading');img.removeAttribute('width');img.removeAttribute('height');img.alt='';Object.assign(img.style,{width:box.width+'px',height:box.height+'px',flex:'0 0 '+box.width+'px'});rail.append(img);}
   stage.append(rail);await Promise.all([...rail.children].map(i=>i.decode().catch(()=>{})));
   root.classList.add('worklog-is-moving');
   await rail.animate([{transform:'translateX(0)'},{transform:'translateX(-'+((box.width+18)*distance)+'px)'}],{duration:distance===1?560:700,easing:'cubic-bezier(.22,.68,.16,1)',fill:'forwards'}).finished;
   index=target;render();rail.remove();root.classList.remove('worklog-is-moving');busy=false;return;
  }
  index=target;render();
 }
 function render(){const category=index<2?0:index-1;
  slides.forEach((s,j)=>{s.hidden=false;const depth=(j-index+slides.length)%slides.length;s.dataset.depth=depth;s.style.setProperty('--depth',depth);s.setAttribute('aria-hidden',String(depth!==0));s.style.zIndex=String(4-depth);});
  tabs.forEach((t,j)=>{t.setAttribute('aria-selected',String(j===category));t.tabIndex=j===category?0:-1;});
  stage.id='worklog-panel';stage.setAttribute('aria-labelledby',tabs[category].id);
  dots.forEach((d,j)=>d.setAttribute('aria-pressed',String(j===index)));
  status.textContent=labels[index]+' · '+(index+1)+' of 4';next.setAttribute('aria-label','Next: '+labels[(index+1)%4]);
 }
 stage.setAttribute('role','tabpanel');
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>show(starts[i]));t.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%3;else if(e.key==='ArrowLeft')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;else return;e.preventDefault();show(starts[n]);tabs[n].focus();});});
 next.addEventListener('click',()=>show(index+1));show(0,true);
})();
