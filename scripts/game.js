import { EndgameWindow } from "./endgame_window.js";
import { Menu } from "./menu.js";

export const Game = {
  // canvas settings
  canvas: null,
  ctx: null,

  // game sittings
  game_loop: null,
  game_state: "inactive", // inactive, active, paused

  // inner settings
  score_counter: document.getElementById("score_counter"),
  score: 0,

  platform: {
    width: 160,
    height: 15,
    x: 0,
    y: 0,
    speed: 6,
    dx: 0,
  },

  ball: {
    x: 0,
    y: 0,
    radius: 10,
    speed: 5,
    acceleration: 1,
    dx: 3,
    dy: -3,
    color: "#ff0000",
  },

  bricks: {
    rows: 5,
    cols: 9,
    width: 70,
    height: 20,
    padding: 10,
    offsetTop: 60,
    offsetLeft: 35,
    colors: ["#ff2c3b", "#ff5722", "#ff9800", "#ffeb3b", "#4caf50", "#2196f3"],
    array: [],
    remains: 0,
  },

  // setup

  initCanvas() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;

    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";
  },

  drawBackground() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  // platform

  drawPlatform() {
    const x = Math.round(this.platform.x);
    const y = Math.round(this.platform.y);

    this.ctx.beginPath();
    this.ctx.rect(x, y, this.platform.width, this.platform.height);
    this.ctx.fillStyle = "#ff2c3b";
    this.ctx.fill();

    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
  },

  initPlatform() {
    this.platform.x = Math.round(
      this.canvas.width / (window.devicePixelRatio || 1) / 2 - 80
    );
    this.platform.y = Math.round(
      this.canvas.height / (window.devicePixelRatio || 1) - 80
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
        this.platform.dx = this.platform.speed;
      } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        this.platform.dx = -this.platform.speed;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (
        e.key === "Right" ||
        e.key === "ArrowRight" ||
        e.key === "Left" ||
        e.key === "ArrowLeft" ||
        e.key === "a" ||
        e.key === "d"
      ) {
        this.platform.dx = 0;
      }
    });
  },

  updatePlatformPosition() {
    const platform_new_x = this.platform.x + this.platform.dx;
    if (
      platform_new_x >= 0 &&
      platform_new_x + this.platform.width <=
        this.canvas.width / (window.devicePixelRatio || 1)
    ) {
      this.platform.x = platform_new_x;
    }
  },

  // ball

  drawBall() {
    this.ctx.beginPath();

    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);

    this.ctx.fillStyle = this.ball.color;
    this.ctx.fill();

    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.closePath();
  },

  initBall() {
    this.ball.x = this.platform.x + this.platform.width / 2;
    this.ball.y = this.platform.y - this.ball.radius - 5;
    this.ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
    this.ball.dy = -3;
    this.ball.acceleration = 1;
  },

  updateBallPosition() {
    this.ball.x += this.ball.dx * this.ball.acceleration;
    this.ball.y += this.ball.dy * this.ball.acceleration;

    this.checkWallCollision();
    this.checkPlatformCollision();
  },

  checkWallCollision() {
    if (
      this.ball.x - this.ball.radius < 0 ||
      this.ball.x + this.ball.radius >
        this.canvas.width / (window.devicePixelRatio || 1)
    ) {
      this.ball.dx = -this.ball.dx;
    }

    if (this.ball.y - this.ball.radius < 0) {
      this.ball.dy = -this.ball.dy;
    }

    if (
      this.ball.y + this.ball.radius >
      this.canvas.height / (window.devicePixelRatio || 1)
    ) {
      this.gameEnd();
    }
  },

  checkPlatformCollision() {
    if (
      this.ball.y + this.ball.radius > this.platform.y &&
      this.ball.y - this.ball.radius < this.platform.y + this.platform.height &&
      this.ball.x > this.platform.x &&
      this.ball.x < this.platform.x + this.platform.width
    ) {
      this.ball.dy = -this.ball.dy;

      const hitPosition =
        (this.ball.x - (this.platform.x + this.platform.width / 2)) /
        (this.platform.width / 2);
      this.ball.dx = hitPosition * this.ball.speed;
      this.ball.acceleration += 0.2;
    }
  },

  // bricks

  initBricks() {
    this.bricks.array = [];
    for (let cols = 0; cols < this.bricks.cols; cols++) {
      for (let rows = 0; rows < this.bricks.rows; rows++) {
        if (Math.random() < 0.4) {
          const brick = {
            x:
              cols * (this.bricks.width + this.bricks.padding) +
              this.bricks.offsetLeft,
            y:
              rows * (this.bricks.height + this.bricks.padding) +
              this.bricks.offsetTop,
            width: this.bricks.width,
            height: this.bricks.height,
            color:
              this.bricks.colors[
                Math.floor(Math.random() * this.bricks.colors.length)
              ],
            visible: true,
          };
          this.bricks.array.push(brick);
        }
      }
    }
    this.bricks.remains = this.bricks.array.length;
  },

  drawBricks() {
    this.bricks.array.forEach((brick) => {
      if (brick.visible) {
        this.ctx.beginPath();
        this.ctx.rect(brick.x, brick.y, brick.width, brick.height);

        const gradient = this.ctx.createLinearGradient(
          brick.x,
          brick.y,
          brick.x,
          brick.y + brick.height
        );

        gradient.addColorStop(0, brick.color);

        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  },

  checkBrickCollision() {
    this.bricks.array.forEach((brick) => {
      if (brick.visible) {
        if (
          this.ball.x + this.ball.radius > brick.x &&
          this.ball.x - this.ball.radius < brick.x + brick.width &&
          this.ball.y + this.ball.radius > brick.y &&
          this.ball.y - this.ball.radius < brick.y + brick.height
        ) {
          this.ball.dy = -this.ball.dy;
          brick.visible = false;
          this.score += 10;
          this.score_counter.innerHTML = this.score;

          this.bricks.remains -= 1;
        }
      }
    });
  },

  // game_loop

  initGameLoop() {
    const gameFrame = () => {
      this.drawBackground();

      this.updatePlatformPosition();
      this.updateBallPosition();
      this.checkBrickCollision();

      this.drawPlatform();
      this.drawBall();
      this.drawBricks();

      if (this.bricks.remains === 0) {
        this.initBricks();
      }

      if (this.game_state === "active") {
        this.game_loop = requestAnimationFrame(gameFrame);
      }
    };

    this.game_loop = requestAnimationFrame(gameFrame);
  },

  //

  initField() {
    this.initCanvas();
    this.initPlatform();
    this.initBall();
    this.initBricks();
  },

  gameRestart() {
    this.game_state = "active";
    this.score = 0;
    this.score_counter.innerHTML = this.score;
    this.initField();
    this.initGameLoop();
  },

  gamePause() {
    if (this.game_state === "active") {
      this.game_state = "paused";
      cancelAnimationFrame(this.game_loop);
    } else if (this.game_state === "paused") {
      this.game_state = "active";
      this.initGameLoop();
    }
  },

  gameEnd() {
    if (this.game_state == "active") {
      this.game_state = "inactive";
      cancelAnimationFrame(this.game_loop);
      this.game_loop = null;

      setTimeout(() => {
        Menu.ResetMenuBtns();
        EndgameWindow.showResults();
      }, 100);
    }
  },
};
