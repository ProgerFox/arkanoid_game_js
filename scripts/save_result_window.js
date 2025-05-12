import { Game } from "./game.js";

export const SaveResultWindow = {
  save_results_window: document.getElementById("save_results_window"),
  save_results_window_close_btn: document.getElementById("save_results_window_close_btn"),
  save_results_window_save_btn: document.getElementById("save_results_window_save_btn"),
  player_name_input: document.getElementById("player_name_input"),

  ShowWindow: false,

  ToggleVisibility() {
    this.ShowWindow = !this.ShowWindow;
    this.save_results_window.style.display = this.ShowWindow ? "flex": "none";
  },

  async SaveData(data) {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {},
        body: {
          "name": "test 1",
          "score": 10
        }
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  },

  init() {
    this.save_results_window_close_btn.addEventListener("click", () => {
      this.ToggleVisibility();
    });

    this.save_results_window_save_btn.addEventListener("click", () => {
      const data = {
        name : this.player_name_input.value,
        score: Game.score,
      }
      // this.SaveData(data);
    });
  },
}