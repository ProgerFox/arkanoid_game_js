import { Game } from "./game.js";
import { Menu } from "./menu.js";
import { SaveResultWindow } from "./save_result_window.js";

export const EndgameWindow = {
  endgame_popup: document.getElementById("endgame_window"),
  endgame_score_counter: document.getElementById("endgame_score_counter"),
  endgame_menu_btn: document.getElementById("endgame_menu_btn"),
  endgame_save_btn: document.getElementById("endgame_save_btn"),
  ShowWindow: false,

  ToggleVisibility() {
    this.ShowWindow = !this.ShowWindow;
    this.endgame_popup.style.display = this.ShowWindow ? "flex": "none";
  },

  showResults() {
    this.ToggleVisibility();
    this.endgame_score_counter.innerHTML = Game.score;
  },

  initEndGameWindow() {
    this.endgame_popup.style.display = "none";

    this.endgame_menu_btn.addEventListener("click", () => {
      Menu.ToggleMenuVisibility();
      this.ToggleVisibility();
    });

    this.endgame_save_btn.addEventListener("click", () => {
      this.ToggleVisibility();
      SaveResultWindow.ToggleVisibility();
    });
  },
}