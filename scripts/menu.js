export function initMenu() {
  const open_menu_btn = document.getElementById("open_menu_btn");
  const menu_popup = document.getElementById("menu");
  const close_menu_btn = document.querySelector(".close-btn");
  const menu_about_btn =  document.getElementById("menu_about_btn");
  const menu_play_btn =  document.getElementById("menu_play_btn");
  const menu_results_btn =  document.getElementById("menu_results_btn");

  // menu setup
  open_menu_btn.addEventListener("click", () => {
    menu_popup.style.display = "flex";
  });

  close_menu_btn.addEventListener("click", () => {
    menu_popup.style.display = "none";
  });

  menu_popup.addEventListener("click", (e) => {
    if (e.target === menu_popup) {
      menu_popup.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu_popup.style.display = "none";
    }
  });

  // menu actions
  menu_about_btn.addEventListener("click", () => {
    menu_popup.style.display = "none";
    window.location.replace("https://en.wikipedia.org/wiki/Arkanoid");
  });

  menu_play_btn.addEventListener("click", () => {
    // start the game
    menu_popup.style.display = "none";
  });

  menu_results_btn.addEventListener("click", () => {
    menu_popup.style.display = "none";
  });
}
