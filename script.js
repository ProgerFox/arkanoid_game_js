import { Menu } from "./scripts/menu.js";
import { GameField } from "./scripts/game.js";

document.addEventListener('DOMContentLoaded', () => {
  Menu.initMenu();
  GameField.game_init();

  console.log('all components inited');
});