import { Menu } from "./scripts/menu.js";
import { EndgameWindow } from "./scripts/endgame_window.js";
import { Game } from "./scripts/game.js";
import { SaveResultWindow } from "./scripts/save_result_window.js";
import { AboutWindow } from "./scripts/about_window.js";

document.addEventListener('DOMContentLoaded', () => {
  Menu.init();
  Game.init();
  EndgameWindow.init();
  SaveResultWindow.init();
  AboutWindow.init();

  console.log('all components inited');
});