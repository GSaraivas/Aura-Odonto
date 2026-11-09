"use strict";

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);

const sectionMarkup = {
  TREATMENTS: config => config.treatments.map(({ icon, name, summary, detail }, index) => `
    <article class="treatment-card">
      <span class="index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <svg aria-hidden="true"><use href="#${escapeHTML(icon)}"></use></svg>
      <h3>${escapeHTML(name)}</h3><p>${escapeHTML(summary)}</p>
      <details class="treatment-fallback"><summary>Saiba mais <span aria-hidden="true"></span></summary><p>${escapeHTML(detail)}</p></details>
      <a class="text-link" href="#agendamento" data-treatment="${index}" aria-label="Saiba mais sobre ${escapeHTML(name)}" hidden>Saiba mais <span aria-hidden="true">↗</span></a>
    </article>`).join(""),
  TEAM: config => config.team.map(({ name, registration, specialty, bio, image, alt }, index) => `
    <article class="team-card">
      <div class="photo"><img src="${escapeHTML(image)}" alt="${escapeHTML(alt)}" width="512" height="640" loading="lazy" decoding="async"></div>
      <h3>${escapeHTML(name)}</h3><p>${escapeHTML(registration)} · ${escapeHTML(specialty)}</p><p>${escapeHTML(bio)}</p>
      <a class="text-link" href="#agendamento" data-contact="team" data-team="${index}">Solicitar atendimento <span aria-hidden="true">↗</span></a>
    </article>`).join(""),
  FAQ: config => config.faq.map(([question, answer], index) => `
    <details name="aura-faq"><summary aria-controls="faq-answer-${index}">${escapeHTML(question)} <span aria-hidden="true"></span></summary><div class="answer" id="faq-answer-${index}"><p>${escapeHTML(answer)}</p></div></details>`).join("")
};

// Browser setup
(() => {
  const config = CLINIC_CONFIG;
  const find = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const mobile = find("#mobile-nav");
  const menu = find(".menu-toggle");
  const dialog = find("#info-dialog");
  const action = find("#dialog-action");
  const livePhone = !config.demo && config.whatsapp !== "5511999999999" && /^\d{10,15}$/.test(config.whatsapp);
  const contactURL = message => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  let returnFocus;

  function openWhatsApp(message) {
    if (livePhone) window.open(contactURL(message), "_blank", "noopener,noreferrer");
  }

  function showInfo({ label, title, copy, note = "", message = "" }, trigger) {
    returnFocus = trigger;
    find("#dialog-label").textContent = label;
    find("#dialog-title").textContent = title;
    find("#dialog-copy").textContent = copy;
    find("#dialog-note").textContent = note;
    action.hidden = !message;
    if (message) {
      action.textContent = "Conversar sobre este tratamento";
      action.href = livePhone ? contactURL(message) : "#agendamento";
      action.target = livePhone ? "_blank" : "";
      action.rel = "noopener noreferrer";
      action.onclick = event => {
        event.preventDefault();
        if (livePhone) openWhatsApp(message);
        else showPreview(message, trigger);
      };
    }
    if (!dialog.open) dialog.showModal();
    else dialog.querySelector("[data-close]").focus();
  }

  function showPreview(message, trigger) {
    showInfo({
      label: config.demo ? "Modo demonstração" : "Contato indisponível",
      title: "Prévia da mensagem",
      copy: message,
      note: "O envio pelo WhatsApp será habilitado quando o número oficial da clínica estiver configurado."
    }, trigger);
  }

  for (const [key, selector] of Object.entries({ TREATMENTS: "#treatment-grid", TEAM: "#team-grid", FAQ: ".faq-list" })) {
    const section = find(selector);
    const content = sectionMarkup[key](config);
    const template = document.createElement("template");
    template.innerHTML = content;
    if (section.innerHTML.trim() !== template.innerHTML.trim()) section.replaceChildren(template.content);
  }

  for (const element of all("[data-clinic-name]")) element.textContent = config.name;
  for (const element of all(".brand")) {
    element.firstElementChild.firstChild.nodeValue = config.wordmark;
    element.setAttribute("aria-label", `${config.name}, início`);
  }
  if (!config.demo) for (const element of all("[data-demo], #demo-note")) element.hidden = true;

  const urls = {
    email: !config.demo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email) ? `mailto:${config.email}` : "",
    instagram: !config.demo && /^https:\/\/(www\.)?instagram\.com\//i.test(config.instagram) ? config.instagram : "",
    phone: livePhone ? contactURL(`Olá! Gostaria de falar com a equipe da ${config.name}.`) : ""
  };
  for (const field of all("[data-field]")) {
    const key = field.dataset.field;
    const value = key === "instagram" ? (urls.instagram ? "Instagram da clínica ↗" : "[Perfil da clínica]") : config[key];
    if (urls[key]) {
      const link = document.createElement("a");
      link.href = urls[key];
      link.textContent = value;
      if (key !== "email") { link.target = "_blank"; link.rel = "noopener noreferrer"; }
      field.replaceChildren(link);
    } else field.textContent = value;
  }
  if (!config.demo && /^https:\/\//i.test(config.directions)) {
    const directions = find("#directions");
    directions.href = config.directions;
    directions.target = "_blank";
    directions.rel = "noopener noreferrer";
    directions.hidden = false;
  }

  function contactMessage(link) {
    const prefix = `Olá! Conheci o site da ${config.name}`;
    const requests = {
      header: " e gostaria de consultar horários para uma avaliação.",
      hero: " e gostaria de solicitar uma consulta.",
      booking: " e gostaria de saber quais horários estão disponíveis para agendamento.",
      floating: " e gostaria de conversar com a equipe sobre os atendimentos.",
      team: config.demo
        ? " e gostaria de saber mais sobre a equipe e solicitar atendimento."
        : ` e gostaria de consultar a disponibilidade de atendimento com ${config.team[link.dataset.team]?.name || "a equipe"}.`
    };
    return prefix + requests[link.dataset.contact];
  }

  const supportsDialog = typeof dialog.showModal === "function";
  for (const link of all("[data-contact]")) {
    const message = contactMessage(link);
    if (livePhone) {
      link.href = contactURL(message);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    if (!supportsDialog || livePhone) continue;
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", event => {
      event.preventDefault();
      const fromMenu = mobile.open;
      if (fromMenu) closeMenu(false);
      showPreview(message, fromMenu ? menu : link);
    });
  }

  if (supportsDialog) {
    menu.hidden = false;
    find(".menu-fallback").hidden = true;
    menu.addEventListener("click", () => {
      mobile.showModal();
      menu.setAttribute("aria-expanded", "true");
      window.AuraMotion?.menu(mobile.querySelector(".mobile-panel"));
    });
    mobile.addEventListener("close", () => {
      if (!mobile.open) menu.setAttribute("aria-expanded", "false");
    });
    mobile.querySelector("[data-close]").addEventListener("click", () => closeMenu());
    for (const link of mobile.querySelectorAll("a")) {
      link.addEventListener("click", () => {
        if (!mobile.open) return;
        const target = link.hash && document.getElementById(link.hash.slice(1));
        closeMenu(!target);
        if (target) {
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
        }
      });
    }
    matchMedia("(min-width: 1060px)").addEventListener("change", event => {
      if (event.matches && mobile.open) {
        closeMenu(false);
        find(".desktop-nav a").focus();
      }
    });
    dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => returnFocus?.focus({ preventScroll: true }));

    for (const link of all("[data-treatment]")) {
      const treatment = config.treatments[link.dataset.treatment];
      link.hidden = false;
      link.setAttribute("aria-haspopup", "dialog");
      link.previousElementSibling.hidden = true;
      link.addEventListener("click", event => {
        event.preventDefault();
        showInfo({
          label: "Área de cuidado",
          title: treatment.name,
          copy: treatment.detail,
          note: "Informação geral. A indicação depende de avaliação profissional individual.",
          message: `Olá! Conheci o site da ${config.name} e gostaria de saber mais sobre a seguinte área de cuidado: ${treatment.name.toLocaleLowerCase("pt-BR")}.`
        }, link);
      });
    }
    find("[data-privacy]").addEventListener("click", event => {
      event.preventDefault();
      showInfo({
        label: "Informações do site",
        title: "Política de Privacidade",
        copy: find("#privacidade p").textContent,
        note: "O navegador também pode consultar um serviço externo para carregar as animações."
      }, event.currentTarget);
    });
  }

  function closeMenu(restore = true) {
    mobile.close();
    if (restore) menu.focus({ preventScroll: true });
  }

  const faq = all(".faq-list details");
  for (const item of faq) {
    const summary = item.querySelector("summary");
    summary.setAttribute("aria-expanded", String(item.open));
    item.addEventListener("toggle", () => {
      if (item.open) for (const other of faq) if (other !== item) other.open = false;
      summary.setAttribute("aria-expanded", String(item.open));
    });
  }

  const reviewCard = find("#review-card");
  const reviews = config.reviews;
  find("#avaliacoes").hidden = !config.showReviews;
  if (config.showReviews && reviews.length) {
    let reviewIndex = 0;
    const updateReview = () => {
      const { quote, author, date, source } = reviews[reviewIndex];
      const paragraph = document.createElement("p");
      paragraph.textContent = quote;
      const cite = document.createElement("cite");
      cite.textContent = [author, date, source].filter(Boolean).join(" · ");
      reviewCard.replaceChildren(paragraph, cite);
      find("#review-position").textContent = `${reviewIndex + 1} / ${reviews.length}`;
    };
    find(".review-controls").hidden = reviews.length < 2;
    for (const button of all("[data-review]")) button.addEventListener("click", () => {
      reviewIndex = (reviewIndex + Number(button.dataset.review) + reviews.length) % reviews.length;
      updateReview();
    });
    updateReview();
  }

  for (const image of all("img")) {
    const showFallback = () => image.classList.add("image-failed");
    image.addEventListener("error", showFallback, { once: true });
    if (image.complete && !image.naturalWidth) showFallback();
  }

  const header = find("#header");
  const updateHeader = () => header.classList.toggle("scrolled", scrollY > 25);
  updateHeader();
  addEventListener("scroll", updateHeader, { passive: true });
  find("#year").textContent = new Date().getFullYear();

  const navLinks = all(".desktop-nav a, .mobile-panel nav a");
  const sections = [...new Set(navLinks.map(link => link.hash))].map(hash => document.querySelector(hash));
  if ("IntersectionObserver" in window) {
    const visible = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      const active = sections.find(section => visible.has(section));
      for (const link of navLinks) {
        if (link.hash === `#${active?.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }, { rootMargin: "-18% 0px -57% 0px" });
    for (const section of sections) observer.observe(section);
  }
})();
