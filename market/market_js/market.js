document.querySelectorAll(".sort").forEach((sort) => {
  const summary = sort.querySelector(".sort_btn"); // summary
  const items = sort.querySelectorAll(".sort_items"); // кнопки

  items.forEach((item) => {
    item.addEventListener("click", () => {
      // 1) меняем текст в кнопке
      summary.textContent = item.textContent;

      // 2) закрываем dropdown
      sort.removeAttribute("open");
    });
  });
});

document.addEventListener("click", (e) => {
  document.querySelectorAll(".sort[open]").forEach((sort) => {
    // если клик НЕ внутри этого dropdown — закрываем
    if (!sort.contains(e.target)) {
      sort.removeAttribute("open");
    }
  });
});

// ---------------------------------------------------

const btns = [...document.querySelectorAll(".market_con1_blockcon1_category")];
const btnAll = btns.find((b) => b.dataset.cat === "all");
const btnOther = btns.filter((b) => b.dataset.cat !== "all");

function setAllActive() {
  btns.forEach((b) => b.classList.remove("active_category"));
  btnAll?.classList.add("active_category");
}

function saveCats() {
  const active = btnOther
    .filter((b) => b.classList.contains("active_category"))
    .map((b) => b.dataset.cat);
  localStorage.setItem("wr_cats", JSON.stringify(active));
}

function loadCats() {
  const raw = localStorage.getItem("wr_cats");
  if (!raw) {
    setAllActive();
    return;
  }

  let activeCats = [];
  try {
    activeCats = JSON.parse(raw) || [];
  } catch {
    activeCats = [];
  }

  btns.forEach((b) => b.classList.remove("active_category"));

  // если пусто или выбраны все 4 — считаем как "Все"
  if (activeCats.length === 0 || activeCats.length === btnOther.length) {
    setAllActive();
    return;
  }

  // включаем сохраненные
  activeCats.forEach((cat) => {
    const btn = btnOther.find((b) => b.dataset.cat === cat);
    btn?.classList.add("active_category");
  });

  // "Все" выключено, если есть хоть одна категория
  btnAll?.classList.remove("active_category");
}

function syncAllLogicAndSave() {
  const activeCount = btnOther.filter((b) =>
    b.classList.contains("active_category"),
  ).length;

  if (activeCount === btnOther.length || activeCount === 0) {
    setAllActive();
    localStorage.removeItem("wr_cats"); // можно и сохранить [] — как хочешь
    return;
  }

  saveCats();
}

// восстановление при загрузке
loadCats();

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const isAll = btn.dataset.cat === "all";

    if (isAll) {
      setAllActive();
      localStorage.removeItem("wr_cats");
      return;
    }

    btnAll?.classList.remove("active_category");
    btn.classList.toggle("active_category");
    syncAllLogicAndSave();
  });
});

// ---------------------------------------------------

// сохраняем выбор для выпадашек .sort (сортировка/тип)
document.querySelectorAll(".sort").forEach((drop) => {
  const key = drop.dataset.key; // sort или type
  if (!key) return;

  const summary = drop.querySelector(".sort_btn");
  const items = drop.querySelectorAll(".sort_items");

  // восстановление
  const saved = localStorage.getItem("wr_" + key);
  if (saved) {
    const found = [...items].find((i) => i.dataset.value === saved);
    if (found) summary.textContent = found.textContent;
  }

  // сохранение
  items.forEach((item) => {
    item.addEventListener("click", () => {
      summary.textContent = item.textContent;
      drop.removeAttribute("open");
      localStorage.setItem("wr_" + key, item.dataset.value);
    });
  });
});

// ----------------------------------------------------------

// =========================
// OFFERS: поиск + фильтры + сортировка (без ID)
// =========================

const LS_SEARCH = "wr_search";

const searchInput = document.querySelector(
  ".market_con1_blockcon1_srch_search",
);

const offersContainer = document.querySelector(".market_grid");
const offerCards = () => Array.from(document.querySelectorAll(".market_offer"));

function normText(s) {
  return (s || "").toString().trim();
}

function toLower(s) {
  return normText(s).toLowerCase();
}

function parsePrice(s) {
  const raw = normText(s).replace(/\s/g, "");
  const m = raw.match(/\d+(?:[\.,]\d+)?/);
  if (!m) return 0;
  return Number(m[0].replace(",", ".")) || 0;
}

function hydrateOfferData(card) {
  // Берём данные ИЗ ВИДИМОГО ТЕКСТА, а не из data-атрибутов
  const titleEl = card.querySelector(".offer_center_h1");
  const descEl = card.querySelector(".offer_center_p");
  const categoryEl = card.querySelector(".offer_top_category");
  const typeEl = card.querySelector(".offer_top_znak, .offer_top_znak_buy"); // берём любой из двух
  const priceEl = card.querySelector(".offer_top_price");
  const ratingEl = card.querySelector(".market_offer_profile_otziv");

  // Сохраняем оригинальные тексты для подсветки
  if (titleEl && !titleEl.dataset.originalText) {
    titleEl.dataset.originalText = normText(titleEl.textContent);
  }
  if (descEl && !descEl.dataset.originalText) {
    descEl.dataset.originalText = normText(descEl.textContent);
  }

  // Определяем категорию из текста
  function getCategoryFromText(text) {
    const t = toLower(text || "");
    if (t.includes("бит") || t.includes("beat")) return "beats";
    if (t.includes("свед") || t.includes("микс") || t.includes("mix"))
      return "mix";
    if (t.includes("облож") || t.includes("cover") || t.includes("дизайн"))
      return "covers";
    return "other";
  }

  // Определяем тип (продажа/покупка) из текста
  function getTypeFromText(text) {
    const t = toLower(text || "");
    if (t.includes("покупаю") || t.includes("куплю") || t.includes("ищ"))
      return "buy";
    return "sell"; // по умолчанию "Продаю"
  }

  // Парсим цену: "500р" → 500
  function parsePriceFromText(text) {
    const cleaned = (text || "").replace(/[^\d]/g, "");
    return parseInt(cleaned) || 0;
  }

  // Парсим рейтинг: "5.0" → 5.0
  function parseRatingFromText(text) {
    const match = (text || "").match(/\d+(?:[.,]\d+)?/);
    if (!match) return 0;
    return parseFloat(match[0].replace(",", "."));
  }

  // Заполняем dataset карточки из видимых данных
  if (titleEl) card.dataset.title = normText(titleEl.textContent);
  if (descEl) card.dataset.desc = normText(descEl.textContent);
  if (categoryEl)
    card.dataset.category = getCategoryFromText(categoryEl.textContent);
  if (typeEl) card.dataset.type = getTypeFromText(typeEl.textContent);
  if (priceEl)
    card.dataset.price = String(parsePriceFromText(priceEl.textContent));
  if (ratingEl)
    card.dataset.rating = String(parseRatingFromText(ratingEl.textContent));

  // Сохраняем оригинальный порядок
  if (!card.dataset.order) {
    const allCards = offerCards();
    card.dataset.order = String(allCards.findIndex((c) => c === card));
  }
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(el, query) {
  if (!el) return;
  const original = el.dataset.originalText ?? normText(el.textContent);
  if (!el.dataset.originalText) el.dataset.originalText = original;

  const q = normText(query);
  if (!q) {
    el.textContent = original;
    return;
  }

  const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
  el.innerHTML = original.replace(
    re,
    '<span class="offer-highlight">$1</span>',
  );
}

function getActiveCats() {
  // кнопки уже умеют сохраняться в localStorage (wr_cats)
  const raw = localStorage.getItem("wr_cats");
  if (!raw) return ["all"];
  try {
    const arr = JSON.parse(raw) || [];
    if (!arr.length) return ["all"];
    // если выбраны все 4 — считаем как all
    if (arr.length >= 4) return ["all"];
    return arr;
  } catch {
    return ["all"];
  }
}

function getSortValue() {
  return localStorage.getItem("wr_sort") || "new";
}

function getTypeValue() {
  return localStorage.getItem("wr_type") || "all";
}

function applyFiltersAndSort() {
  const cards = offerCards();
  if (!cards.length) return;

  cards.forEach(hydrateOfferData);

  const q = toLower(searchInput?.value || "");
  const cats = getActiveCats();
  const sort = getSortValue();
  const type = getTypeValue();

  // 1) фильтрация (поиск + категория + тип)
  cards.forEach((card) => {
    const title = toLower(card.dataset.title);
    const desc = toLower(card.dataset.desc);
    const cat = card.dataset.category || "other";
    const t = card.dataset.type || "sell";

    const matchSearch = !q || title.includes(q) || desc.includes(q);
    const matchCat = cats.includes("all") || cats.includes(cat);
    const matchType = type === "all" || type === t;

    const show = matchSearch && matchCat && matchType;
    card.style.display = show ? "" : "none";

    // подсветка совпадения (только для видимых)
    const titleEl = card.querySelector(".offer_center_h1");
    const descEl = card.querySelector(".offer_center_p");
    if (show) {
      highlightText(titleEl, q);
      highlightText(descEl, q);
    } else {
      // вернуть оригинал, чтобы не было мусора в скрытых
      highlightText(titleEl, "");
      highlightText(descEl, "");
    }
  });

  // 2) сортировка (только среди видимых)
  if (!offersContainer) return;
  const visible = cards.filter((c) => c.style.display !== "none");

  const byOrder = (a, b) => Number(a.dataset.order) - Number(b.dataset.order);
  const byCheap = (a, b) => Number(a.dataset.price) - Number(b.dataset.price);
  const byExp = (a, b) => Number(b.dataset.price) - Number(a.dataset.price);
  const byRating = (a, b) =>
    Number(b.dataset.rating) - Number(a.dataset.rating);

  let sorter = byOrder;
  if (sort === "cheap") sorter = byCheap;
  if (sort === "expensive") sorter = byExp;
  if (sort === "rating") sorter = byRating;

  visible.sort(sorter);
  visible.forEach((el) => offersContainer.appendChild(el));
}

// восстановление поиска
if (searchInput) {
  const savedQ = localStorage.getItem(LS_SEARCH);
  if (savedQ != null) searchInput.value = savedQ;
  searchInput.addEventListener("input", (e) => {
    localStorage.setItem(LS_SEARCH, e.target.value);
    applyFiltersAndSort();
  });
}

// реагируем на клики по категориям (кнопки уже сохраняют в localStorage)
document
  .querySelectorAll(".market_con1_blockcon1_category")
  .forEach((btn) =>
    btn.addEventListener("click", () => setTimeout(applyFiltersAndSort, 0)),
  );

// реагируем на выбор в сортировке/типе (после сохранения wr_sort / wr_type)
document
  .querySelectorAll(".sort .sort_items")
  .forEach((item) =>
    item.addEventListener("click", () => setTimeout(applyFiltersAndSort, 0)),
  );

// первый запуск
applyFiltersAndSort();

// ================= МОДАЛКА =================

// 1. Создаем словарь для перевода (вне слушателя)
const categoryTranslations = {
  beats: "Биты",
  mix: "Сведение",
  covers: "Обложки",
  other: "Прочее",
};

const modal = document.querySelector(".modal_offer_con");

document.addEventListener("click", (e) => {
  const card = e.target.closest(".market_offer");
  if (!card || !modal) return;

  hydrateOfferData(card);

  modal.style.display = "flex";

  // Исправляем статус (Продаю/Покупаю) и его цвет
  const znakEl = modal.querySelector(".modal_offer_top_znak");
  const isBuy = card.dataset.type === "buy";

  znakEl.textContent = isBuy ? "Покупаю" : "Продаю";

  // Динамически меняем класс для смены цвета (из твоего CSS)
  if (isBuy) {
    znakEl.classList.add("modal_offer_top_znak_buy");
  } else {
    znakEl.classList.remove("modal_offer_top_znak_buy");
  }

  // Перевод категории на русский
  const techCat = card.dataset.category; // получаем 'beats', 'mix' и т.д.
  modal.querySelector(".modal_offer_top_category").textContent =
    categoryTranslations[techCat] || "Прочее";

  // Остальные данные
  modal.querySelector(".modal_offer_top_price").textContent =
    card.dataset.price + "р";
  modal.querySelector(".modal_offer_h1").textContent = card.dataset.title;
  modal.querySelector(".modal_offer_p p").textContent = card.dataset.desc;
});

// ИСПРАВЛЕНИЕ ЗАКРЫТИЯ: закрываем только если кликнули по ФОНУ (modal_offer_con)
modal.addEventListener("click", (e) => {
  // e.target — это то, на что реально нажали.
  // Если нажали на темный фон (modal), а не на белую карточку (modal_offer) — закрываем.
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const allLikeButtons = document.querySelectorAll(".like_js");

  // 1. ЗАГРУЗКА: При открытии страницы проверяем, что лайкнул юзер
  allLikeButtons.forEach((likeButton) => {
    const card = likeButton.closest(".market_offer");
    const offerTitle = card
      ?.querySelector(".offer_center_h1")
      ?.textContent.trim();

    // Если этот заголовок есть в памяти — красим лайк
    if (offerTitle && localStorage.getItem("like_" + offerTitle) === "true") {
      const spanIcon = likeButton.querySelector(".like_js_ico");
      likeButton.classList.add("like_color");
      spanIcon?.classList.add("like_color_ico");

      // Прибавляем 1 к счетчику, так как в HTML по умолчанию 0
      let count = parseInt(likeButton.textContent.match(/\d+/)?.[0]) || 0;
      updateLikeUI(likeButton, count + 1);
    }
  });

  // 2. КЛИК: Сохраняем или удаляем лайк
  allLikeButtons.forEach(function (likeButton) {
    likeButton.addEventListener("click", function (e) {
      e.stopPropagation();

      const card = this.closest(".market_offer");
      const offerTitle = card
        ?.querySelector(".offer_center_h1")
        ?.textContent.trim();
      const spanIcon = this.querySelector(".like_js_ico");

      this.classList.toggle("like_color");
      spanIcon.classList.toggle("like_color_ico");

      let currentCount = parseInt(this.textContent.match(/\d+/)?.[0]) || 0;

      if (this.classList.contains("like_color")) {
        currentCount++;
        if (offerTitle) localStorage.setItem("like_" + offerTitle, "true");
      } else {
        currentCount--;
        if (offerTitle) localStorage.removeItem("like_" + offerTitle);
      }

      updateLikeUI(this, currentCount);
    });
  });

  // Вспомогательная функция, чтобы не дублировать твой innerHTML
  function updateLikeUI(btn, count) {
    const spanText =
      btn.innerHTML.match(/<span[^>]*>.*?<\/span>/)?.[0] ||
      '<span class="material-symbols-outlined like_js_ico">favorite</span>';
    btn.innerHTML = spanText + " " + count;

    // Возвращаем класс иконке, если лайк активен
    if (btn.classList.contains("like_color")) {
      btn.querySelector(".like_js_ico").classList.add("like_color_ico");
    }
  }
});
