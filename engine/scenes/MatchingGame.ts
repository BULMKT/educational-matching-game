import { Scene } from './Scene';
import { Draggable } from '../components/Draggable';
import { InputManager } from '../core/InputManager';
import { Loader } from '../utils/loader';
import { AudioManager } from '../utils/AudioManager';

type Pair = { left: string; right: string };

function drawRoundedCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  bgColor: string,
  borderColor: string,
  shadow: boolean,
  text: string,
  textColor: string
) {
  ctx.save();
  if (shadow) {
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2);
  ctx.restore();
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  alpha: number;
  vy: number;
  time: number;
}

export class MatchingGame extends Scene {
  private leftItems: Draggable[] = [];
  private rightItems: Draggable[] = [];
  private pairs: Pair[] = [];
  private draggingLeft: Draggable | null = null;
  private theme: string = "default";
  private bgColor: string = "#282c34";
  private winShown = false;
  private lastFpsTime = 0;
  private fps = 0;
  private audio: AudioManager;
  private floatingTexts: FloatingText[] = [];
  private winPending = false;
  private winMessageShown = false;

  constructor(
    ctx: CanvasRenderingContext2D,
    private input: InputManager,
    data?: { items: Pair[], theme?: string }
  ) {
    super(ctx);

    const gameData = data ?? Loader.loadGameData();
    this.pairs = gameData.items;
    this.theme = gameData.theme || "default";
    this.audio = new AudioManager();

    // Theme system (expand as needed)
    if (this.theme === "jungle") this.bgColor = "#228B22";
    else if (this.theme === "desert") this.bgColor = "#EDC9Af";
    else this.bgColor = "#282c34";

    // Responsive layout
    this.layoutItems();
    window.addEventListener('resize', () => this.layoutItems());

    // Unlock audio on first user interaction (for iOS)
    const unlock = () => {
      this.audio.unlockAll();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
  }

  private layoutItems() {
    this.leftItems = [];
    this.rightItems = [];
    const { width, height } = this.ctx.canvas;
    const n = this.pairs.length;
    const cardW = Math.max(120, Math.min(200, width * 0.25));
    const cardH = 60;
    const gapY = Math.max(30, (height - n * cardH) / (n + 1));
    const leftX = width * 0.18;
    const rightX = width * 0.62;
    for (let i = 0; i < n; ++i) {
      const y = gapY + i * (cardH + gapY);
      this.leftItems.push(new Draggable(this.pairs[i].left, leftX, y, this.input.pointer));
      this.rightItems.push(new Draggable(this.pairs[i].right, rightX, y, this.input.pointer));
    }
  }

  update(delta: number) {
    // Only allow dragging unmatched left cards
    for (const left of this.leftItems) {
      if (!left['matched']) {
        left.update(delta);
        if (left['isDragging']) {
          this.draggingLeft = left;
        }
      }
    }
    this.rightItems.forEach((item) => item.update(0));

    // On drop, check for match
    if (this.draggingLeft && !this.input.pointer.isDown && this.draggingLeft['isDragging'] === false) {
      const leftIdx = this.leftItems.indexOf(this.draggingLeft);
      const right = this.rightItems[leftIdx];
      if (!right['matched'] && this.isOverlapping(this.draggingLeft, right)) {
        this.handleMatch(this.draggingLeft, right);
      }
      this.draggingLeft = null;
    }

    // Win detection
    if (!this.winShown && this.leftItems.every((item) => item['matched'])) {
      this.winShown = true;
      this.winPending = true;
      // Wait for any current sound to finish, then play 'correct' and show win
      const currentAudio = (this.audio as any).current as HTMLAudioElement | null;
      if (this.audio.isPlaying() && currentAudio) {
        currentAudio.addEventListener('ended', this.handleWinAudio, { once: true });
      } else {
        this.handleWinAudio();
      }
    }

    // Update floating texts
    this.floatingTexts = this.floatingTexts.filter(ft => {
      ft.y -= ft.vy;
      ft.alpha -= 0.02;
      ft.time += delta;
      return ft.alpha > 0 && ft.time < 1000;
    });
  }

  private handleWinAudio = () => {
    this.audio.play('correct', () => {
      this.winMessageShown = true;
    });
    // If the audio fails to play, show win message after 1s fallback
    setTimeout(() => {
      if (!this.winMessageShown) this.winMessageShown = true;
    }, 200);
  }

  handleMatch(left: Draggable, right: Draggable) {
    // Snap left onto right
    left.x = right.x;
    left.y = right.y;
    left.setMatched();
    right.setMatched();
    // Play sound based on label
    const label = left.getLabel().toLowerCase();
    if (label.includes('dog')) this.audio.play('dog');
    else if (label.includes('cat')) this.audio.play('cat');
    // No fallback sound here; only play win/correct on win
    // Floating text
    this.floatingTexts.push({
      x: left.x + 60,
      y: left.y - 10,
      text: 'Matched!',
      alpha: 1,
      vy: 0.5,
      time: 0
    });
  }

  render() {
    // Set background
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Draw left column cards
    this.leftItems.forEach((item) => {
      drawRoundedCard(
        this.ctx,
        item.x, item.y, 120, 40, 12,
        item['matched'] ? '#a0f0a0' : '#f0f0f0',
        '#0074D9',
        true,
        item['label'],
        '#111111'
      );
    });
    // Draw right column cards
    this.rightItems.forEach((item) => {
      drawRoundedCard(
        this.ctx,
        item.x, item.y, 120, 40, 12,
        item['matched'] ? '#a0f0a0' : '#f0f0f0',
        '#FF4136',
        true,
        item['label'],
        '#111111'
      );
    });

    // Floating "Matched!" text
    this.floatingTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.globalAlpha = ft.alpha;
      this.ctx.font = 'bold 24px sans-serif';
      this.ctx.fillStyle = '#4caf50';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });

    // Show win message
    if (this.winMessageShown) {
      this.ctx.save();
      this.ctx.fillStyle = 'green';
      this.ctx.font = 'bold 56px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = '#4caf50';
      this.ctx.shadowBlur = 24;
      this.ctx.fillText('You Win!', this.ctx.canvas.width / 2, 80);
      this.ctx.restore();
    }

    // Debug overlay (FPS, draggable count)
    this.drawDebugOverlay();
  }

  private drawDebugOverlay() {
    // FPS calculation
    const now = performance.now();
    if (now - this.lastFpsTime > 500) {
      this.fps = Math.round(1000 / (now - this.lastFpsTime));
      this.lastFpsTime = now;
    }
    this.ctx.save();
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(10, 10, 120, 40);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`FPS: ${this.fps}`, 18, 28);
    this.ctx.fillText(`Draggables: ${this.leftItems.filter(i=>!i['matched']).length}`, 18, 44);
    this.ctx.restore();
  }

  private isOverlapping(a: Draggable, b: Draggable): boolean {
    return (
      a.x < b.x + 120 &&
      a.x + 120 > b.x &&
      a.y < b.y + 40 &&
      a.y + 40 > b.y
    );
  }
}
