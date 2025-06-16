export class BackButton {
    private x: number;
    private y: number;
    private size: number;

    constructor(x: number, y: number, size: number = 40) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw arrow
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y);
        ctx.lineTo(this.x - 10, this.y);
        ctx.lineTo(this.x - 5, this.y - 5);
        ctx.moveTo(this.x - 10, this.y);
        ctx.lineTo(this.x - 5, this.y + 5);
        ctx.stroke();
        ctx.restore();
    }

    isClicked(x: number, y: number): boolean {
        const distance = Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        );
        return distance <= this.size/2;
    }
}
