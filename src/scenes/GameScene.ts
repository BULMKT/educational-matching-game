import { Scene } from '../../engine/scenes/Scene';

export class GameScene extends Scene {
    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
        // Add event listener for escape key
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    update(delta: number): void {
        // Update game logic
    }

    render(): void {
        // Draw game elements only, no UI
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            // We'll need to implement scene changing through a game manager
            document.dispatchEvent(new CustomEvent('changeScene', { detail: { scene: 'home' } }));
        }
    }

    // Clean up event listener when scene changes
    onExit() {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
}