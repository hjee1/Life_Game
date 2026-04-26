// === Game Engine: Loop, Rendering, Input, Camera ===

import {
  Direction, DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP,
  GameEntity, NPCEntity, InteractionPoint, Zone,
  TILE_SIZE, MAP_COLS, MAP_ROWS, PLAYER_SPEED,
  TILE_WALL, TILE_DOOR,
} from "./types";
import {
  drawPlayer, drawNPC, drawTile, drawTooltip,
  drawBuildingRoof, drawBuildingWall, drawBuildingDoor, drawWindow,
  drawZoneSign,
} from "./sprites";
import {
  generateMap, isWalkable, getInteractionPoints, getZoneAtTile,
  STAR_NPC, PLAYER_SPAWN, ZONES,
} from "./world";

// ===== INPUT STATE =====
const keys: Record<string, boolean> = {};
let touchDir: Direction | null = null;
let actionPressed = false;
let actionConsumed = false;

export function setTouchDirection(dir: Direction | null) {
  touchDir = dir;
}

export function triggerAction() {
  actionPressed = true;
  actionConsumed = false;
}

function setupKeyboard() {
  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " " || e.key === "Enter" || e.key === "e" || e.key === "E") {
      actionPressed = true;
      actionConsumed = false;
    }
  });
  window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });
}

function getInputDirection(): Direction | null {
  if (touchDir !== null) return touchDir;
  if (keys["ArrowUp"] || keys["w"] || keys["W"]) return DIR_UP;
  if (keys["ArrowDown"] || keys["s"] || keys["S"]) return DIR_DOWN;
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) return DIR_LEFT;
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) return DIR_RIGHT;
  return null;
}

// ===== GAME ENGINE CLASS =====

export interface EngineEvents {
  onZoneInteract?: (zone: Zone) => void;
  onNPCInteract?: () => void;
  onNearInteraction?: (point: InteractionPoint | null) => void;
  onPlayerZone?: (zoneName: string | null) => void;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tileMap: number[][];
  player: GameEntity;
  npc: NPCEntity;
  interactionPoints: InteractionPoint[];
  camera: { x: number; y: number };
  scale: number;
  running: boolean;
  lastTime: number;
  globalFrame: number;
  events: EngineEvents;
  nearestInteraction: InteractionPoint | null;
  activityAnimation: string | null; // emoji for current activity

  constructor(canvas: HTMLCanvasElement, events: EngineEvents) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.tileMap = generateMap();
    this.player = {
      x: PLAYER_SPAWN.x,
      y: PLAYER_SPAWN.y,
      direction: DIR_DOWN,
      moving: false,
      frame: 0,
      frameTimer: 0,
    };
    this.npc = { ...STAR_NPC };
    this.interactionPoints = getInteractionPoints();
    this.camera = { x: 0, y: 0 };
    this.scale = 1;
    this.running = false;
    this.lastTime = 0;
    this.globalFrame = 0;
    this.events = events;
    this.nearestInteraction = null;
    this.activityAnimation = null;

    setupKeyboard();
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";

    // Calculate scale: fit ~12 tiles horizontally (closer camera for detail)
    const targetTilesVisible = 12;
    this.scale = Math.max(2, Math.round((window.innerWidth * dpr) / (TILE_SIZE * targetTilesVisible)));
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    this.running = false;
  }

  setActivityAnimation(emoji: string | null) {
    this.activityAnimation = emoji;
  }

  loop = (timestamp: number) => {
    if (!this.running) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1); // cap at 100ms
    this.lastTime = timestamp;
    this.globalFrame++;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  };

  // ===== UPDATE =====

  update(dt: number) {
    // Don't move if activity is running
    if (this.activityAnimation) {
      this.player.moving = false;
      // Animate frame for activity
      this.player.frameTimer += dt;
      if (this.player.frameTimer > 0.3) {
        this.player.frame++;
        this.player.frameTimer = 0;
      }
      return;
    }

    const dir = getInputDirection();

    if (dir !== null) {
      this.player.direction = dir;
      this.player.moving = true;

      // Calculate movement
      const speed = PLAYER_SPEED * TILE_SIZE * dt * this.getSpeedMultiplier();
      let nx = this.player.x;
      let ny = this.player.y;

      if (dir === DIR_UP) ny -= speed;
      if (dir === DIR_DOWN) ny += speed;
      if (dir === DIR_LEFT) nx -= speed;
      if (dir === DIR_RIGHT) nx += speed;

      // Collision check (check all 4 corners of player hitbox)
      const hitboxPad = 2; // pixels padding from edges
      if (this.canMoveTo(nx + hitboxPad, this.player.y + hitboxPad, TILE_SIZE - hitboxPad * 2, TILE_SIZE - hitboxPad * 2)) {
        this.player.x = nx;
      }
      if (this.canMoveTo(this.player.x + hitboxPad, ny + hitboxPad, TILE_SIZE - hitboxPad * 2, TILE_SIZE - hitboxPad * 2)) {
        this.player.y = ny;
      }

      // Clamp to world bounds
      this.player.x = Math.max(0, Math.min(this.player.x, (MAP_COLS - 1) * TILE_SIZE));
      this.player.y = Math.max(0, Math.min(this.player.y, (MAP_ROWS - 1) * TILE_SIZE));

      // Walk animation (faster cycle for smoother movement)
      this.player.frameTimer += dt;
      if (this.player.frameTimer > 0.12) {
        this.player.frame++;
        this.player.frameTimer = 0;
      }
    } else {
      this.player.moving = false;
    }

    // Update NPC animation
    this.npc.frame = this.globalFrame;

    // Check interaction proximity
    this.checkInteractions();

    // Handle action press
    if (actionPressed && !actionConsumed) {
      actionConsumed = true;
      actionPressed = false;
      this.handleAction();
    }

    // Update camera
    this.updateCamera();
  }

  getSpeedMultiplier(): number {
    // Speed up on paths
    const tileX = Math.floor(this.player.x / TILE_SIZE);
    const tileY = Math.floor(this.player.y / TILE_SIZE);
    const tile = this.tileMap[tileY]?.[tileX];
    return tile === 1 ? 1.5 : 1.0; // TILE_PATH = faster
  }

  canMoveTo(x: number, y: number, w: number, h: number): boolean {
    // Check all 4 corners
    const corners = [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ];
    for (const [cx, cy] of corners) {
      const tx = Math.floor(cx / TILE_SIZE);
      const ty = Math.floor(cy / TILE_SIZE);
      if (tx < 0 || tx >= MAP_COLS || ty < 0 || ty >= MAP_ROWS) return false;
      if (!isWalkable(this.tileMap[ty][tx])) return false;
    }
    return true;
  }

  checkInteractions() {
    const px = this.player.x + TILE_SIZE / 2;
    const py = this.player.y + TILE_SIZE / 2;
    const interactDist = TILE_SIZE * 1.8;

    let nearest: InteractionPoint | null = null;
    let nearestDist = Infinity;

    for (const point of this.interactionPoints) {
      const dx = (point.x + point.width / 2) - px;
      const dy = (point.y + point.height / 2) - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < interactDist && dist < nearestDist) {
        nearest = point;
        nearestDist = dist;
      }
    }

    if (nearest !== this.nearestInteraction) {
      this.nearestInteraction = nearest;
      this.events.onNearInteraction?.(nearest);
    }
  }

  handleAction() {
    if (!this.nearestInteraction) return;

    const point = this.nearestInteraction;
    if (point.type === "zone") {
      const zone = ZONES.find((z) => z.id === point.id);
      if (zone) this.events.onZoneInteract?.(zone);
    } else if (point.type === "npc") {
      this.events.onNPCInteract?.();
    }
  }

  updateCamera() {
    const s = this.scale;
    const screenW = this.canvas.width;
    const screenH = this.canvas.height;

    // Target: center player on screen
    const targetX = this.player.x * s - screenW / 2 + (TILE_SIZE * s) / 2;
    const targetY = this.player.y * s - screenH / 2 + (TILE_SIZE * s) / 2;

    // Smooth follow (tighter tracking)
    this.camera.x += (targetX - this.camera.x) * 0.15;
    this.camera.y += (targetY - this.camera.y) * 0.15;

    // Clamp to world bounds
    const worldW = MAP_COLS * TILE_SIZE * s;
    const worldH = MAP_ROWS * TILE_SIZE * s;
    this.camera.x = Math.max(0, Math.min(this.camera.x, worldW - screenW));
    this.camera.y = Math.max(0, Math.min(this.camera.y, worldH - screenH));
  }

  // ===== RENDER =====

  render() {
    const ctx = this.ctx;
    const s = this.scale;
    const tilePixels = TILE_SIZE * s;
    const camX = this.camera.x;
    const camY = this.camera.y;

    // Clear
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Determine visible tile range
    const startCol = Math.max(0, Math.floor(camX / tilePixels) - 1);
    const endCol = Math.min(MAP_COLS, Math.ceil((camX + this.canvas.width) / tilePixels) + 1);
    const startRow = Math.max(0, Math.floor(camY / tilePixels) - 1);
    const endRow = Math.min(MAP_ROWS, Math.ceil((camY + this.canvas.height) / tilePixels) + 1);

    // === Draw tiles ===
    for (let ty = startRow; ty < endRow; ty++) {
      for (let tx = startCol; tx < endCol; tx++) {
        const tile = this.tileMap[ty]?.[tx];
        if (tile === undefined) continue;

        const screenX = tx * tilePixels - camX;
        const screenY = ty * tilePixels - camY;

        // Check if this tile belongs to a zone building
        const zone = getZoneAtTile(tx, ty);

        if (zone && tile === TILE_WALL) {
          // Is this a roof tile? (row above building)
          if (ty === zone.by - 1) {
            drawBuildingRoof(ctx, screenX, screenY, tilePixels, zone.roofColor);
          } else {
            // Check if this wall should have a window
            const relX = tx - zone.bx;
            const relY = ty - zone.by;
            if (relY === 1 && (relX === 1 || relX === zone.bw - 2)) {
              drawWindow(ctx, screenX, screenY, tilePixels, zone.wallColor, true);
            } else {
              drawBuildingWall(ctx, screenX, screenY, tilePixels, zone.wallColor);
            }
          }
        } else if (zone && tile === TILE_DOOR) {
          drawBuildingDoor(ctx, screenX, screenY, tilePixels, zone.accentColor);
        } else {
          drawTile(ctx, tile, screenX, screenY, tilePixels, tx, ty);
        }
      }
    }

    // === Draw zone signs above doors ===
    for (const zone of ZONES) {
      const signX = zone.doorX * tilePixels - camX;
      const signY = (zone.doorY - 1) * tilePixels - camY;
      // Only draw if on screen
      if (signX > -200 && signX < this.canvas.width + 200 &&
          signY > -200 && signY < this.canvas.height + 200) {
        drawZoneSign(ctx, signX, signY, tilePixels, zone.emoji, zone.name);
      }
    }

    // === Draw NPC ===
    const npcScreenX = this.npc.x * s - camX;
    const npcScreenY = this.npc.y * s - camY;
    if (npcScreenX > -tilePixels && npcScreenX < this.canvas.width + tilePixels &&
        npcScreenY > -tilePixels && npcScreenY < this.canvas.height + tilePixels) {
      drawNPC(ctx, npcScreenX, npcScreenY, this.npc.frame, s);
      // Name label
      ctx.fillStyle = "#F4D03F";
      ctx.font = `${8 * Math.max(1, s / 2)}px 'Galmuri11', monospace`;
      ctx.textAlign = "center";
      ctx.fillText("별이", npcScreenX + tilePixels / 2, npcScreenY - 6 * s);
      ctx.textAlign = "start";
    }

    // === Draw Player ===
    const playerScreenX = this.player.x * s - camX;
    const playerScreenY = this.player.y * s - camY;
    drawPlayer(ctx, playerScreenX, playerScreenY, this.player.direction, this.player.frame, s);

    // Activity emoji floating above player
    if (this.activityAnimation) {
      const bobY = Math.sin(this.globalFrame * 0.08) * 3 * s;
      ctx.font = `${14 * Math.max(1, s / 2)}px serif`;
      ctx.textAlign = "center";
      ctx.fillText(this.activityAnimation, playerScreenX + tilePixels / 2, playerScreenY - 8 * s + bobY);
      ctx.textAlign = "start";
    }

    // === Draw interaction tooltip ===
    if (this.nearestInteraction && !this.activityAnimation) {
      const point = this.nearestInteraction;
      const tooltipX = point.x * s - camX + (point.width * s) / 2;
      const tooltipY = point.y * s - camY;
      drawTooltip(ctx, tooltipX, tooltipY, "🅰 " + point.label, this.globalFrame);
    }

    // === Draw player name ===
    ctx.fillStyle = "#FFF";
    ctx.font = `${8 * Math.max(1, s / 2)}px 'Galmuri11', monospace`;
    ctx.textAlign = "center";
    ctx.fillText("현우", playerScreenX + tilePixels / 2, playerScreenY - 4 * s);
    ctx.textAlign = "start";
  }
}
