// Контейнеры модалок
const modalReg = document.querySelector(".modal_con");
const modalLogin = document.querySelector(".modal_con_rg");

// Кнопки открытия из хедера
const btnOpenReg = document.querySelector(".header_register_a_rg");
const btnOpenLogin = document.querySelector(".header_register_a_vh");

// Кнопки закрытия (крестики)
const closeBtnReg = document.querySelector(".modal_block_h1");
const closeBtnLogin = document.querySelector(".modal_con_rg_block_conh1_x");

// Кнопки переключения внутри модалок
const toLoginBtn = document.querySelector(".modal_rg_vh"); // "Есть аккаунт?"
const toRegBtn = document.querySelector(".modal_con_rg_block_vh_vv"); // "Нету аккаунта?"

// Кнопки для ПЕРЕХОДА в маркет
const loginSubmitBtn = document.querySelector(".modal_con_rg_block_vh_vhod"); // Кнопка "Вход"
const registerSubmitBtn = document.querySelector(".modal_rg_rg"); // Кнопка регистрации

// --- DEV: если уже "юзер" — на лендинге делать нечего
if (window.WRAuth?.isAuth && WRAuth.isAuth()) {
   window.location.href = "../market/market.html";
}

// 1. Открытие модалок из хедера
if (btnOpenReg) btnOpenReg.onclick = () => (modalReg.style.display = "flex");
if (btnOpenLogin) btnOpenLogin.onclick = () => (modalLogin.style.display = "flex");

// 2. Переключение: из Регистрации во Вход
if (toLoginBtn) {
   toLoginBtn.onclick = () => {
      modalReg.style.display = "none";
      modalLogin.style.display = "flex";
   };
}

// 3. Переключение: из Входа в Регистрацию
if (toRegBtn) {
   toRegBtn.onclick = () => {
      modalLogin.style.display = "none";
      modalReg.style.display = "flex";
   };
}

// 4. Псевдо-авторизация (без сервера): сохраняем флаг и переходим в маркет
const goToMarketAsUser = (e) => {
   if (e) e.preventDefault();
   if (window.WRAuth?.login) WRAuth.login(); // <-- ВОТ ТУТ "вход" на локалке
   window.location.href = "../market/market.html";
};

if (loginSubmitBtn) loginSubmitBtn.onclick = goToMarketAsUser;
if (registerSubmitBtn) registerSubmitBtn.onclick = goToMarketAsUser;

// 5. Закрытие на крестики
if (closeBtnReg) closeBtnReg.onclick = () => (modalReg.style.display = "none");
if (closeBtnLogin) closeBtnLogin.onclick = () => (modalLogin.style.display = "none");

// 6. Закрытие по фону
window.onclick = (e) => {
   if (e.target === modalReg) modalReg.style.display = "none";
   if (e.target === modalLogin) modalLogin.style.display = "none";
};
