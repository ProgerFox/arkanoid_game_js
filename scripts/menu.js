import { Game } from "./game.js";

export const Menu = {
  open_menu_btn: document.getElementById("open_menu_btn"),
  menu_popup: document.getElementById("menu"),
  close_menu_btn: document.getElementById("menu_close_btn"),
  menu_about_btn: document.getElementById("menu_about_btn"),
  menu_play_btn: document.getElementById("menu_play_btn"),
  menu_stop_btn: document.getElementById("menu_stop_btn"),
  menu_results_btn: document.getElementById("menu_results_btn"),
  ShowMenu: true,

  ToggleVisibility() {
    this.ShowMenu = !this.ShowMenu;
    this.menu_popup.style.display = this.ShowMenu ? "flex" : "none";
  },

  ResetMenuBtns() {
    this.menu_play_btn.style.display = "inline";
    this.menu_stop_btn.style.display = "none";
  },

  initMenu() {
    // menu setup
    this.open_menu_btn.addEventListener("click", () => {
      this.ToggleVisibility();
    });

    this.close_menu_btn.addEventListener("click", () => {
      this.ToggleVisibility();
    });

    this.menu_popup.addEventListener("click", (e) => {
      if (e.target === this.menu_popup) {
        this.ToggleVisibility();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.ToggleVisibility();

        if (Game.game_state === "active") {
          Game.gamePause();
          this.menu_stop_btn.style.display = "none";
          this.menu_play_btn.style.display = "inline";
        }
      }
    });

    // menu actions
    this.menu_about_btn.addEventListener("click", () => {
      this.ToggleVisibility();
      // window.open("https://en.wikipedia.org/wiki/Arkanoid");
    });

    this.menu_play_btn.addEventListener("click", () => {
      this.menu_play_btn.style.display = "none";
      this.menu_stop_btn.style.display = "inline";
      this.ToggleVisibility();
      if (Game.game_state === "inactive") {
        Game.gameRestart();
      } else if (Game.game_state === "paused") {
        Game.gamePause();
      }
    });

    this.menu_stop_btn.addEventListener("click", () => {
      Game.gamePause();
      this.menu_stop_btn.style.display = "none";
      this.menu_play_btn.style.display = "inline";
      this.ToggleVisibility();
    });

    this.menu_results_btn.addEventListener("click", () => {
      this.ToggleVisibility();

      //TODO: show leaderboard
    });

    this.menu_popup.style.display = "flex";
  },
};
