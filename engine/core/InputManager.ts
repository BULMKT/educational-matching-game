export type Pointer = { x: number; y: number; isDown: boolean };

export class InputManager {
  public pointer: Pointer = { x: 0, y: 0, isDown: false };

  constructor(private canvas: HTMLCanvasElement) {
    canvas.addEventListener('pointerdown', (e) => {
      this.pointer.isDown = true;
      this.updatePointerPosition(e);
    });
    canvas.addEventListener('pointerup', (e) => {
      this.pointer.isDown = false;
      this.updatePointerPosition(e);
    });
    canvas.addEventListener('pointermove', (e) => {
      this.updatePointerPosition(e);
    });
    
    // Add touch events for better mobile support
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        this.pointer.isDown = true;
        this.updatePointerPositionFromTouch(e.touches[0]);
      }
    });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.pointer.isDown = false;
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        this.updatePointerPositionFromTouch(e.touches[0]);
      }
    });
  }

  private updatePointerPosition(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Convert screen coordinates to logical canvas coordinates
    const scaleX = this.canvas.width / dpr / rect.width;
    const scaleY = this.canvas.height / dpr / rect.height;
    
    this.pointer.x = (e.clientX - rect.left) * scaleX;
    this.pointer.y = (e.clientY - rect.top) * scaleY;
  }

  private updatePointerPositionFromTouch(touch: Touch) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Convert screen coordinates to logical canvas coordinates
    const scaleX = this.canvas.width / dpr / rect.width;
    const scaleY = this.canvas.height / dpr / rect.height;
    
    this.pointer.x = (touch.clientX - rect.left) * scaleX;
    this.pointer.y = (touch.clientY - rect.top) * scaleY;
  }
}
