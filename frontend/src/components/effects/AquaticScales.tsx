import { useEffect, useRef } from "react";
import styles from "./AquaticScales.module.css";

interface Palette {
  scaleColors: string[];
  tendrilPrimary: string;
  tendrilSecondary: string;
  bubbleStroke: string;
  bubbleHighlight: string;
  scaleHighlight: string;
  bgInner: string;
  bgOuter: string;
}

const LIGHT_PALETTE: Palette = {
  scaleColors: ["#138c9e", "#15467c", "#63418e", "#217da7"],
  tendrilPrimary: "rgba(215, 90, 175, 0.7)",
  tendrilSecondary: "rgba(235, 140, 200, 0.6)",
  bubbleStroke: "rgba(200, 240, 255, 0.9)",
  bubbleHighlight: "#ffffff",
  scaleHighlight: "rgba(255, 255, 255, 0.25)",
  bgInner: "#134273",
  bgOuter: "#07172e",
};

const DARK_PALETTE: Palette = {
  scaleColors: ["#48009bff", "#191b8dff", "#8c086fff", "#261A64"],
  tendrilPrimary: "rgba(108, 47, 207, 0.75)",
  tendrilSecondary: "rgba(159, 120, 230, 0.55)",
  bubbleStroke: "rgba(210, 190, 255, 0.85)",
  bubbleHighlight: "#f4e8ff",
  scaleHighlight: "rgba(255, 255, 255, 0.18)",
  bgInner: "#261A64",
  bgOuter: "#0d0824",
};

interface Offset {
  x: number;
  y: number;
}

class ScaleElement {
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  vx = 0;
  vy = 0;
  type: "scale" | "tendril" | "bubble_pixel";
  scale: number;
  color: string | null;
  timeOffset: number;

  constructor(
    baseX: number,
    baseY: number,
    type: ScaleElement["type"],
    scale: number,
    offset: Offset,
    color: string | null = null
  ) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.currentX = baseX + offset.x;
    this.currentY = baseY + offset.y;
    this.type = type;
    this.scale = scale;
    this.color = color;
    this.timeOffset = Math.random() * 100;
  }

  draw(ctx: CanvasRenderingContext2D, time: number, palette: Palette) {
    ctx.save();
    ctx.translate(this.currentX, this.currentY);
    ctx.scale(this.scale, this.scale);

    if (this.type === "scale") {
      const p = 4;
      ctx.beginPath();
      ctx.moveTo(-3 * p, -4 * p);
      ctx.lineTo(3 * p, -4 * p);
      ctx.lineTo(3 * p, -3 * p);
      ctx.lineTo(4 * p, -3 * p);
      ctx.lineTo(4 * p, -2 * p);
      ctx.lineTo(5 * p, -2 * p);
      ctx.lineTo(5 * p, 1 * p);
      ctx.lineTo(4 * p, 1 * p);
      ctx.lineTo(4 * p, 2 * p);
      ctx.lineTo(3 * p, 2 * p);
      ctx.lineTo(3 * p, 3 * p);
      ctx.lineTo(2 * p, 3 * p);
      ctx.lineTo(2 * p, 4 * p);
      ctx.lineTo(1 * p, 4 * p);
      ctx.lineTo(1 * p, 5 * p);
      ctx.lineTo(-1 * p, 5 * p);
      ctx.lineTo(-1 * p, 4 * p);
      ctx.lineTo(-2 * p, 4 * p);
      ctx.lineTo(-2 * p, 3 * p);
      ctx.lineTo(-3 * p, 3 * p);
      ctx.lineTo(-3 * p, 2 * p);
      ctx.lineTo(-4 * p, 2 * p);
      ctx.lineTo(-4 * p, 1 * p);
      ctx.lineTo(-5 * p, 1 * p);
      ctx.lineTo(-5 * p, -2 * p);
      ctx.lineTo(-4 * p, -2 * p);
      ctx.lineTo(-4 * p, -3 * p);
      ctx.lineTo(-3 * p, -3 * p);
      ctx.lineTo(-3 * p, -4 * p);
      ctx.closePath();

      ctx.fillStyle = this.color ?? palette.scaleColors[0];
      ctx.fill();

      ctx.fillStyle = palette.scaleHighlight;
      ctx.fillRect(-3 * p, -3 * p, 4 * p, p);
      ctx.fillRect(-4 * p, -2 * p, p, 2 * p);
      ctx.fillRect(-2 * p, -2 * p, p, p);
    } else if (this.type === "tendril") {
      const blockSize = 4;
      ctx.fillStyle = palette.tendrilPrimary;
      for (let y = -80; y <= 80; y += blockSize) {
        const wave = Math.sin(time * 0.002 + this.timeOffset + y * 0.015) * 15;
        const blockX = Math.floor(wave / blockSize) * blockSize;
        ctx.fillRect(blockX, y, blockSize, blockSize);
      }
      ctx.fillStyle = palette.tendrilSecondary;
      for (let y = -75; y <= 85; y += blockSize) {
        const wave = Math.sin(time * 0.002 + this.timeOffset + y * 0.015) * 15;
        const blockX = Math.floor(wave / blockSize) * blockSize + 12;
        ctx.fillRect(blockX, y, blockSize, blockSize);
      }
    } else if (this.type === "bubble_pixel") {
      const s = 4;
      ctx.fillStyle = palette.bubbleStroke;
      ctx.fillRect(-1 * s, -3 * s, 2 * s, 1 * s);
      ctx.fillRect(-1 * s, 2 * s, 2 * s, 1 * s);
      ctx.fillRect(-3 * s, -1 * s, 1 * s, 2 * s);
      ctx.fillRect(2 * s, -1 * s, 1 * s, 2 * s);
      ctx.fillRect(-2 * s, -2 * s, 1 * s, 1 * s);
      ctx.fillRect(1 * s, -2 * s, 1 * s, 1 * s);
      ctx.fillRect(-2 * s, 1 * s, 1 * s, 1 * s);
      ctx.fillRect(1 * s, 1 * s, 1 * s, 1 * s);
      ctx.fillStyle = palette.bubbleHighlight;
      ctx.fillRect(-1 * s, -1 * s, 1 * s, 1 * s);
    }

    ctx.restore();
  }

  update(mouseX: number, mouseY: number) {
    const interactionRadius = 160;
    const pushForceMultiplier = 0.9;
    const springForceMultiplier = 0.08;
    const dampingMultiplier = 0.82;

    const dxMouse = this.currentX - mouseX;
    const dyMouse = this.currentY - mouseY;
    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

    if (distMouse < interactionRadius && distMouse > 0) {
      const force = (interactionRadius - distMouse) / interactionRadius;
      const pushFactor = force * pushForceMultiplier;
      this.vx += (dxMouse / distMouse) * pushFactor;
      this.vy += (dyMouse / distMouse) * pushFactor;
    }

    const dxBase = this.baseX - this.currentX;
    const dyBase = this.baseY - this.currentY;
    this.vx += dxBase * springForceMultiplier;
    this.vy += dyBase * springForceMultiplier;

    this.vx *= dampingMultiplier;
    this.vy *= dampingMultiplier;
    this.currentX += this.vx;
    this.currentY += this.vy;
  }
}

interface AquaticScalesProps {
  theme: "light" | "dark";
}

export function AquaticScales({ theme }: AquaticScalesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = theme === "dark" ? DARK_PALETTE : LIGHT_PALETTE;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let elements: ScaleElement[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let animationFrame = 0;
    let time = 0;

    function createElements() {
      elements = [];
      const cellW = 44;
      const cellH = 26;
      const cols = Math.ceil(width / cellW) + 2;
      const rows = Math.ceil(height / cellH) + 3;

      for (let r = -2; r < rows; r++) {
        for (let c = -2; c < cols; c++) {
          let baseX = c * cellW;
          if (r % 2 !== 0) baseX += cellW / 2;
          const baseY = r * cellH;
          const color =
            palette.scaleColors[Math.floor(Math.random() * palette.scaleColors.length)];
          const scale = 0.8 + Math.random() * 0.5;
          const offset = { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 };
          elements.push(new ScaleElement(baseX, baseY, "scale", scale, offset, color));
        }
      }

      for (let i = 0; i < width / 150; i++) {
        elements.push(
          new ScaleElement(
            Math.random() * width,
            Math.random() * height,
            "tendril",
            1 + Math.random() * 1.5,
            { x: 0, y: 0 }
          )
        );
      }

      for (let i = 0; i < width / 80; i++) {
        elements.push(
          new ScaleElement(
            Math.random() * width,
            Math.random() * height,
            "bubble_pixel",
            0.5 + Math.random() * 0.8,
            { x: 0, y: 0 }
          )
        );
      }
    }

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      createElements();
    }

    function drawBackground() {
      const gradient = ctx!.createRadialGradient(
        width / 2, height / 2, 100,
        width / 2, height / 2, width
      );
      gradient.addColorStop(0, palette.bgInner);
      gradient.addColorStop(1, palette.bgOuter);
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, width, height);
    }

    function renderFrame(time: number) {
      ctx!.imageSmoothingEnabled = false;
      ctx!.clearRect(0, 0, width, height);
      drawBackground();
      elements.forEach((el) => el.draw(ctx!, time, palette));
    }

    function animate() {
      time += 16;
      elements.forEach((el) => el.update(mouseX, mouseY));
      renderFrame(time);
      animationFrame = requestAnimationFrame(animate);
    }

    function handlePointerMove(e: PointerEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function handlePointerLeave() {
      mouseX = -1000;
      mouseY = -1000;
    }

    resize();

    if (prefersReducedMotion) {
      renderFrame(0);
    } else {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerleave", handlePointerLeave);
      animate();
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}