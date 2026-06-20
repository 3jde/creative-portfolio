(function () {
  const works = (window.ONEZ_WORKS || []).filter((work) => work.published !== false);
  const labels = {
    all: "All <span class=\"zh\">全部</span>",
    generative: "Generative <span class=\"zh\">生成艺术</span>",
    game: "Game <span class=\"zh\">游戏</span>",
    camera: "Digital <span class=\"zh\">交互影像</span>"
  };

  function byDateDesc(a, b) {
    return String(b.date || "").localeCompare(String(a.date || ""));
  }

  function sectionName(section) {
    return labels[section] || section;
  }

  function createCard(work, options = {}) {
    const card = document.createElement("a");
    card.className = `work-card${options.large ? " large" : ""}`;
    card.href = work.url;
    card.dataset.section = work.section;
    card.dataset.palette = work.palette || "lime";
    card.setAttribute("aria-label", `打开作品：${work.title}`);

    card.setAttribute("aria-label", `Open work: ${work.title}`);
    const cover = work.cover || `assets/covers/${work.id}.png`;
    if (cover) {
      card.classList.add("has-cover");
    }

    const tags = (work.tags || []).slice(0, options.tagLimit || 4)
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    card.innerHTML = `
      <div class="work-preview" aria-hidden="true">
        ${cover ? `<img src="${cover}" alt="" loading="lazy">` : ""}
      </div>
      <div class="work-body">
        <div class="work-meta">
          <span>${work.date || ""}</span>
          <span>${work.status || sectionName(work.section)}</span>
        </div>
        <h3>${work.title}</h3>
        <p>${work.description}</p>
        <div class="tag-list">${tags}</div>
      </div>
    `;

    return card;
  }

  function renderStats() {
    const target = document.querySelector("[data-stats]");
    if (!target) return;

    const counts = {
      all: works.length,
      generative: works.filter((work) => work.section === "generative").length,
      game: works.filter((work) => work.section === "game").length,
      camera: works.filter((work) => work.section === "camera").length
    };

    target.innerHTML = `
      <div class="stat"><strong>${counts.all}</strong><span>Works currently in catalog. <span class=\"zh\">当前已纳入目录的作品。</span></span></div>
      <div class="stat"><strong>${counts.generative}</strong><span>Generative art & daily experiments. <span class=\"zh\">生成艺术与每日实验，保留归档并突出精选。</span></span></div>
      <div class="stat"><strong>${counts.game}</strong><span>Browser games & interactive mechanics. <span class=\"zh\">浏览器游戏与互动玩法。</span></span></div>
      <div class="stat"><strong>${counts.camera}</strong><span>Webcam, vision tracking & real-time digital art. <span class=\"zh\">摄像头、视觉追踪与实时影像互动作品。</span></span></div>
    `;
  }

  function renderFeatured() {
    const target = document.querySelector("[data-featured]");
    if (!target) return;

    const view = target.dataset.view || "all";
    const featured = works
      .filter((work) => work.featured)
      .filter((work) => view === "all" || work.section === view)
      .sort(byDateDesc)
      .slice(0, Number(target.dataset.limit || 6));

    target.replaceChildren(...featured.map((work, index) => createCard(work, {
      large: index === 0,
      tagLimit: 4
    })));
  }

  function renderArchive() {
    const target = document.querySelector("[data-archive]");
    if (!target) return;

    const view = target.dataset.view || document.body.dataset.view || "all";
    const initial = works
      .filter((work) => view === "all" || work.section === view)
      .sort(byDateDesc);
    const searchInput = document.querySelector("[data-search]");
    const buttons = Array.from(document.querySelectorAll("[data-filter]"));
    const empty = document.querySelector("[data-empty]");
    let activeFilter = view === "all" ? "all" : view;

    function apply() {
      const query = (searchInput?.value || "").trim().toLowerCase();
      const filtered = initial.filter((work) => {
        const sectionMatch = activeFilter === "all" || work.section === activeFilter;
        const haystack = [
          work.title,
          work.description,
          work.format,
          work.status,
          ...(work.tags || [])
        ].join(" ").toLowerCase();
        return sectionMatch && (!query || haystack.includes(query));
      });

      target.replaceChildren(...filtered.map((work) => createCard(work, { tagLimit: 4 })));
      if (empty) empty.classList.toggle("visible", filtered.length === 0);
      buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === activeFilter);
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        apply();
      });
    });

    searchInput?.addEventListener("input", apply);
    apply();
  }

  function renderHeroCanvas() {
    const canvas = document.querySelector("[data-hero-canvas]");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const pointer = { x: 0.5, y: 0.45 };
    let width = 0;
    let height = 0;
    let particles = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(90, Math.floor(width / 6)) }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.8,
        speed: 0.25 + Math.random() * 0.7,
        phase: index * 0.37
      }));
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#090b0d";
      ctx.fillRect(0, 0, width, height);

      const px = pointer.x * width;
      const py = pointer.y * height;
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, Math.max(width, height) * 0.72);
      gradient.addColorStop(0, "rgba(204,255,0,0.16)");
      gradient.addColorStop(0.42, "rgba(72,231,255,0.08)");
      gradient.addColorStop(1, "rgba(5,5,5,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(244,247,239,0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 34) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + Math.sin(time / 900 + x) * 18, height);
        ctx.stroke();
      }

      particles.forEach((p, index) => {
        const drift = Math.sin(time / 850 + p.phase) * 18;
        p.y += p.speed;
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        const dx = p.x - px;
        const dy = p.y - py;
        const distance = Math.hypot(dx, dy);
        const glow = Math.max(0, 1 - distance / 240);
        ctx.fillStyle = glow > 0.25 ? "rgba(204,255,0,0.92)" : "rgba(244,247,239,0.38)";
        ctx.beginPath();
        ctx.arc(p.x + drift, p.y, p.r + glow * 2.5, 0, Math.PI * 2);
        ctx.fill();

        const next = particles[index + 1];
        if (next && Math.abs(next.y - p.y) < 96) {
          ctx.strokeStyle = `rgba(204,255,0,${0.06 + glow * 0.14})`;
          ctx.beginPath();
          ctx.moveTo(p.x + drift, p.y);
          ctx.lineTo(next.x + Math.sin(time / 850 + next.phase) * 18, next.y);
          ctx.stroke();
        }
      });

      window.requestAnimationFrame(draw);
    }

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
    });

    window.addEventListener("resize", resize);
    resize();
    window.requestAnimationFrame(draw);
  }

  renderStats();
  renderFeatured();
  renderArchive();
  renderHeroCanvas();
})();
