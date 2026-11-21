const viewer = document.getElementById("wt-viewer");
if (viewer && typeof viewer.showModal === "function") {
  const enlarged = viewer.querySelector("img");
  const caption = viewer.querySelector("p");
  document.querySelectorAll(".wt-zoom").forEach(link => {
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      enlarged.src = link.href;
      enlarged.alt = link.querySelector("img").alt;
      caption.textContent = link.closest("figure").querySelector("figcaption b").textContent;
      viewer.showModal();
    });
  });
  viewer.addEventListener("click", event => {
    if (event.target !== viewer) return;
    const box = viewer.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) viewer.close();
  });
}
