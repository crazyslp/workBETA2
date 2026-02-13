const navButtons = document.querySelectorAll(".block_items .item_bl");
const sections = {
  myOffers: document.querySelector(".offer_con"),
  favorites: document.querySelector(".offer_con_like"),
  reviews: document.querySelector(".otziv_con_block"),
  revStats: document.querySelector(".otziv_con_bot"),
};

function hideAllSections() {
  Object.values(sections).forEach((s) => s && s.classList.add("none"));
  navButtons.forEach((btn) => btn.classList.remove("active_nav"));
}

navButtons.forEach((btn, index) => {
  btn.onclick = () => {
    hideAllSections();
    btn.classList.add("active_nav"); // Кнопка просто станет фиолетовой

    if (index === 0 && sections.myOffers)
      sections.myOffers.classList.remove("none");
    if (index === 1 && sections.favorites)
      sections.favorites.classList.remove("none");
    if (index === 2 && sections.reviews) {
      sections.reviews.classList.remove("none");
      if (sections.revStats) sections.revStats.classList.remove("none");
      updateAllStats();
    }
  };
});

// --- Функции лайков и статистики оставляем без изменений ---
document.addEventListener("click", (e) => {
  const likeBtn = e.target.closest(".like_js");
  if (!likeBtn) return;
  const icon = likeBtn.querySelector(".like_js_ico");
  const isLiked = likeBtn.classList.toggle("active_like");
  let count = parseInt(likeBtn.textContent.trim()) || 0;
  if (isLiked) {
    count++;
    likeBtn.style.color = "red";
    if (icon) icon.style.fontVariationSettings = "'FILL' 1";
  } else {
    count--;
    likeBtn.style.color = "";
    if (icon) icon.style.fontVariationSettings = "'FILL' 0";
  }
  likeBtn.innerHTML = `<span class="material-symbols-outlined like_js_ico">${icon ? icon.innerText : "favorite"}</span> ${count}`;
});

function updateAllStats() {
  const allReviews = document.querySelectorAll(".otziv_block_items");
  const totalReviews = allReviews.length;
  let totalStarsSum = 0;
  allReviews.forEach(
    (rev) => (totalStarsSum += rev.querySelectorAll(".filled").length),
  );
  const avg =
    totalReviews > 0 ? (totalStarsSum / totalReviews).toFixed(1) : "0.0";
  const numAvg = parseFloat(avg);

  const statsDisplay = document.querySelectorAll(".otziv_flex1 .otziv_items");
  if (statsDisplay.length >= 2) {
    statsDisplay[0].innerText = totalReviews;
    statsDisplay[1].innerText = avg;
  }

  const numText = document.querySelector(".number_otziv");
  const countText = document.querySelector(".kolvo_otziv");
  if (numText) numText.innerText = avg;
  if (countText) countText.innerText = `(${totalReviews})`;

  const starContainer = document.querySelector(".otziv_con .star");
  if (starContainer) {
    const stars = starContainer.querySelectorAll(
      ".material-symbols-outlined:not(.number_otziv):not(.kolvo_otziv)",
    );
    stars.forEach((star, index) => {
      const starLevel = index + 1;
      star.classList.remove("filled", "no_star", "half-fill");
      star.innerText = "kid_star";
      if (starLevel <= Math.floor(numAvg)) {
        star.classList.add("filled");
        star.style.fontVariationSettings = "'FILL' 1";
      } else if (
        starLevel === Math.ceil(numAvg) &&
        numAvg % 1 >= 0.3 &&
        numAvg % 1 <= 0.7
      )
        star.classList.add("half-fill");
      else if (starLevel === Math.ceil(numAvg) && numAvg % 1 > 0.7) {
        star.classList.add("filled");
        star.style.fontVariationSettings = "'FILL' 1";
      } else star.classList.add("no_star");
    });
  }
}

document.addEventListener("DOMContentLoaded", updateAllStats);
// Автоматически "кликаем" по первой кнопке при загрузке
if (navButtons[0]) {
  navButtons[0].click();
}
