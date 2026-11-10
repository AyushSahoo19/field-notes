const stackToolbar = document.querySelector('html[data-study-atlas="ai-stack-atlas"] .controls');
if (stackToolbar) {
  const updateClearance = () => {
    document.documentElement.style.setProperty("--stack-controls-clearance", `${stackToolbar.offsetHeight + 12}px`);
  };
  updateClearance();
  new ResizeObserver(updateClearance).observe(stackToolbar);
}

// The AI Stack creates its layers in JavaScript, after the browser has parsed the fragment.
function scrollToAtlasSection(hash) {
  const section = document.getElementById(hash.slice(1));
  if (!section || !section.getClientRects().length) return false;
  section.scrollIntoView({ block: "start" });
  return true;
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href^="#"]');
  if (!link || !scrollToAtlasSection(link.hash)) return;

  event.preventDefault();
  if (link.hash !== location.hash) history.pushState(null, "", link.hash);
});

if (location.hash) requestAnimationFrame(() => scrollToAtlasSection(location.hash));
