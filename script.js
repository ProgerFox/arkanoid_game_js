import { Menu } from "./scripts/menu.js";
import { EndgameWindow } from "./scripts/endgame_window.js";
import { Game } from "./scripts/game.js";
import { SaveResultWindow } from "./scripts/save_result_window.js";

document.addEventListener('DOMContentLoaded', () => {
  Menu.initMenu();
  Game.initField();
  EndgameWindow.initEndGameWindow();
  SaveResultWindow.initSaveResultWindow();

  console.log('all components inited');
});