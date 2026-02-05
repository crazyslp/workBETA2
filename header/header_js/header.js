// header.js — общий для всех страниц
(function () {
  // Ждём DOM, чтобы элементы точно существовали
  document.addEventListener("DOMContentLoaded", () => {
    // ---------- 1) ЭЛЕМЕНТЫ ХЕДЕРА ----------
    const profile = document.querySelector(".header_profile");
    const profileBlock = document.querySelector(".header_profile_block");
    const register = document.querySelector(".header_register");
    const glav = document.getElementById("glav"); // если есть

    // ---------- 2) МОДАЛКИ ----------
    const modalReg = document.querySelector(".modal_con"); // Регистрация
    const modalLogin = document.querySelector(".modal_con_rg"); // Вход

    // ---------- 3) СКРОЛЛ (LOCK/UNLOCK) ----------
    let savedOverflow = "";
    let savedPaddingRight = "";

    function lockScroll() {
      savedOverflow = document.body.style.overflow;
      savedPaddingRight = document.body.style.paddingRight;

      // чтобы страница не "прыгала" при пропаже скроллбара
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = scrollBarWidth + "px";
      }
    }

    function unlockScroll() {
      document.body.style.overflow = savedOverflow;
      document.body.style.paddingRight = savedPaddingRight;
    }

    function openModal(modalEl) {
      if (!modalEl) return;
      modalEl.style.display = "flex";
      lockScroll();
    }

    function closeModal(modalEl) {
      if (!modalEl) return;
      modalEl.style.display = "none";

      // если обе модалки закрыты — возвращаем скролл
      const regOpen = modalReg && getComputedStyle(modalReg).display !== "none";
      const logOpen =
        modalLogin && getComputedStyle(modalLogin).display !== "none";

      if (!regOpen && !logOpen) unlockScroll();
    }

    function closeAllModals() {
      closeModal(modalReg);
      closeModal(modalLogin);
    }

    // ---------- 4) ПОКАЗАТЬ ЮЗЕРА / ГОСТЯ ----------
    function showProfile() {
      if (profile) {
        profile.classList.remove("displaynone");
        profile.classList.add("displayopen");
      }
      if (register) {
        register.classList.remove("displayopen");
        register.classList.add("displaynone");
      }
      if (glav) {
        glav.classList.remove("displayopen");
        glav.classList.add("displaynone");
      }
    }

    function showRegister() {
      if (profile) {
        profile.classList.remove("displayopen");
        profile.classList.add("displaynone");
      }
      if (register) {
        register.classList.remove("displaynone");
        register.classList.add("displayopen");
      }
      if (glav) {
        glav.classList.remove("displaynone");
        glav.classList.add("displayopen");
      }
    }

    // Восстановление состояния из localStorage
    if (window.WRAuth?.isAuth && WRAuth.isAuth()) showProfile();
    else showRegister();

    // ---------- 5) ВЫПАДАЮЩЕЕ МЕНЮ ПРОФИЛЯ ----------
    if (profile && profileBlock) {
      profile.addEventListener("click", (e) => {
        // кликаем по профилю, но не по самому блоку меню
        if (
          e.target.closest(".header_profile") &&
          !e.target.closest(".header_profile_block")
        ) {
          const isHidden = getComputedStyle(profileBlock).display === "none";
          profileBlock.style.display = isHidden ? "flex" : "none";
        }
      });
    }

    // Выйти
    const logoutBtn = document.querySelector(".header_profile_block_butt");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.WRAuth?.logout) WRAuth.logout();
        if (profileBlock) profileBlock.style.display = "none";
        showRegister();
      });
    }

    // ---------- 6) ОТКРЫТИЕ МОДАЛОК ИЗ ХЕДЕРА ----------
    const openRegBtn = document.querySelector(".header_register_a_rg");
    const openLoginBtn = document.querySelector(".header_register_a_vh");

    if (openRegBtn)
      openRegBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(modalReg);
      });

    if (openLoginBtn)
      openLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(modalLogin);
      });

    // ---------- 7) ЗАВЕРШЕНИЕ АВТОРИЗАЦИИ (КНОПКИ В МОДАЛКАХ) ----------
    const btnFinishLogin = document.querySelector(
      ".modal_con_rg_block_vh_vhod",
    );
    const btnFinishReg = document.querySelector(".modal_rg_rg");

    function handleAuthSuccess(e) {
      e.preventDefault();
      if (window.WRAuth?.login) WRAuth.login();
      closeAllModals();
      showProfile();
    }

    if (btnFinishLogin)
      btnFinishLogin.addEventListener("click", handleAuthSuccess);
    if (btnFinishReg) btnFinishReg.addEventListener("click", handleAuthSuccess);

    // ---------- 8) ПЕРЕКЛЮЧЕНИЕ МЕЖДУ МОДАЛКАМИ ----------
    const toLogin = document.querySelector(".modal_rg_vh"); // из рег -> вход
    const toReg = document.querySelector(".modal_con_rg_block_vh_vv"); // из вход -> рег

    if (toLogin) {
      toLogin.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(modalReg);
        openModal(modalLogin);
      });
    }

    if (toReg) {
      toReg.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(modalLogin);
        openModal(modalReg);
      });
    }

    // ---------- 9) КРЕСТИКИ ----------
    const closeReg = document.querySelector(".modal_block_h1");
    const closeLogin = document.querySelector(".modal_con_rg_block_conh1_x");

    if (closeReg)
      closeReg.addEventListener("click", () => closeModal(modalReg));
    if (closeLogin)
      closeLogin.addEventListener("click", () => closeModal(modalLogin));

    // ---------- 10) ГЛОБАЛЬНЫЙ КЛИК ----------
    document.addEventListener("click", (e) => {
      // закрыть меню профиля по клику вне
      if (profile && profileBlock && !profile.contains(e.target)) {
        profileBlock.style.display = "none";
      }

      // закрыть модалки по клику по фону
      if (modalReg && e.target === modalReg) closeModal(modalReg);
      if (modalLogin && e.target === modalLogin) closeModal(modalLogin);
    });

    // ---------- 11) (ОПЦИОНАЛЬНО) CREATE OFFER — ГОСТЮ ОТКРЫТЬ РЕГ ----------
    const btnCreateOffer = document.getElementById("create_offer");
    if (btnCreateOffer) {
      btnCreateOffer.addEventListener("click", () => {
        // НИЧЕГО НЕ ДЕЛАЕМ.
        // Главное: НЕ preventDefault() — тогда ссылка сама перейдёт по href
      });
    }
  });
})();
