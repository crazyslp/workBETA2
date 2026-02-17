/*
  WorkRock DEV Auth (без сервера)
  Храним флаг авторизации в localStorage: wr_auth = "1" (юзер) или "0"/null (гость)
*/
(function () {
  const KEY = "wr_auth";

  function isAuth() {
    return localStorage.getItem(KEY) === "1";
  }

  function login() {
    localStorage.setItem(KEY, "1");
  }

  function logout() {
    localStorage.setItem(KEY, "0");
  }

  // чтобы было удобно дергать из любых скриптов
  window.WRAuth = { isAuth, login, logout };
})();
