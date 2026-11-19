// 프로젝트 뷰어: 왼쪽 목차가 지금 읽는 섹션을 따라가고, 목차를 누르면 그 섹션으로 부드럽게 이동한다.
(() => {
  const content = document.getElementById("content");
  const toc = document.querySelector(".toc");
  if (!content || !toc) return;
  const links = [...toc.querySelectorAll("a")];
  const panes = links.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  const scroller = () => (content.scrollHeight > content.clientHeight + 4 && getComputedStyle(content).overflowY !== "visible" ? content : null);

  const mark = () => {
    const sc = scroller();
    const top = sc ? sc.getBoundingClientRect().top : 0;
    const line = top + (sc ? sc.clientHeight : innerHeight) * 0.25;
    let cur = panes[0];
    for (const p of panes) if (p.getBoundingClientRect().top <= line) cur = p;
    const atEnd = sc ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4 : innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    if (atEnd) cur = panes[panes.length - 1];
    links.forEach((a) => {
      const on = a.getAttribute("href") === "#" + cur.id;
      a.classList.toggle("on", on);
      if (on && toc.scrollWidth > toc.clientWidth) a.scrollIntoView({ block: "nearest", inline: "center" });
    });
  };
  content.addEventListener("scroll", mark, { passive: true });
  addEventListener("scroll", mark, { passive: true });
  addEventListener("resize", mark);

  document.querySelectorAll('.toc a, .rail a').forEach((a) => a.addEventListener("click", (e) => {
    const t = document.getElementById(a.getAttribute("href").slice(1));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#" + t.id);
  }));

  // 지금 프로젝트 탭이 보이도록
  document.querySelector(".tab.on")?.scrollIntoView({ block: "nearest", inline: "center" });
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
  mark();
})();
