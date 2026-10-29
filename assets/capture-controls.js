(() => {
 const root=document.querySelector('.capture-walkthrough');if(!root)return;
 const hotspots=[...root.querySelectorAll('.capture-hotspot')];
 const dots=[...root.querySelectorAll('.capture-step-dots button')];
 const next=root.querySelector('.capture-step-next');if(!next)return;
 const current=()=>hotspots.findIndex(b=>b.getAttribute('aria-pressed')==='true');
 const update=()=>{const i=current();dots.forEach((d,j)=>d.setAttribute('aria-pressed',String(i===j)));next.disabled=i===hotspots.length-1;};
 next.addEventListener('click',()=>{const i=current();if(i<hotspots.length-1)hotspots[i+1].click();});
 dots.forEach((d,i)=>d.addEventListener('click',()=>hotspots[i].click()));
 const observer=new MutationObserver(update);hotspots.forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['aria-pressed']}));update();
})();