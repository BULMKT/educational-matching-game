import { InputManager } from '../core/InputManager';
import { Loader } from '../utils/loader';
import { Scene } from '../scenes/Scene';
import { MatchingGame } from '../scenes/MatchingGame';

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastTime = 0;
  private input: InputManager;
  private scene: Scene;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.input = new InputManager(canvas);
    window.addEventListener('resize', () => this.resize());
    this.resize();

    const data = Loader.loadGameData();
    // Choose scene based on template
    switch (data.template) {
      case 'matching':
        this.scene = new MatchingGame(this.ctx, this.input, data);
        break;
      default:
        throw new Error('Unknown template: ' + data.template);
    }
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(timestamp: number) {
    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.scene.update(delta);
    this.scene.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
