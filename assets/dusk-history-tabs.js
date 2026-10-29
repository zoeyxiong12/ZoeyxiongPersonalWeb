document.querySelectorAll('.history-tabs').forEach(host => {
 const tabs = [...host.querySelectorAll('[role="tab"]')];
 const panels = [...host.querySelectorAll('[role="tabpanel"]')];
 function select(index, focus = false) {
  tabs.forEach((tab,i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; panels[i].hidden = i !== index; });
  if (focus) tabs[index].focus({preventScroll:true});
 }
 tabs.forEach((tab,i) => {
  tab.addEventListener('click', () => select(i));
  tab.addEventListener('keydown', event => {
   const positions = {ArrowRight:(i+1)%tabs.length, ArrowLeft:(i+tabs.length-1)%tabs.length, Home:0, End:tabs.length-1};
   if (!(event.key in positions)) return;
   event.preventDefault(); select(positions[event.key],true);
  });
 });
 select(0);
});
