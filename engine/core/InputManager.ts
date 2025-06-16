export type Pointer = { x: number; y: number; isDown: boolean };

export class InputManager {
  public pointer: Pointer = { x: 0, y: 0, isDown: false };

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener('pointerdown', (e) => {
      this.pointer.isDown = true;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
    });
    canvas.addEventListener('pointerup', (e) => {
      this.pointer.isDown = false;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
    });
    canvas.addEventListener('pointermove', (e) => {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
    });
  }
}
