import { Pointer } from '../core/InputManager';

export class Draggable {
  private width = 120;
  private height = 40;
  private isDragging = false;
  private matched = false;
  private offsetX = 0;
  private offsetY = 0;

  constructor(
    private label: string,
    public x: number,
    public y: number,
    private pointer: Pointer
  ) {}

  update(delta: number) {
    if (this.matched) return;
    const { x, y, isDown } = this.pointer;
    // Start drag
    if (isDown && !this.isDragging) {
      if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
        this.isDragging = true;
        this.offsetX = x - this.x;
        this.offsetY = y - this.y;
      }
    }
    // Dragging
    if (this.isDragging && isDown) {
      this.x = x - this.offsetX;
      this.y = y - this.offsetY;
    }
    // End drag
    if (this.isDragging && !isDown) {
      this.isDragging = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Visual feedback for matched state
    if (this.matched) {
      ctx.save();
      ctx.shadowColor = '#4caf50';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#a0f0a0';
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 4;
    } else {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.font = '16px sans-serif';
    ctx.fillText(this.label, this.x + 10, this.y + 25);
    ctx.restore();
  }

  isMatchedWith(other: Draggable): boolean {
    // Only allow matching if both are not already matched
    if (this.matched || other.matched) return false;
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.hypot(dx, dy) < 10 && this.label !== other.label;
  }

  setMatched() {
    this.matched = true;
  }

  get isLocked() {
    return this.matched;
  }

  getLabel() {
    return this.label;
  }
}
