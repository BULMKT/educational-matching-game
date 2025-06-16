export class ExitButton {
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(x: number, y: number, width: number = 60, height: number = 30) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // Draw button background
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Exit', this.x + this.width/2, this.y + this.height/2);
        ctx.restore();
    }

    isClicked(x: number, y: number): boolean {
        return x >= this.x && 
               x <= this.x + this.width && 
               y >= this.y && 
               y <= this.y + this.height;
    }
}
