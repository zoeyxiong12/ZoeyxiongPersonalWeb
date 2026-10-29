(() => {
  const wall = document.querySelector('.inspiration-wall');
  if (!wall) return;
  const figures = [...wall.querySelectorAll(':scope > figure')];
  let frame;
  function layout() {
    const width = wall.clientWidth;
    const count = innerWidth > 1499 ? 6 : innerWidth > 1100 ? 5 : innerWidth > 700 ? 4 : innerWidth > 480 ? 3 : 2;
    const gap = innerWidth > 1100 ? 18 : 14;
    const columnWidth = (width - gap * (count - 1)) / count;
    const groups = Array.from({length:count}, () => ({height:0,items:[]}));
    // Balance by natural media height, including space for each caption.
    const sized = figures.map((el,index) => ({el,index,height:columnWidth / Number(el.style.getPropertyValue('--media-ratio')) + 43})).sort((a,b)=>b.height-a.height);
    for (const item of sized) {
      const column = groups.reduce((a,b)=>a.height<=b.height?a:b);
      column.items.push(item); column.height += item.height;
    }
    wall.replaceChildren();
    wall.style.setProperty('--inspiration-columns',count);
    const columns = groups.map(group => {
      const col=document.createElement('div');col.className='inspiration-column';
      group.items.sort((a,b)=>a.index-b.index).forEach(item=>col.append(item.el));
      wall.append(col);return col;
    });
    const tallest = Math.max(...columns.map(col=>col.getBoundingClientRect().height));
    columns.forEach(col=>{col.style.minHeight=`${tallest}px`;});
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(layout);}
  addEventListener('resize',schedule);
  document.fonts.ready.then(schedule);
  layout();
})();
