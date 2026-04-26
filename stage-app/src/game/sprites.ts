// === Pixel Art Sprite Drawing System ===
// All sprites drawn via fillRect for true pixel art rendering

import {
  Direction, DIR_DOWN, DIR_UP, DIR_LEFT, DIR_RIGHT,
  TILE_GRASS, TILE_PATH, TILE_WATER, TILE_WALL, TILE_ROOF,
  TILE_DOOR, TILE_TREE, TILE_FLOWERS, TILE_FENCE, TILE_BRIDGE,
  TILE_DARK_GRASS, TILE_SIGN,
} from "./types";

// Helper: draw a single pixel (scaled)
function px(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, s, s);
}

// Helper: draw rect of pixels
function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, s: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * s, h * s);
}

// ===== PLAYER SPRITE =====

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  dir: Direction,
  frame: number,
  scale: number
) {
  const s = scale; // each game pixel = scale screen pixels
  // Character is 12×16 pixels, centered in 16×16 tile
  const ox = screenX + 2 * s; // offset to center
  const oy = screenY;

  // Walking leg offset
  const walkOffset = frame % 2 === 0 ? 0 : 1;

  if (dir === DIR_DOWN || dir === DIR_UP) {
    // -- Hair --
    ctx.fillStyle = "#1a1a2e";
    rect(ctx, ox + 2 * s, oy + 0 * s, 8, 3, s, "#1a1a2e");
    if (dir === DIR_DOWN) {
      // Bangs
      rect(ctx, ox + 1 * s, oy + 2 * s, 2, 1, s, "#16213e");
      rect(ctx, ox + 9 * s, oy + 2 * s, 2, 1, s, "#16213e");
    }

    // -- Face --
    rect(ctx, ox + 2 * s, oy + 3 * s, 8, 5, s, "#FDEBD0");
    // Side hair
    rect(ctx, ox + 1 * s, oy + 2 * s, 1, 4, s, "#1a1a2e");
    rect(ctx, ox + 10 * s, oy + 2 * s, 1, 4, s, "#1a1a2e");

    if (dir === DIR_DOWN) {
      // Eyes
      rect(ctx, ox + 3 * s, oy + 4 * s, 2, 2, s, "#2C3E50");
      rect(ctx, ox + 7 * s, oy + 4 * s, 2, 2, s, "#2C3E50");
      px(ctx, ox + 3 * s, oy + 4 * s, s, "#FFF");
      px(ctx, ox + 7 * s, oy + 4 * s, s, "#FFF");
      // Blush
      rect(ctx, ox + 2 * s, oy + 6 * s, 2, 1, s, "rgba(245,203,167,0.7)");
      rect(ctx, ox + 8 * s, oy + 6 * s, 2, 1, s, "rgba(245,203,167,0.7)");
      // Mouth
      rect(ctx, ox + 5 * s, oy + 7 * s, 2, 1, s, "#E74C3C");
    }
    // (DIR_UP = back of head, no face details)

    // -- Neck --
    rect(ctx, ox + 4 * s, oy + 8 * s, 4, 1, s, "#FDEBD0");

    // -- Shirt (hoodie) --
    rect(ctx, ox + 1 * s, oy + 9 * s, 10, 4, s, "#5DADE2");
    // Zipper
    rect(ctx, ox + 5 * s, oy + 9 * s, 2, 4, s, "#3498DB");
    // Zipper buttons
    px(ctx, ox + 5 * s, oy + 9 * s, s, "#F4D03F");
    px(ctx, ox + 5 * s, oy + 11 * s, s, "#F4D03F");
    // Pockets
    rect(ctx, ox + 2 * s, oy + 11 * s, 2, 1, s, "#3498DB");
    rect(ctx, ox + 8 * s, oy + 11 * s, 2, 1, s, "#3498DB");
    // Arms
    rect(ctx, ox + 0 * s, oy + 9 * s, 1, 4, s, "#5DADE2");
    rect(ctx, ox + 11 * s, oy + 9 * s, 1, 4, s, "#5DADE2");
    // Hands
    px(ctx, ox + 0 * s, oy + 12 * s, s, "#FDEBD0");
    px(ctx, ox + 11 * s, oy + 12 * s, s, "#FDEBD0");

    // -- Pants --
    rect(ctx, ox + 2 * s, oy + 13 * s, 8, 1, s, "#2E4053");

    // -- Legs + Shoes (walking animation) --
    if (walkOffset === 0) {
      rect(ctx, ox + 2 * s, oy + 14 * s, 3, 1, s, "#2E4053");
      rect(ctx, ox + 7 * s, oy + 14 * s, 3, 1, s, "#2E4053");
      rect(ctx, ox + 2 * s, oy + 15 * s, 3, 1, s, "#8B4513");
      rect(ctx, ox + 7 * s, oy + 15 * s, 3, 1, s, "#8B4513");
    } else {
      rect(ctx, ox + 3 * s, oy + 14 * s, 3, 1, s, "#2E4053");
      rect(ctx, ox + 6 * s, oy + 14 * s, 3, 1, s, "#2E4053");
      rect(ctx, ox + 3 * s, oy + 15 * s, 3, 1, s, "#8B4513");
      rect(ctx, ox + 6 * s, oy + 15 * s, 3, 1, s, "#8B4513");
    }
  } else {
    // LEFT or RIGHT
    const flip = dir === DIR_RIGHT;
    const fx = (lx: number) => flip ? ox + (11 - lx) * s : ox + lx * s;

    // Hair
    rect(ctx, fx(2), oy + 0 * s, 8, 3, s, "#1a1a2e");
    rect(ctx, fx(1), oy + 2 * s, 1, 4, s, "#1a1a2e");

    // Face
    rect(ctx, fx(2), oy + 3 * s, 8, 5, s, "#FDEBD0");

    // Eye (side view = 1 eye)
    rect(ctx, fx(flip ? 3 : 7), oy + 4 * s, 2, 2, s, "#2C3E50");
    px(ctx, fx(flip ? 3 : 7), oy + 4 * s, s, "#FFF");

    // Mouth
    px(ctx, fx(flip ? 4 : 7), oy + 7 * s, s, "#E74C3C");

    // Neck
    rect(ctx, fx(4), oy + 8 * s, 4, 1, s, "#FDEBD0");

    // Shirt
    rect(ctx, fx(1), oy + 9 * s, 10, 4, s, "#5DADE2");
    rect(ctx, fx(5), oy + 9 * s, 2, 4, s, "#3498DB");

    // Front arm
    rect(ctx, fx(flip ? 9 : 1), oy + 9 * s + (walkOffset * s), 2, 4, s, "#5DADE2");
    px(ctx, fx(flip ? 9 : 1), oy + 12 * s + (walkOffset * s), s, "#FDEBD0");

    // Pants
    rect(ctx, fx(2), oy + 13 * s, 8, 1, s, "#2E4053");

    // Legs
    if (walkOffset === 0) {
      rect(ctx, fx(3), oy + 14 * s, 3, 1, s, "#2E4053");
      rect(ctx, fx(6), oy + 14 * s, 3, 1, s, "#2E4053");
      rect(ctx, fx(3), oy + 15 * s, 3, 1, s, "#8B4513");
      rect(ctx, fx(6), oy + 15 * s, 3, 1, s, "#8B4513");
    } else {
      rect(ctx, fx(2), oy + 14 * s, 3, 1, s, "#2E4053");
      rect(ctx, fx(7), oy + 14 * s, 3, 1, s, "#2E4053");
      rect(ctx, fx(2), oy + 15 * s, 3, 1, s, "#8B4513");
      rect(ctx, fx(7), oy + 15 * s, 3, 1, s, "#8B4513");
    }
  }
}

// ===== 별이 NPC SPRITE (Female, star-themed) =====

export function drawNPC(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  frame: number,
  scale: number
) {
  const s = scale;
  const ox = screenX + 2 * s;
  const oy = screenY - Math.sin(frame * 0.05) * s; // gentle float

  // Hair (long, golden-brown)
  rect(ctx, ox + 2 * s, oy + 0 * s, 8, 3, s, "#D4A037");
  rect(ctx, ox + 1 * s, oy + 2 * s, 1, 6, s, "#D4A037"); // left long hair
  rect(ctx, ox + 10 * s, oy + 2 * s, 1, 6, s, "#D4A037"); // right long hair
  rect(ctx, ox + 0 * s, oy + 5 * s, 1, 4, s, "#C49030"); // extra long
  rect(ctx, ox + 11 * s, oy + 5 * s, 1, 4, s, "#C49030");

  // Face
  rect(ctx, ox + 2 * s, oy + 3 * s, 8, 5, s, "#FDEBD0");
  // Eyes (larger, expressive)
  rect(ctx, ox + 3 * s, oy + 4 * s, 2, 2, s, "#5D4037");
  rect(ctx, ox + 7 * s, oy + 4 * s, 2, 2, s, "#5D4037");
  px(ctx, ox + 3 * s, oy + 4 * s, s, "#FFF");
  px(ctx, ox + 7 * s, oy + 4 * s, s, "#FFF");
  // Star eye sparkle
  px(ctx, ox + 4 * s, oy + 4 * s, s, "#F4D03F");
  px(ctx, ox + 8 * s, oy + 4 * s, s, "#F4D03F");
  // Blush
  rect(ctx, ox + 2 * s, oy + 6 * s, 2, 1, s, "#F5B7B1");
  rect(ctx, ox + 8 * s, oy + 6 * s, 2, 1, s, "#F5B7B1");
  // Smile
  rect(ctx, ox + 5 * s, oy + 7 * s, 2, 1, s, "#E8A0A0");

  // Star hairpin
  px(ctx, ox + 9 * s, oy + 1 * s, s, "#F4D03F");
  px(ctx, ox + 8 * s, oy + 0 * s, s, "#F4D03F");
  px(ctx, ox + 10 * s, oy + 0 * s, s, "#F4D03F");

  // Neck
  rect(ctx, ox + 4 * s, oy + 8 * s, 4, 1, s, "#FDEBD0");

  // Dress (star-themed, golden-yellow)
  rect(ctx, ox + 1 * s, oy + 9 * s, 10, 5, s, "#F4D03F");
  rect(ctx, ox + 2 * s, oy + 14 * s, 8, 1, s, "#E8C420");
  // Dress details
  rect(ctx, ox + 5 * s, oy + 10 * s, 2, 1, s, "#FFF8E7");
  px(ctx, ox + 4 * s, oy + 12 * s, s, "#E8C420");
  px(ctx, ox + 7 * s, oy + 12 * s, s, "#E8C420");
  // Arms
  rect(ctx, ox + 0 * s, oy + 9 * s, 1, 3, s, "#FDEBD0");
  rect(ctx, ox + 11 * s, oy + 9 * s, 1, 3, s, "#FDEBD0");

  // Shoes
  rect(ctx, ox + 3 * s, oy + 15 * s, 3, 1, s, "#D4A037");
  rect(ctx, ox + 6 * s, oy + 15 * s, 3, 1, s, "#D4A037");

  // Floating star effect above head
  const starY = oy - 4 * s + Math.sin(frame * 0.08) * 2 * s;
  px(ctx, ox + 5 * s, starY, s, "#F4D03F");
  px(ctx, ox + 4 * s, starY + s, s, "#F4D03F");
  px(ctx, ox + 6 * s, starY + s, s, "#F4D03F");
  px(ctx, ox + 5 * s, starY + 2 * s, s, "#F4D03F");
}

// ===== TILE DRAWING =====

const GRASS_COLORS = ["#7EC850", "#6DB840", "#72C048"];
const PATH_COLOR = "#D4C4A0";
const PATH_EDGE = "#C4B490";
const WATER_COLORS = ["#5DADE2", "#4A9BD4", "#54A8DE"];

export function drawTile(
  ctx: CanvasRenderingContext2D,
  tileType: number,
  screenX: number,
  screenY: number,
  tilePixels: number, // TILE_SIZE * scale
  tileX: number, // tile grid position (for variation)
  tileY: number
) {
  const variation = (tileX * 7 + tileY * 13) % 3;

  switch (tileType) {
    case TILE_GRASS:
      ctx.fillStyle = GRASS_COLORS[variation];
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      // Random grass tufts
      if ((tileX + tileY) % 5 === 0) {
        ctx.fillStyle = "#5EA830";
        const s = tilePixels / 16;
        ctx.fillRect(screenX + 4 * s, screenY + 10 * s, 2 * s, 3 * s);
        ctx.fillRect(screenX + 6 * s, screenY + 11 * s, 1 * s, 2 * s);
      }
      break;

    case TILE_DARK_GRASS:
      ctx.fillStyle = "#5EA830";
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      break;

    case TILE_PATH:
      ctx.fillStyle = PATH_COLOR;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      // Subtle edge texture
      ctx.fillStyle = PATH_EDGE;
      const ps = tilePixels / 16;
      if (variation === 0) {
        ctx.fillRect(screenX + 3 * ps, screenY + 7 * ps, 2 * ps, 2 * ps);
      }
      if (variation === 1) {
        ctx.fillRect(screenX + 10 * ps, screenY + 4 * ps, 2 * ps, 2 * ps);
      }
      break;

    case TILE_WATER:
      ctx.fillStyle = WATER_COLORS[variation];
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      // Wave highlight
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      const ws = tilePixels / 16;
      ctx.fillRect(screenX + (variation * 3 + 2) * ws, screenY + 4 * ws, 4 * ws, 1 * ws);
      ctx.fillRect(screenX + (variation * 2 + 5) * ws, screenY + 10 * ws, 3 * ws, 1 * ws);
      break;

    case TILE_WALL:
      ctx.fillStyle = "#B0A090";
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      // Brick lines
      ctx.fillStyle = "#9E9080";
      const bs = tilePixels / 16;
      ctx.fillRect(screenX, screenY + 4 * bs, tilePixels, 1 * bs);
      ctx.fillRect(screenX, screenY + 9 * bs, tilePixels, 1 * bs);
      ctx.fillRect(screenX + 7 * bs, screenY, 1 * bs, 4 * bs);
      ctx.fillRect(screenX + 3 * bs, screenY + 5 * bs, 1 * bs, 4 * bs);
      ctx.fillRect(screenX + 11 * bs, screenY + 5 * bs, 1 * bs, 4 * bs);
      break;

    case TILE_ROOF:
      ctx.fillStyle = "#C0392B";
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      // Roof tile pattern
      ctx.fillStyle = "#A93226";
      const rs = tilePixels / 16;
      for (let i = 0; i < 16; i += 4) {
        ctx.fillRect(screenX + i * rs, screenY + 3 * rs, 2 * rs, 1 * rs);
        ctx.fillRect(screenX + (i + 2) * rs, screenY + 7 * rs, 2 * rs, 1 * rs);
      }
      break;

    case TILE_DOOR:
      // Ground behind door
      ctx.fillStyle = PATH_COLOR;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      // Door frame
      const ds = tilePixels / 16;
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(screenX + 2 * ds, screenY + 0 * ds, 12 * ds, 16 * ds);
      // Door inside
      ctx.fillStyle = "#5D3A1A";
      ctx.fillRect(screenX + 4 * ds, screenY + 2 * ds, 8 * ds, 14 * ds);
      // Doorknob
      ctx.fillStyle = "#F4D03F";
      ctx.fillRect(screenX + 10 * ds, screenY + 9 * ds, 2 * ds, 2 * ds);
      break;

    case TILE_TREE: {
      // Grass base
      ctx.fillStyle = GRASS_COLORS[0];
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      const ts = tilePixels / 16;
      // Trunk
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(screenX + 6 * ts, screenY + 10 * ts, 4 * ts, 6 * ts);
      // Leaves (layered circles of green)
      ctx.fillStyle = "#2E7D32";
      ctx.fillRect(screenX + 2 * ts, screenY + 4 * ts, 12 * ts, 7 * ts);
      ctx.fillRect(screenX + 4 * ts, screenY + 2 * ts, 8 * ts, 3 * ts);
      // Leaf highlight
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(screenX + 4 * ts, screenY + 4 * ts, 4 * ts, 3 * ts);
      ctx.fillRect(screenX + 3 * ts, screenY + 6 * ts, 3 * ts, 2 * ts);
      break;
    }

    case TILE_FLOWERS: {
      ctx.fillStyle = GRASS_COLORS[1];
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      const fs = tilePixels / 16;
      const flowerColors = ["#E74C3C", "#F4D03F", "#9B59B6", "#3498DB"];
      for (let i = 0; i < 4; i++) {
        const fx = (i * 3 + 2 + variation) % 14;
        const fy = (i * 5 + 3) % 12 + 2;
        ctx.fillStyle = flowerColors[i];
        ctx.fillRect(screenX + fx * fs, screenY + fy * fs, 2 * fs, 2 * fs);
        // Stem
        ctx.fillStyle = "#27AE60";
        ctx.fillRect(screenX + fx * fs, screenY + (fy + 2) * fs, 1 * fs, 2 * fs);
      }
      break;
    }

    case TILE_FENCE: {
      ctx.fillStyle = GRASS_COLORS[0];
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      const fes = tilePixels / 16;
      ctx.fillStyle = "#A0522D";
      // Posts
      ctx.fillRect(screenX + 2 * fes, screenY + 4 * fes, 2 * fes, 12 * fes);
      ctx.fillRect(screenX + 12 * fes, screenY + 4 * fes, 2 * fes, 12 * fes);
      // Rails
      ctx.fillRect(screenX, screenY + 6 * fes, 16 * fes, 2 * fes);
      ctx.fillRect(screenX, screenY + 11 * fes, 16 * fes, 2 * fes);
      break;
    }

    case TILE_BRIDGE: {
      ctx.fillStyle = "#A0522D";
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      const brs = tilePixels / 16;
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(screenX, screenY, 2 * brs, tilePixels);
      ctx.fillRect(screenX + 14 * brs, screenY, 2 * brs, tilePixels);
      // Planks
      ctx.fillStyle = "#C49A50";
      for (let i = 0; i < 16; i += 4) {
        ctx.fillRect(screenX + 2 * brs, screenY + i * brs, 12 * brs, 1 * brs);
      }
      break;
    }

    case TILE_SIGN: {
      ctx.fillStyle = GRASS_COLORS[0];
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      const ss = tilePixels / 16;
      // Post
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(screenX + 7 * ss, screenY + 8 * ss, 2 * ss, 8 * ss);
      // Board
      ctx.fillStyle = "#DEB887";
      ctx.fillRect(screenX + 3 * ss, screenY + 3 * ss, 10 * ss, 6 * ss);
      ctx.fillStyle = "#A0522D";
      ctx.fillRect(screenX + 3 * ss, screenY + 3 * ss, 10 * ss, 1 * ss);
      // "!" mark
      ctx.fillStyle = "#2C3E50";
      ctx.fillRect(screenX + 7 * ss, screenY + 5 * ss, 2 * ss, 2 * ss);
      ctx.fillRect(screenX + 7 * ss, screenY + 8 * ss, 2 * ss, 1 * ss);
      break;
    }

    default:
      ctx.fillStyle = "#666";
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
  }
}

// ===== BUILDING DRAWING (colored roofs per zone) =====

export function drawBuildingRoof(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tilePixels: number,
  roofColor: string
) {
  ctx.fillStyle = roofColor;
  ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
  // Roof tile pattern
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  const rs = tilePixels / 16;
  for (let i = 0; i < 16; i += 4) {
    ctx.fillRect(screenX + i * rs, screenY + 4 * rs, 2 * rs, 1 * rs);
    ctx.fillRect(screenX + (i + 2) * rs, screenY + 10 * rs, 2 * rs, 1 * rs);
  }
}

export function drawBuildingWall(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tilePixels: number,
  wallColor: string
) {
  ctx.fillStyle = wallColor;
  ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
  // Brick texture
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  const bs = tilePixels / 16;
  ctx.fillRect(screenX, screenY + 5 * bs, tilePixels, 1 * bs);
  ctx.fillRect(screenX, screenY + 11 * bs, tilePixels, 1 * bs);
  ctx.fillRect(screenX + 8 * bs, screenY, 1 * bs, 5 * bs);
  ctx.fillRect(screenX + 4 * bs, screenY + 6 * bs, 1 * bs, 5 * bs);
}

export function drawBuildingDoor(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tilePixels: number,
  accentColor: string
) {
  // Wall background
  ctx.fillStyle = "#B0A090";
  ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

  const ds = tilePixels / 16;
  // Door frame
  ctx.fillStyle = accentColor;
  ctx.fillRect(screenX + 2 * ds, screenY + 0, 12 * ds, tilePixels);
  // Door inside
  ctx.fillStyle = "#3D2A10";
  ctx.fillRect(screenX + 4 * ds, screenY + 2 * ds, 8 * ds, 14 * ds);
  // Doorknob
  ctx.fillStyle = "#F4D03F";
  ctx.fillRect(screenX + 10 * ds, screenY + 9 * ds, 2 * ds, 2 * ds);
}

// ===== ZONE NAME SIGN =====

export function drawZoneSign(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tilePixels: number,
  emoji: string,
  name: string
) {
  const centerX = screenX + tilePixels / 2;
  const topY = screenY - tilePixels * 0.3;

  // Background pill
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  const textWidth = name.length * 7 + 24;
  ctx.fillRect(centerX - textWidth / 2, topY, textWidth, 18);

  // Border
  ctx.strokeStyle = "#F4D03F";
  ctx.lineWidth = 1;
  ctx.strokeRect(centerX - textWidth / 2, topY, textWidth, 18);

  // Text
  ctx.fillStyle = "#FFF";
  ctx.font = "10px 'Galmuri11', monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${emoji} ${name}`, centerX, topY + 13);
  ctx.textAlign = "start"; // reset
}

// ===== INTERACTION TOOLTIP =====

export function drawTooltip(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  text: string,
  frame: number
) {
  const bob = Math.sin(frame * 0.1) * 2;
  const y = screenY - 20 + bob;
  const width = text.length * 7 + 16;
  const x = screenX - width / 2;

  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(x, y, width, 18);
  ctx.strokeStyle = "#F4D03F";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, 18);

  ctx.fillStyle = "#FFF";
  ctx.font = "10px 'Galmuri11', monospace";
  ctx.textAlign = "center";
  ctx.fillText(text, screenX, y + 13);
  ctx.textAlign = "start";
}

// ===== WINDOW on building wall =====

export function drawWindow(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tilePixels: number,
  wallColor: string,
  lit: boolean
) {
  // Wall
  drawBuildingWall(ctx, screenX, screenY, tilePixels, wallColor);
  // Window
  const ws = tilePixels / 16;
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(screenX + 4 * ws, screenY + 3 * ws, 8 * ws, 8 * ws);
  ctx.fillStyle = lit ? "#FFF8DC" : "#4A6FA5";
  ctx.fillRect(screenX + 5 * ws, screenY + 4 * ws, 6 * ws, 6 * ws);
  // Cross frame
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(screenX + 7.5 * ws, screenY + 4 * ws, 1 * ws, 6 * ws);
  ctx.fillRect(screenX + 5 * ws, screenY + 6.5 * ws, 6 * ws, 1 * ws);
}
