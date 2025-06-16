export abstract class Scene {
  constructor(protected ctx: CanvasRenderingContext2D) {}
  abstract update(delta: number): void;
  abstract render(): void;
}
