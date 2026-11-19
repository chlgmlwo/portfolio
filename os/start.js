// 공통: 시작 메뉴, 작업 표시줄 시계, 바탕화면 배경(이 브라우저에만 기억).
(() => {
  // 이 스크립트가 있는 os 폴더 기준으로 링크를 만든다 (404 페이지처럼 다른 위치에서 불러도 동작하도록)
  const OS = new URL(".", (document.currentScript && document.currentScript.src) || location.href).href;
  const at = (u) => (/^(https?:|mailto:|tel:)/.test(u) ? u : new URL(u, OS).href);

  // 배경
  const WALLS = [["blue", "하늘"], ["sunset", "노을"], ["forest", "숲"], ["night", "밤"]];
  const root = document.documentElement;
  const setWall = (key, save = true) => {
    WALLS.forEach(([k]) => root.classList.remove("wp-" + k));
    root.classList.add("wp-" + key);
    if (save) { try { localStorage.setItem("chj-wall", key); } catch (e) {} }
    document.dispatchEvent(new CustomEvent("wallchange", { detail: key }));
  };
  let saved = "blue";
  try { saved = localStorage.getItem("chj-wall") || "blue"; } catch (e) {}
  if (!WALLS.some(([k]) => k === saved)) saved = "blue";
  setWall(saved, false);
  const currentWall = () => (WALLS.find(([k]) => root.classList.contains("wp-" + k)) || WALLS[0])[0];
  window.chjDesktop = { WALLS, setWall, currentWall };

  // 시계
  const wrap = document.querySelector("header.site .wrap");
  if (wrap) {
    const tray = document.createElement("span");
    tray.className = "tray";
    tray.innerHTML = `<span class="t-time"></span><span class="t-date"></span>`;
    wrap.appendChild(tray);
    const tick = () => {
      const d = new Date();
      tray.querySelector(".t-time").textContent = d.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
      tray.querySelector(".t-date").textContent = d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\.\s?$/, "");
    };
    tick(); setInterval(tick, 15000);
  }

  // 시작 메뉴
  const brand = document.querySelector("header.site .brand");
  if (!brand) return;
  const projects = [
    ["belief.html", "BELIEF", "belief-city.webp"],
    ["ghost-mischief.html", "오늘도 유령 소동!", "ghost-reveal.jpg"],
    ["whos-tail.html", "WHO’S TAIL", "wt-skywalk.jpg"],
    ["service-planning.html", "라이브 커머스 서비스 기획", "service-planning.jpg"],
    ["fairytale.html", "동화 속 변주곡", "fairytale-cover.webp"],
    ["wise-axe.html", "현명한 도끼 3", "axe-home.webp"],
    ["qa-report.html", "CBT 게임 QA 분석", "qa-report.jpg"]
  ];
  const recs = [
    ["index.html#profile", "프로필", "게임 기획자 · Unity 프로토타이핑", "doc"],
    ["index.html#cv", "이력.txt", "학력, 수상, 작업 도구", "doc"],
    ["../clean/index.html", "포트폴리오.pdf", "한 페이지로 정리한 버전", "pdf"],
    ["https://chlgmlwo.github.io/belief/", "BELIEF 플레이", "브라우저에서 바로 실행", "play"],
    ["mailto:itr1823er@naver.com", "이메일", "itr1823er@naver.com", "mail"],
  ];
  const menu = document.createElement("div");
  menu.className = "startmenu";
  menu.id = "startmenu";
  menu.hidden = true;
  menu.setAttribute("role", "dialog");
  menu.setAttribute("aria-label", "시작 메뉴");
  menu.innerHTML = `
    <div class="sm-head"><b>고정됨</b><a href="${at("index.html#projects")}">모든 프로젝트 ›</a></div>
    <div class="sm-pins">${projects.map(([h, n, img]) => `<a href="${at(h)}"><img src="${at("../assets/" + img)}" alt=""><span>${n}</span></a>`).join("")}</div>
    <div class="sm-head"><b>추천</b></div>
    <div class="sm-recs">${recs.map(([h, n, d, k]) => `<a href="${at(h)}"><i class="sm-ico ${k}" aria-hidden="true"></i><span><b>${n}</b><small>${d}</small></span></a>`).join("")}</div>
    <div class="sm-foot"><span class="sm-user"><i aria-hidden="true">최</i><span><b>최희재</b><small>게임 기획자</small></span></span><span class="sm-actions"><button type="button" class="sm-wall">배경 바꾸기</button><a href="${at("index.html")}">바탕화면</a></span></div>`;
  document.body.appendChild(menu);
  brand.setAttribute("aria-expanded", "false");
  brand.setAttribute("aria-controls", "startmenu");

  const set = (open) => {
    menu.hidden = !open;
    brand.setAttribute("aria-expanded", String(open));
    brand.classList.toggle("open", open);
    if (open) menu.querySelector("a")?.focus({ preventScroll: true });
  };
  brand.addEventListener("click", (e) => { e.preventDefault(); set(menu.hidden); });
  document.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target) && !brand.contains(e.target)) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { set(false); brand.focus(); } });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  menu.querySelector(".sm-wall").addEventListener("click", () => {
    const i = WALLS.findIndex(([k]) => k === currentWall());
    setWall(WALLS[(i + 1) % WALLS.length][0]);
  });
})();
