(() => {
 document.querySelectorAll('a').forEach(link => {
  const walk = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
  const nodes = []; let node;
  while ((node = walk.nextNode())) {
   if (/[↗←→↙]/.test(node.textContent) && !node.parentElement.closest('svg, .inline-link-arrow')) nodes.push(node);
  }
  nodes.forEach(node => {
   if (node.parentElement.classList.contains('dusk-link-arrow')) {
    node.parentElement.classList.add('inline-link-arrow');
    node.parentElement.dataset.direction = 'diagonal'; return;
   }
   const parts = node.textContent.split(/([↗←→↙])/); const fragment = document.createDocumentFragment();
   parts.forEach(text => {
    if (/^[↗←→↙]$/.test(text)) {
     const span = document.createElement('span'); span.className = 'inline-link-arrow';
     span.dataset.direction = text === '←' ? 'left' : text === '→' ? 'right' : 'diagonal';
     span.setAttribute('aria-hidden', 'true'); span.textContent = text; fragment.append(span);
    } else fragment.append(document.createTextNode(text));
   }); node.replaceWith(fragment);
  });
 });
})();
