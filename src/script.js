import { requestAnimationFrame } from "window";
import { sqrt, pow, atan2, cos, sin, PI, random } from "math";

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const tent = [];
  const numt = 500;
  let target = { x: 0, y: 0 };
  let last_target = {};
  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    t += 0.01;

    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, 2 * PI);
    ctx.fillStyle = "hsl(210,100%,80%)";
    ctx.fill();

    for (let i = 0; i < numt; i++) {
      tent[i].move(last_target, target);
      tent[i].show2(target);
    }
    for (let i = 0; i < numt; i++) {
      tent[i].show(target);
    }
    last_target.x = target.x;
    last_target.y = target.y;

    requestAnimationFrame(draw);
  }

  function init() {
    for (let i = 0; i < numt; i++) {
      tent.push(
        new Tentacle(
          random() * width,
          random() * height,
          random() * 250 + 50,
          30,
          random() * 2 * PI
        )
      );
    }

    canvas.addEventListener("mousemove", function (e) {
      target = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mouseleave", function (e) {
      target = { x: width / 2, y: height / 2 };
    });

    draw();
  }

  class Tentacle {
    constructor(x, y, l, n, a) {
      this.x = x;
      this.y = y;
      this.l = l;
      this.n = n;
      this.segments = [];
      for (let i = 0; i < n; i++) {
        this.segments.push(new Segment(x, y, l / n, a));
      }
    }
    move(last_target, target) {
      for (let i = this.n - 1; i >= 0; i--) {
        if (i === this.n - 1) {
          this.segments[i].update(target);
        } else {
          this.segments[i].update(this.segments[i + 1].pos);
        }
      }

      if (dist(this.x, this.y, target.x, target.y) <= this.l + 10) {
        this.segments[0].fallback({ x: this.x, y: this.y });
        for (let i = 1; i < this.n; i++) {
          this.segments[i].fallback(this.segments[i - 1].nextPos);
        }
      }
    }
    show(target) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      for (let i = 0; i < this.n; i++) {
        this.segments[i].show();
      }
      ctx.strokeStyle = "hsl(" + random() * 360 + ",100%,50%)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    show2(target) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, 2 * PI);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  class Segment {
    constructor(x, y, l, a) {
      this.pos = { x: x, y: y };
      this.l = l;
      this.ang = a;
      this.nextPos = {
        x: this.pos.x + this.l * cos(this.ang),
        y: this.pos.y + this.l * sin(this.ang),
      };
    }
    update(t) {
      this.ang = atan2(t.y - this.pos.y, t.x - this.pos.x);
      this.pos.x = t.x + this.l * cos(this.ang - PI);
      this.pos.y = t.y + this.l * sin(this.ang - PI);
      this.nextPos.x = this.pos.x + this.l * cos(this.ang);
      this.nextPos.y = this.pos.y + this.l * sin(this.ang);
    }
    fallback(t) {
      this.pos.x = t.x;
      this.pos.y = t.y;
      this.nextPos.x = this.pos.x + this.l * cos(this.ang);
      this.nextPos.y = this.pos.y + this.l * sin(this.ang);
    }
    show() {
      ctx.lineTo(this.nextPos.x, this.nextPos.y);
    }
  }

  function dist(p1x, p1y, p2x, p2y) {
    return sqrt(pow(p2x - p1x, 2) + pow(p2y - p1y, 2));
  }

  init();
});
