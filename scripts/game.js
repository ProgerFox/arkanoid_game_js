import { Menu } from "./menu.js";

export const GameField = {
  canvas: null,
  ctx: null,
  game_loop: null,
  gameIsActive: false,
  score_counter: document.getElementById('score_counter'),
  score: 0,

  platform: {
    width: 160,
    height: 15,
    x: 0,
    y: 0,
    speed: 8,
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
    this.ctx.lineWidth = 1;
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
      if (e.key === "Right" || e.key === "ArrowRight") {
        this.platform.dx = this.platform.speed;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        this.platform.dx = -this.platform.speed;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (
        e.key === "Right" ||
        e.key === "ArrowRight" ||
        e.key === "Left" ||
        e.key === "ArrowLeft"
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
      this.game_stop();
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
      this.ball.acceleration += 0.1;
    }
  },

  // bricks

  initBricks() {
    this.bricks.array = [];
    for (let cols = 0; cols < this.bricks.cols; cols++) {
      for (let rows = 0; rows < this.bricks.rows; rows++) {
        if (Math.random() < 0.7) {
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
          this.score_counter.innerHTML = `Score: ${this.score}`;
        }
      }
    });
  },

  // game_loop

  init_game_loop() {
    const gameFrame = () => {
      this.drawBackground();

      this.updatePlatformPosition();
      this.updateBallPosition();
      this.checkBrickCollision();

      this.drawPlatform();
      this.drawBall();
      this.drawBricks();

      if (this.gameIsActive) {
        this.game_loop = requestAnimationFrame(gameFrame);
      }
    };

    this.game_loop = requestAnimationFrame(gameFrame);
  },

  //

  game_init() {
    this.initCanvas();
    this.initPlatform();
    this.initBall();
    this.initBricks();
  },

  game_start() {
    if (!this.game_loop) {

      this.score = 0;
      this.score_counter.innerHTML = `Score: ${this.score}`;

      this.initPlatform();
      this.initBall();
      this.initBricks();

      this.gameIsActive = true;
      this.init_game_loop();
    }
  },

  game_stop() {
    if (this.game_loop) {
      cancelAnimationFrame(this.game_loop);
      this.gameIsActive = false;
      this.game_loop = null;

      Menu.ToggleMenuVisibility();
      Menu.ResetMenuBtns();
    }
  },
};
