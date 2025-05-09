import { initMenu } from "./scripts/menu.js";

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  console.log('all components loaded');
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
ctx.fillRect(0, 0, canvas.width, canvas.height);

