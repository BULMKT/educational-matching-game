import { Scene } from './Scene';
import { InputManager } from '../core/InputManager';
import { Loader } from '../utils/loader';
import { AudioManager } from '../utils/AudioManager';

type Pair = { left: string; right: string };

interface Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  isMatched: boolean;
  isHovered: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  index: number;
  side: 'left' | 'right';
  scale: number;
  targetScale: number;
  originalX: number;
  originalY: number;
  // Subtle animation properties
  hoverStartTime?: number;
  dropTargetStartTime?: number;
}

// Modern tile drawing function for child-friendly UI
function drawTile(ctx: CanvasRenderingContext2D, tile: Tile) {
  ctx.save();
  
  // Calculate subtle animation effects
  const currentTime = Date.now();
  let extraScale = 1;
  let glowIntensity = 0;
  
  // Subtle pulsing for drop targets
  if (tile.isDropTarget && tile.dropTargetStartTime) {
    const elapsed = (currentTime - tile.dropTargetStartTime) * 0.003;
    const pulse = Math.sin(elapsed) * 0.02 + 1; // Very subtle pulse
    extraScale *= pulse;
    glowIntensity = Math.sin(elapsed * 2) * 0.3 + 0.7; // Gentle glow variation
  }
  
  // Apply scaling transform for animations
  const centerX = tile.x + tile.width / 2;
  const centerY = tile.y + tile.height / 2;
  ctx.translate(centerX, centerY);
  ctx.scale(tile.scale * extraScale, tile.scale * extraScale);
  ctx.translate(-centerX, -centerY);
  
  // Draw shadow (more prominent when dragging)
  if (!tile.isDragging) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
    ctx.shadowBlur = tile.isHovered ? 12 : 6;
    ctx.shadowOffsetX = tile.isHovered ? 4 : 2;
    ctx.shadowOffsetY = tile.isHovered ? 4 : 2;
  } else {
    // Bigger shadow when dragging
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;
  }
  
  // Choose background color based on state
  let bgColor = "#ffffff";
  let borderColor = "#d5a1e6";
  let borderWidth = 3;
  
  if (tile.isMatched) {
    bgColor = "#e8f5e8";
    borderColor = "#4caf50";
    borderWidth = 4;
  } else if (tile.isDropTarget) {
    bgColor = "#fff8e1";
    borderColor = "#ff9800";
    borderWidth = 5;
  } else if (tile.isDragging) {
    bgColor = "#f0f9ff";
    borderColor = "#3b82f6";
    borderWidth = 4;
  } else if (tile.isHovered) {
    borderColor = "#8b5cf6";
    borderWidth = 4;
  }
  
  // Draw background with rounded corners
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  
  ctx.beginPath();
  roundRect(ctx, tile.x, tile.y, tile.width, tile.height, 16);
  ctx.fill();
  ctx.stroke();
  
  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Add subtle glow effect for drop targets
  if (tile.isDropTarget && glowIntensity > 0) {
    ctx.strokeStyle = "#ffa500";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 3]);
    ctx.globalAlpha = glowIntensity * 0.6; // Subtle glow
    ctx.beginPath();
    roundRect(ctx, tile.x - 3, tile.y - 3, tile.width + 6, tile.height + 6, 19);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  
  // Add very gentle glow effect if hovered
  if (tile.isHovered && !tile.isDragging) {
    ctx.strokeStyle = "#ffa500";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4; // More subtle than before
    ctx.beginPath();
    roundRect(ctx, tile.x - 2, tile.y - 2, tile.width + 4, tile.height + 4, 18);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  
  // Draw content (text/emoji) - larger and more prominent
  ctx.fillStyle = tile.isMatched ? "#2e7d32" : "#1a1a1a";
  ctx.font = `bold ${Math.min(36, tile.width * 0.3)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tile.content, centerX, centerY);
  
  // Add play button for right-side tiles (sounds)
  if (tile.side === 'right' && !tile.isMatched) {
    const buttonSize = 24;
    const buttonX = tile.x + tile.width - buttonSize - 8;
    const buttonY = tile.y + 8;
    
    // Play button background
    ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
    ctx.beginPath();
    ctx.arc(buttonX + buttonSize/2, buttonY + buttonSize/2, buttonSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Play icon (triangle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const centerButtonX = buttonX + buttonSize/2;
    const centerButtonY = buttonY + buttonSize/2;
    ctx.moveTo(centerButtonX - 4, centerButtonY - 6);
    ctx.lineTo(centerButtonX - 4, centerButtonY + 6);
    ctx.lineTo(centerButtonX + 6, centerButtonY);
    ctx.closePath();
    ctx.fill();
  }
  
  // Add sparkles for matched tiles
  if (tile.isMatched) {
    const sparkles = [
      { x: tile.x + tile.width * 0.15, y: tile.y + tile.height * 0.2, size: 4 },
      { x: tile.x + tile.width * 0.85, y: tile.y + tile.height * 0.3, size: 3 },
      { x: tile.x + tile.width * 0.3, y: tile.y + tile.height * 0.8, size: 3.5 },
      { x: tile.x + tile.width * 0.7, y: tile.y + tile.height * 0.7, size: 3 }
    ];
    
    ctx.fillStyle = '#ffd700';
    sparkles.forEach(sparkle => {
      ctx.beginPath();
      ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  ctx.restore();
}

// Helper function for rounded rectangles
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  alpha: number;
  vy: number;
  time: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class MatchingGame extends Scene {
  private leftTiles: Tile[] = [];
  private rightTiles: Tile[] = [];
  private pairs: Pair[] = [];
  private draggedTile: Tile | null = null;
  private hoveredTile: Tile | null = null;
  private theme: string = "default";
  private winShown = false;
  private audio: AudioManager;
  private floatingTexts: FloatingText[] = [];
  private particles: Particle[] = [];
  private winMessageShown = false;
  private backgroundPattern: string = "";
  private mouseX = 0;
  private mouseY = 0;
  private dragOffset = { x: 0, y: 0 };
  // Sound cooldown tracking
  private lastHoverSoundTime = 0;
  private lastDropTargetSoundTime = 0;
  private hoverSoundCooldown = 300; // 300ms cooldown
  private lastHoveredTileId: string | null = null;
  private lastDropTargetTileId: string | null = null;

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

    // Enhanced theme system with modern patterns
    if (this.theme === "jungle") {
      this.backgroundPattern = "🌿🌱🍃";
    } else if (this.theme === "desert") {
      this.backgroundPattern = "🌵🏜️☀️";
    } else if (this.theme === "rainbow") {
      this.backgroundPattern = "🌈✨💫";
    } else {
      this.backgroundPattern = "⭐🎮🎯";
    }

    // Initialize tiles
    this.initializeTiles();
    
    // Responsive layout on resize
    window.addEventListener('resize', () => this.initializeTiles());

    // Unlock audio on first user interaction (for iOS)
    const unlock = () => {
      this.audio.unlockAll();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
  }

  private initializeTiles() {
    this.leftTiles = [];
    this.rightTiles = [];
    
    // Use logical canvas dimensions (accounting for device pixel ratio)
    const { width, height } = this.ctx.canvas;
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = width / dpr;
    const logicalHeight = height / dpr;
    
    const n = this.pairs.length;
    
    // Child-friendly large tiles
    const tileWidth = Math.max(200, Math.min(280, logicalWidth * 0.35));
    const tileHeight = Math.max(80, Math.min(100, logicalHeight * 0.12));
    const spacing = 20;
    
    // Calculate positions for centered grid layout
    const totalHeight = n * tileHeight + (n - 1) * spacing;
    const startY = (logicalHeight - totalHeight) / 2;
    const leftX = logicalWidth * 0.1;
    const rightX = logicalWidth * 0.9 - tileWidth;
    
    // Create arrays for randomization
    const leftContents = this.pairs.map(pair => pair.left);
    const rightContents = this.pairs.map(pair => pair.right);
    
    // Shuffle the right side for variety (keep left side in order for consistency)
    const shuffledRightContents = [...rightContents];
    for (let i = shuffledRightContents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledRightContents[i], shuffledRightContents[j]] = [shuffledRightContents[j], shuffledRightContents[i]];
    }
    
    // Create left tiles (in order)
    for (let i = 0; i < n; i++) {
      const y = startY + i * (tileHeight + spacing);
      
      const leftTile: Tile = {
        x: leftX,
        y: y,
        width: tileWidth,
        height: tileHeight,
        content: leftContents[i],
        isMatched: false,
        isHovered: false,
        isDragging: false,
        isDropTarget: false,
        index: this.pairs.findIndex(pair => pair.left === leftContents[i]), // Original index for matching
        side: 'left',
        scale: 1,
        targetScale: 1,
        originalX: leftX,
        originalY: y,
        hoverStartTime: undefined,
        dropTargetStartTime: undefined
      };
      
      this.leftTiles.push(leftTile);
    }
    
    // Create right tiles (shuffled)
    for (let i = 0; i < n; i++) {
      const y = startY + i * (tileHeight + spacing);
      
      const rightTile: Tile = {
        x: rightX,
        y: y,
        width: tileWidth,
        height: tileHeight,
        content: shuffledRightContents[i],
        isMatched: false,
        isHovered: false,
        isDragging: false,
        isDropTarget: false,
        index: this.pairs.findIndex(pair => pair.right === shuffledRightContents[i]), // Original index for matching
        side: 'right',
        scale: 1,
        targetScale: 1,
        originalX: rightX,
        originalY: y,
        hoverStartTime: undefined,
        dropTargetStartTime: undefined
      };
      
      this.rightTiles.push(rightTile);
    }
  }

  update(delta: number) {
    const pointer = this.input.pointer;
    this.mouseX = pointer.x;
    this.mouseY = pointer.y;

    // Update tile scales for smooth animations
    [...this.leftTiles, ...this.rightTiles].forEach(tile => {
      const diff = tile.targetScale - tile.scale;
      tile.scale += diff * 0.15; // Smooth animation
    });

    // Handle hover detection
    this.updateHoverState();

    // Handle drag interactions
    this.updateDragState(delta);

    // Win detection
    if (!this.winShown && this.leftTiles.every(tile => tile.isMatched)) {
      this.winShown = true;
      this.handleWin();
    }

    // Update floating texts
    this.floatingTexts = this.floatingTexts.filter(ft => {
      ft.y -= ft.vy;
      ft.alpha -= 0.015;
      ft.time += delta;
      return ft.alpha > 0 && ft.time < 2000;
    });

    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.08; // gentle gravity
      particle.life -= delta;
      return particle.life > 0;
    });
  }

  private updateHoverState() {
    const currentTime = Date.now();
    
    // Reset hover states
    [...this.leftTiles, ...this.rightTiles].forEach(tile => {
      tile.isHovered = false;
      tile.targetScale = 1;
    });

    // Find hovered tile
    this.hoveredTile = null;
    for (const tile of [...this.leftTiles, ...this.rightTiles]) {
      if (!tile.isMatched && !tile.isDragging && this.isPointInTile(this.mouseX, this.mouseY, tile)) {
        tile.isHovered = true;
        tile.targetScale = 1.03; // Very subtle scale increase
        this.hoveredTile = tile;
        
        // Create unique tile ID for tracking
        const tileId = `${tile.side}-${tile.index}`;
        
        // Only play sound if this is a different tile than last hovered
        if (tile.side === 'left' && this.lastHoveredTileId !== tileId) {
          this.audio.playSubtle('correct', 0.03); // Very quiet
          this.lastHoveredTileId = tileId;
        }
        break;
      }
    }
    
    // If no tile is hovered, reset the last hovered tile ID
    if (!this.hoveredTile) {
      this.lastHoveredTileId = null;
    }
  }

  private updateDragState(delta: number) {
    const pointer = this.input.pointer;

    // Check for play button clicks first (before drag logic)
    if (pointer.isDown && !this.draggedTile) {
      // Check play buttons on right-side tiles
      for (const tile of this.rightTiles) {
        if (!tile.isMatched && this.isPlayButtonClicked(pointer.x, pointer.y, tile)) {
          this.playTileSound(tile);
          return; // Exit early to prevent drag behavior
        }
      }
    }

    // Start dragging
    if (pointer.isDown && !this.draggedTile) {
      for (const tile of this.leftTiles) {
        if (!tile.isMatched && this.isPointInTile(pointer.x, pointer.y, tile)) {
          this.draggedTile = tile;
          tile.isDragging = true;
          tile.targetScale = 1.08; // Subtle scale increase
          this.dragOffset.x = pointer.x - tile.x;
          this.dragOffset.y = pointer.y - tile.y;
          
          // Very subtle pickup sound
          this.audio.playSubtle('correct', 0.08);
          console.log('Started dragging:', tile.content);
          break;
        }
      }
    }

    // Continue dragging
    if (this.draggedTile && pointer.isDown) {
      this.draggedTile.x = pointer.x - this.dragOffset.x;
      this.draggedTile.y = pointer.y - this.dragOffset.y;
    }

    // Stop dragging
    if (this.draggedTile && !pointer.isDown) {
      console.log('Stopped dragging:', this.draggedTile.content);
      this.draggedTile.isDragging = false;
      this.draggedTile.targetScale = 1;
      
      // Store reference before clearing it
      const justDropped = this.draggedTile;
      this.draggedTile = null;
      
      // Check for match immediately
      this.checkMatchForTile(justDropped);
    }

    // Update drop targets with subtle feedback
    const currentTime = Date.now();
    this.rightTiles.forEach(tile => {
      const wasDropTarget = tile.isDropTarget;
      tile.isDropTarget = false;
      
      if (this.draggedTile && !tile.isMatched) {
        // Check if the dragged tile's center is near this target
        const draggedCenterX = this.draggedTile.x + this.draggedTile.width / 2;
        const draggedCenterY = this.draggedTile.y + this.draggedTile.height / 2;
        
        const targetCenterX = tile.x + tile.width / 2;
        const targetCenterY = tile.y + tile.height / 2;
        
        const distance = Math.hypot(draggedCenterX - targetCenterX, draggedCenterY - targetCenterY);
        
        // More generous distance for children + correct pair highlighting
        if (distance < 120) {
          // Check if this is the correct matching pair
          const isCorrectPair = this.isCorrectPair(this.draggedTile.content, tile.content);
          
          if (isCorrectPair) {
            tile.isDropTarget = true;
            
            // Create unique tile ID for tracking
            const tileId = `${tile.side}-${tile.index}`;
            
            // Set start time for animation and play subtle sound only for new drop targets
            if (!wasDropTarget && this.lastDropTargetTileId !== tileId) {
              tile.dropTargetStartTime = currentTime;
              this.audio.playSubtle('cat', 0.05);
              this.lastDropTargetTileId = tileId;
            }
          }
        }
      }
      
      // Reset timing when no longer a drop target
      if (!tile.isDropTarget) {
        tile.dropTargetStartTime = undefined;
      }
    });
    
    // Reset drop target tracking when no tiles are drop targets
    if (!this.rightTiles.some(tile => tile.isDropTarget)) {
      this.lastDropTargetTileId = null;
    }
  }

  private snapTileBack(tile: Tile) {
    tile.x = tile.originalX;
    tile.y = tile.originalY;
  }

  private handleMatch(leftTile: Tile, rightTile: Tile) {
    // Snap to target position
    leftTile.x = rightTile.x;
    leftTile.y = rightTile.y;
    
    // Mark as matched
    leftTile.isMatched = true;
    rightTile.isMatched = true;
    
    // Create celebration effects
    this.createMatchParticles(rightTile.x + rightTile.width/2, rightTile.y + rightTile.height/2);
    
    // Play sound
    const content = leftTile.content.toLowerCase();
    if (content.includes('dog')) this.audio.play('dog');
    else if (content.includes('cat')) this.audio.play('cat');
    
    // Add floating text
    this.floatingTexts.push({
      x: rightTile.x + rightTile.width/2,
      y: rightTile.y - 20,
      text: '🌟 Perfect Match! 🌟',
      alpha: 1,
      vy: 0.8,
      time: 0
    });
  }

  private handleWin() {
    this.audio.play('correct', () => {
      this.winMessageShown = true;
    });
    // Fallback timeout
    setTimeout(() => {
      if (!this.winMessageShown) this.winMessageShown = true;
    }, 1000);
  }

  private createMatchParticles(x: number, y: number) {
    const colors = ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -6 - 2,
        life: 100 + Math.random() * 50,
        maxLife: 150,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4
      });
    }
  }

  private isPointInTile(x: number, y: number, tile: Tile): boolean {
    return x >= tile.x && x <= tile.x + tile.width &&
           y >= tile.y && y <= tile.y + tile.height;
  }

  private isOverlapping(tileA: Tile, tileB: Tile): boolean {
    return tileA.x < tileB.x + tileB.width &&
           tileA.x + tileA.width > tileB.x &&
           tileA.y < tileB.y + tileB.height &&
           tileA.y + tileA.height > tileB.y;
  }

  private checkMatchForTile(droppedTile: Tile) {
    console.log('Checking match for dropped tile:', droppedTile.content);

    // Find all right tiles that the dropped tile overlaps with
    for (const rightTile of this.rightTiles) {
      if (rightTile.isMatched) continue; // Skip already matched tiles

      // Check if the dropped tile overlaps with this right tile
      const draggedCenterX = droppedTile.x + droppedTile.width / 2;
      const draggedCenterY = droppedTile.y + droppedTile.height / 2;
      
      const isOverTarget = draggedCenterX >= rightTile.x && 
                          draggedCenterX <= rightTile.x + rightTile.width &&
                          draggedCenterY >= rightTile.y && 
                          draggedCenterY <= rightTile.y + rightTile.height;

      // Also check standard overlap as backup
      const standardOverlap = this.isOverlapping(droppedTile, rightTile);

      if (isOverTarget || standardOverlap) {
        console.log('Found overlap with:', rightTile.content);
        
        // Now check if this is a correct match based on the pair data
        const isCorrectMatch = this.isCorrectPair(droppedTile.content, rightTile.content);
        
        console.log('Is correct match?', isCorrectMatch);
        
        if (isCorrectMatch) {
          console.log('CORRECT MATCH! Calling handleMatch');
          this.handleMatch(droppedTile, rightTile);
          return; // Match found, exit early
        } else {
          console.log('Wrong match, continue checking...');
          // Continue checking other tiles if this wasn't a correct match
        }
      }
    }
    
    console.log('No correct match found, snapping back');
    // If we get here, no correct match was found
    this.snapTileBack(droppedTile);
  }

  // Helper method to check if two contents form a correct pair
  private isCorrectPair(leftContent: string, rightContent: string): boolean {
    return this.pairs.some(pair => 
      pair.left === leftContent && pair.right === rightContent
    );
  }

  render() {
    // Enhanced background with gradient
    this.drawGradientBackground();
    
    // Draw background pattern
    this.drawBackgroundPattern();

    // Draw instructions at the top
    this.drawInstructions();

    // Draw connection lines for matched pairs
    this.drawConnectionLines();

    // Draw all tiles using the new tile system
    [...this.leftTiles, ...this.rightTiles].forEach(tile => {
      drawTile(this.ctx, tile);
    });

    // Render particles
    this.renderParticles();

    // Enhanced floating text with bigger size for kids
    this.floatingTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.globalAlpha = ft.alpha;
      this.ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif';
      this.ctx.fillStyle = '#10b981';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
      this.ctx.shadowBlur = 15;
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });

    // Enhanced win message
    if (this.winMessageShown) {
      this.drawWinMessage();
    }

    // Progress indicator (moved down)
    this.drawProgressIndicator();

    // Debug info (uncomment for troubleshooting)
    // this.drawDebugInfo();
  }

  private drawGradientBackground() {
    const { width, height } = this.ctx.canvas;
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = width / dpr;
    const logicalHeight = height / dpr;
    
    // Create gradient based on theme
    let gradient: CanvasGradient;
    if (this.theme === "jungle") {
      gradient = this.ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#059669');
    } else if (this.theme === "desert") {
      gradient = this.ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(1, '#dc2626');
    } else if (this.theme === "rainbow") {
      gradient = this.ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
      gradient.addColorStop(0, '#ec4899');
      gradient.addColorStop(0.5, '#8b5cf6');
      gradient.addColorStop(1, '#3b82f6');
    } else {
      gradient = this.ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, logicalWidth, logicalHeight);
  }

  private drawBackgroundPattern() {
    const { width, height } = this.ctx.canvas;
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = width / dpr;
    const logicalHeight = height / dpr;
    
    this.ctx.save();
    this.ctx.globalAlpha = 0.1;
    this.ctx.font = '24px sans-serif';
    this.ctx.fillStyle = '#ffffff';
    
    for (let i = 0; i < logicalWidth; i += 100) {
      for (let j = 0; j < logicalHeight; j += 100) {
        this.ctx.fillText(this.backgroundPattern, i, j);
      }
    }
    this.ctx.restore();
  }

  private drawConnectionLines() {
    this.ctx.save();
    this.leftTiles.forEach((leftTile, index) => {
      const rightTile = this.rightTiles[index];
      if (leftTile.isMatched && rightTile.isMatched) {
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 5;
        this.ctx.setLineDash([8, 8]);
        this.ctx.beginPath();
        this.ctx.moveTo(leftTile.x + leftTile.width, leftTile.y + leftTile.height/2);
        this.ctx.lineTo(rightTile.x, rightTile.y + rightTile.height/2);
        this.ctx.stroke();
      }
    });
    this.ctx.restore();
  }

  private renderParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life / particle.maxLife;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  private drawWinMessage() {
    const { width, height } = this.ctx.canvas;
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = width / dpr;
    const logicalHeight = height / dpr;
    
    // Background overlay
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, logicalWidth, logicalHeight);
    
    // Win text with glow effect - bigger for kids
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.font = 'bold 80px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif'; // Even bigger
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = '#f59e0b';
    this.ctx.shadowBlur = 40;
    this.ctx.fillText('🎉 Congratulations! 🎉', logicalWidth / 2, logicalHeight / 2 - 50);
    
    // Subtitle - bigger text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif'; // Bigger
    this.ctx.shadowBlur = 15;
    this.ctx.fillText('You matched all pairs perfectly!', logicalWidth / 2, logicalHeight / 2 + 30);
    
    // Instructions - bigger and more prominent
    this.ctx.fillStyle = '#d1d5db';
    this.ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif'; // Bigger
    this.ctx.shadowBlur = 8;
    this.ctx.fillText('Press ESC to return to menu', logicalWidth / 2, logicalHeight / 2 + 80);
    
    this.ctx.restore();
  }

  private drawProgressIndicator() {
    const { width, height } = this.ctx.canvas;
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = width / dpr;
    const logicalHeight = height / dpr;
    
    const matched = this.leftTiles.filter(tile => tile.isMatched).length;
    const total = this.leftTiles.length;
    const progress = matched / total;
    
    // Move progress bar further down from top edge with more breathing room
    const progressY = 120; // Moved further down from 80
    
    // Progress bar background - bigger for kids
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(logicalWidth / 2 - 200, progressY, 400, 12);
    
    // Progress bar fill
    this.ctx.fillStyle = '#10b981';
    this.ctx.fillRect(logicalWidth / 2 - 200, progressY, 400 * progress, 12);
    
    // Progress text - moved down
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowBlur = 6;
    this.ctx.fillText(`${matched} / ${total} pairs matched`, logicalWidth / 2, progressY - 15);
    
    this.ctx.restore();
  }

  private drawInstructions() {
    const { width } = this.ctx.canvas;
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = width / dpr;
    
    // Contextual instructions based on theme
    let instruction = "Drag each item to its matching pair";
    let subInstruction = "Tap 🔊 to hear sounds"; // New sub-instruction
    
    if (this.theme === "jungle") {
      instruction = "🌿 Drag the animals to the sounds they make";
    } else if (this.theme === "desert") {
      instruction = "🏜️ Match each desert item with its pair";
    } else if (this.theme === "rainbow") {
      instruction = "🌈 Connect the matching rainbow pairs";
    } else {
      // Try to detect if it's an animal/sound game from content
      const hasAnimalSounds = this.pairs.some(pair => 
        pair.left.toLowerCase().includes('dog') || 
        pair.left.toLowerCase().includes('cat') ||
        pair.right.toLowerCase().includes('bark') ||
        pair.right.toLowerCase().includes('meow')
      );
      
      if (hasAnimalSounds) {
        instruction = "🐾 Drag the animals to the sounds they make";
      }
    }
    
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    this.ctx.shadowBlur = 8;
    this.ctx.fillText(instruction, logicalWidth / 2, 45); // Moved down from 35
    
    // Add sub-instruction about play buttons
    this.ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillText(subInstruction, logicalWidth / 2, 70); // Below main instruction
    
    this.ctx.restore();
  }

  private drawDebugInfo() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(10, 10, 300, 120);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'left';
    
    let y = 30;
    this.ctx.fillText(`Mouse: ${Math.round(this.mouseX)}, ${Math.round(this.mouseY)}`, 20, y);
    y += 20;
    this.ctx.fillText(`Pointer Down: ${this.input.pointer.isDown}`, 20, y);
    y += 20;
    this.ctx.fillText(`Dragging: ${this.draggedTile ? this.draggedTile.content : 'none'}`, 20, y);
    y += 20;
    this.ctx.fillText(`Hovered: ${this.hoveredTile ? this.hoveredTile.content : 'none'}`, 20, y);
    y += 20;
    
    const dropTargets = this.rightTiles.filter(t => t.isDropTarget);
    this.ctx.fillText(`Drop Targets: ${dropTargets.length}`, 20, y);
    
    this.ctx.restore();
  }

  private isPlayButtonClicked(x: number, y: number, tile: Tile): boolean {
    if (tile.side !== 'right') return false;
    
    const buttonSize = 24;
    const buttonX = tile.x + tile.width - buttonSize - 8;
    const buttonY = tile.y + 8;
    
    // Check if click is within the circular play button
    const centerX = buttonX + buttonSize / 2;
    const centerY = buttonY + buttonSize / 2;
    const distance = Math.hypot(x - centerX, y - centerY);
    
    return distance <= buttonSize / 2;
  }

  private playTileSound(tile: Tile) {
    // Map tile content to appropriate sound
    // This is a simple mapping - in a real game you'd have more sophisticated mapping
    let soundFile = 'correct'; // default fallback
    
    // Map based on tile content (this should be customized based on your game data)
    const content = tile.content.toLowerCase();
    if (content.includes('bark') || content.includes('🐕') || content.includes('dog')) {
      soundFile = 'dog';
    } else if (content.includes('meow') || content.includes('🐱') || content.includes('cat')) {
      soundFile = 'cat';
    } else if (content.includes('buzz') || content.includes('🐝') || content.includes('bee')) {
      soundFile = 'correct'; // placeholder - you'd want a bee sound
    }
    
    // Play the sound
    this.audio.play(soundFile);
    console.log(`Playing sound for tile: ${tile.content} -> ${soundFile}`);
  }
}
