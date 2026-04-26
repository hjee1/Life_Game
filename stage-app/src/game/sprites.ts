// === Pixel Art Sprite System — Stardew Valley Quality ===
// Rich detailed tiles with shading, texture variation, and depth

import {
  Direction, DIR_DOWN, DIR_UP, DIR_LEFT, DIR_RIGHT,
  TILE_GRASS, TILE_PATH, TILE_WATER, TILE_WALL,
  TILE_DOOR, TILE_TREE, TILE_FLOWERS, TILE_FENCE, TILE_BRIDGE,
  TILE_DARK_GRASS, TILE_SIGN,
} from "./types";

// ===== PALETTE =====
const C = {
  // Grass
  grass1: "#5a9e2f", grass2: "#4e8c28", grass3: "#6aae3d", grass4: "#3d7a1e",
  grassDark1: "#3d7a1e", grassDark2: "#327015",
  // Dirt/Path
  dirt1: "#c4a46c", dirt2: "#b8975e", dirt3: "#d4b47c", dirt4: "#a88a52",
  dirtEdge: "#9e7e48",
  // Water
  water1: "#3d8ec9", water2: "#4da0db", water3: "#2d7ab5", waterHL: "#7ec8f0",
  waterDark: "#2668a0",
  // Wood
  wood1: "#8b6914", wood2: "#a07828", wood3: "#6b5010", woodDark: "#5a4010",
  // Leaves
  leaf1: "#2d7d32", leaf2: "#388e3c", leaf3: "#1b5e20", leaf4: "#4caf50",
  leafHL: "#66bb6a",
  // Stone/Wall
  stone1: "#a09080", stone2: "#b0a090", stone3: "#908070", stone4: "#c0b0a0",
  stoneEdge: "#706050",
  // Skin
  skin: "#fdebd0", skinShade: "#f0d4a8", blush: "#f5b7b1",
  // Hair
  hair1: "#1a1a2e", hair2: "#16213e",
  // Clothes
  hoodie: "#5dade2", hoodieDark: "#3498db", hoodieHL: "#85c1e9",
  pants: "#2e4053", pantsDark: "#273746",
  shoes: "#8b4513", shoeHL: "#a0522d",
  // UI
  gold: "#f4d03f", goldDark: "#d4a017",
  red: "#e74c3c",
};

// Helper functions
function px(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, s, s);
}

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, s: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * s, h * s);
}

// Seeded random for consistent tile variation
function seedRand(x: number, y: number, seed: number = 0): number {
  let h = (x * 374761393 + y * 668265263 + seed) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return (h & 0x7fffffff) / 0x7fffffff;
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
  const s = scale;
  const ox = screenX + 2 * s;
  const oy = screenY;
  const walking = true; // always draw with current frame
  const step = frame % 4; // 4-frame walk cycle

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(ox + 6 * s, oy + 16 * s, 5 * s, 1.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Leg offsets for walk cycle
  const legOffsets = [
    [0, 0],   // frame 0: neutral
    [-1, 1],  // frame 1: left forward
    [0, 0],   // frame 2: neutral
    [1, -1],  // frame 3: right forward
  ][step];

  if (dir === DIR_DOWN) {
    // Hair
    rect(ctx, ox + 2 * s, oy + 0 * s, 8, 2, s, C.hair1);
    rect(ctx, ox + 1 * s, oy + 1 * s, 10, 2, s, C.hair1);
    rect(ctx, ox + 1 * s, oy + 3 * s, 1, 2, s, C.hair2); // sideburn L
    rect(ctx, ox + 10 * s, oy + 3 * s, 1, 2, s, C.hair2); // sideburn R

    // Face
    rect(ctx, ox + 2 * s, oy + 2 * s, 8, 6, s, C.skin);
    rect(ctx, ox + 1 * s, oy + 3 * s, 1, 3, s, C.skinShade); // left cheek shadow

    // Eyes - larger, more expressive
    rect(ctx, ox + 3 * s, oy + 4 * s, 2, 2, s, "#2c3e50");
    rect(ctx, ox + 7 * s, oy + 4 * s, 2, 2, s, "#2c3e50");
    px(ctx, ox + 3 * s, oy + 4 * s, s, "#fff"); // highlight L
    px(ctx, ox + 7 * s, oy + 4 * s, s, "#fff"); // highlight R

    // Blush
    px(ctx, ox + 2 * s, oy + 6 * s, s, C.blush);
    px(ctx, ox + 9 * s, oy + 6 * s, s, C.blush);

    // Mouth
    px(ctx, ox + 5 * s, oy + 7 * s, s, "#d4796a");
    px(ctx, ox + 6 * s, oy + 7 * s, s, "#d4796a");

    // Neck
    rect(ctx, ox + 4 * s, oy + 8 * s, 4, 1, s, C.skinShade);

    // Hoodie body
    rect(ctx, ox + 1 * s, oy + 9 * s, 10, 4, s, C.hoodie);
    rect(ctx, ox + 2 * s, oy + 9 * s, 8, 1, s, C.hoodieHL); // collar highlight
    rect(ctx, ox + 5 * s, oy + 9 * s, 2, 4, s, C.hoodieDark); // zipper
    px(ctx, ox + 5 * s, oy + 10 * s, s, C.gold); // zipper pull

    // Arms
    rect(ctx, ox + 0 * s, oy + 9 * s, 1, 4, s, C.hoodie);
    rect(ctx, ox + 11 * s, oy + 9 * s, 1, 4, s, C.hoodie);
    px(ctx, ox + 0 * s, oy + 12 * s, s, C.skin); // hand L
    px(ctx, ox + 11 * s, oy + 12 * s, s, C.skin); // hand R

    // Pants
    rect(ctx, ox + 2 * s, oy + 13 * s, 8, 1, s, C.pants);

    // Legs (animated)
    const ll = legOffsets[0];
    const lr = legOffsets[1];
    rect(ctx, ox + (2 + ll) * s, oy + 14 * s, 3, 1, s, C.pants);
    rect(ctx, ox + (7 + lr) * s, oy + 14 * s, 3, 1, s, C.pants);

    // Shoes
    rect(ctx, ox + (2 + ll) * s, oy + 15 * s, 3, 1, s, C.shoes);
    rect(ctx, ox + (7 + lr) * s, oy + 15 * s, 3, 1, s, C.shoes);
    px(ctx, ox + (2 + ll) * s, oy + 15 * s, s, C.shoeHL);
    px(ctx, ox + (7 + lr) * s, oy + 15 * s, s, C.shoeHL);

  } else if (dir === DIR_UP) {
    // Back of head
    rect(ctx, ox + 2 * s, oy + 0 * s, 8, 3, s, C.hair1);
    rect(ctx, ox + 1 * s, oy + 1 * s, 10, 3, s, C.hair1);
    rect(ctx, ox + 2 * s, oy + 3 * s, 8, 5, s, C.hair2); // back hair
    rect(ctx, ox + 1 * s, oy + 3 * s, 1, 4, s, C.hair1);
    rect(ctx, ox + 10 * s, oy + 3 * s, 1, 4, s, C.hair1);

    // Neck
    rect(ctx, ox + 4 * s, oy + 8 * s, 4, 1, s, C.skinShade);

    // Hoodie (back)
    rect(ctx, ox + 1 * s, oy + 9 * s, 10, 4, s, C.hoodie);
    rect(ctx, ox + 4 * s, oy + 9 * s, 4, 2, s, C.hoodieDark); // hood
    rect(ctx, ox + 0 * s, oy + 9 * s, 1, 4, s, C.hoodie);
    rect(ctx, ox + 11 * s, oy + 9 * s, 1, 4, s, C.hoodie);

    // Pants + legs
    rect(ctx, ox + 2 * s, oy + 13 * s, 8, 1, s, C.pants);
    const ll = legOffsets[0];
    const lr = legOffsets[1];
    rect(ctx, ox + (2 + ll) * s, oy + 14 * s, 3, 1, s, C.pantsDark);
    rect(ctx, ox + (7 + lr) * s, oy + 14 * s, 3, 1, s, C.pantsDark);
    rect(ctx, ox + (2 + ll) * s, oy + 15 * s, 3, 1, s, C.shoes);
    rect(ctx, ox + (7 + lr) * s, oy + 15 * s, 3, 1, s, C.shoes);

  } else {
    // LEFT / RIGHT
    const flip = dir === DIR_RIGHT;
    const fx = (lx: number) => flip ? screenX + (15 - lx) * s : screenX + lx * s;

    // Hair
    for (let i = 3; i <= 10; i++) rect(ctx, fx(i), oy + 0 * s, 1, 2, s, C.hair1);
    for (let i = 2; i <= 11; i++) rect(ctx, fx(i), oy + 1 * s, 1, 2, s, C.hair1);
    rect(ctx, fx(2), oy + 3 * s, 1, 3, s, C.hair2); // sideburn

    // Face
    for (let i = 3; i <= 10; i++) rect(ctx, fx(i), oy + 2 * s, 1, 6, s, C.skin);
    rect(ctx, fx(flip ? 4 : 9), oy + 3 * s, 1, 4, s, C.skinShade);

    // Eye (one visible)
    rect(ctx, fx(flip ? 5 : 7), oy + 4 * s, 1, 2, s, "#2c3e50");
    rect(ctx, fx(flip ? 6 : 8), oy + 4 * s, 1, 2, s, "#2c3e50");
    px(ctx, fx(flip ? 5 : 8), oy + 4 * s, s, "#fff");

    // Mouth
    px(ctx, fx(flip ? 5 : 8), oy + 7 * s, s, "#d4796a");

    // Neck
    rect(ctx, fx(5), oy + 8 * s, 1, 1, s, C.skinShade);
    rect(ctx, fx(6), oy + 8 * s, 1, 1, s, C.skinShade);
    rect(ctx, fx(7), oy + 8 * s, 1, 1, s, C.skinShade);

    // Hoodie
    for (let i = 2; i <= 11; i++) rect(ctx, fx(i), oy + 9 * s, 1, 4, s, C.hoodie);
    rect(ctx, fx(6), oy + 9 * s, 1, 4, s, C.hoodieDark); // zipper line

    // Arm (swinging with walk)
    const armSwing = step % 2 === 0 ? 0 : 1;
    rect(ctx, fx(flip ? 10 : 2), oy + (9 + armSwing) * s, 1, 4, s, C.hoodie);
    px(ctx, fx(flip ? 10 : 2), oy + (12 + armSwing) * s, s, C.skin);

    // Pants + legs
    for (let i = 3; i <= 10; i++) rect(ctx, fx(i), oy + 13 * s, 1, 1, s, C.pants);
    const ll = legOffsets[0];
    const lr = legOffsets[1];
    rect(ctx, fx(4 + ll), oy + 14 * s, 1, 1, s, C.pants);
    rect(ctx, fx(5 + ll), oy + 14 * s, 1, 1, s, C.pants);
    rect(ctx, fx(7 + lr), oy + 14 * s, 1, 1, s, C.pants);
    rect(ctx, fx(8 + lr), oy + 14 * s, 1, 1, s, C.pants);

    // Shoes
    rect(ctx, fx(4 + ll), oy + 15 * s, 1, 1, s, C.shoes);
    rect(ctx, fx(5 + ll), oy + 15 * s, 1, 1, s, C.shoeHL);
    rect(ctx, fx(7 + lr), oy + 15 * s, 1, 1, s, C.shoes);
    rect(ctx, fx(8 + lr), oy + 15 * s, 1, 1, s, C.shoeHL);
  }
}

// ===== 별이 NPC (Female, star-themed) =====

export function drawNPC(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  frame: number,
  scale: number
) {
  const s = scale;
  const ox = screenX + 2 * s;
  const floatY = Math.sin(frame * 0.04) * 1.5 * s;
  const oy = screenY + floatY;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(ox + 6 * s, screenY + 16 * s, 5 * s, 1.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Long hair (golden)
  rect(ctx, ox + 2 * s, oy + 0 * s, 8, 2, s, "#D4A037");
  rect(ctx, ox + 1 * s, oy + 1 * s, 10, 3, s, "#D4A037");
  rect(ctx, ox + 0 * s, oy + 3 * s, 1, 7, s, "#C49030"); // long hair L
  rect(ctx, ox + 1 * s, oy + 4 * s, 1, 6, s, "#D4A037");
  rect(ctx, ox + 10 * s, oy + 3 * s, 1, 7, s, "#C49030"); // long hair R
  rect(ctx, ox + 11 * s, oy + 4 * s, 1, 6, s, "#D4A037");

  // Star hairpin
  px(ctx, ox + 9 * s, oy + 1 * s, s, C.gold);
  px(ctx, ox + 8 * s, oy + 0 * s, s, C.gold);
  px(ctx, ox + 10 * s, oy + 0 * s, s, C.gold);
  px(ctx, ox + 9 * s, oy + 2 * s, s, C.goldDark);

  // Face
  rect(ctx, ox + 2 * s, oy + 3 * s, 8, 5, s, C.skin);

  // Eyes (sparkly)
  rect(ctx, ox + 3 * s, oy + 4 * s, 2, 2, s, "#5D4037");
  rect(ctx, ox + 7 * s, oy + 4 * s, 2, 2, s, "#5D4037");
  px(ctx, ox + 3 * s, oy + 4 * s, s, "#FFF");
  px(ctx, ox + 7 * s, oy + 4 * s, s, "#FFF");
  // Star sparkle in eyes
  px(ctx, ox + 4 * s, oy + 4 * s, s, C.gold);
  px(ctx, ox + 8 * s, oy + 4 * s, s, C.gold);

  // Blush
  rect(ctx, ox + 2 * s, oy + 6 * s, 2, 1, s, "#F5B7B1");
  rect(ctx, ox + 8 * s, oy + 6 * s, 2, 1, s, "#F5B7B1");

  // Smile
  px(ctx, ox + 5 * s, oy + 7 * s, s, "#E8A0A0");
  px(ctx, ox + 6 * s, oy + 7 * s, s, "#E8A0A0");

  // Dress (star yellow with white accents)
  rect(ctx, ox + 1 * s, oy + 8 * s, 10, 6, s, C.gold);
  rect(ctx, ox + 2 * s, oy + 8 * s, 8, 1, s, "#F9E154"); // collar HL
  rect(ctx, ox + 4 * s, oy + 10 * s, 4, 1, s, "#FFF8E7"); // belt detail
  rect(ctx, ox + 2 * s, oy + 13 * s, 8, 1, s, C.goldDark); // hem
  // Skirt flare
  rect(ctx, ox + 0 * s, oy + 12 * s, 1, 2, s, C.gold);
  rect(ctx, ox + 11 * s, oy + 12 * s, 1, 2, s, C.gold);

  // Arms
  px(ctx, ox + 0 * s, oy + 9 * s, s, C.skin);
  px(ctx, ox + 11 * s, oy + 9 * s, s, C.skin);

  // Shoes (cute)
  rect(ctx, ox + 3 * s, oy + 14 * s, 3, 1, s, "#D4A037");
  rect(ctx, ox + 6 * s, oy + 14 * s, 3, 1, s, "#D4A037");
  rect(ctx, ox + 2 * s, oy + 15 * s, 4, 1, s, "#C49030");
  rect(ctx, ox + 6 * s, oy + 15 * s, 4, 1, s, "#C49030");

  // Floating star above (animated)
  const starFrame = Math.floor(frame / 20) % 4;
  const starScale = [1, 1.2, 1, 0.8][starFrame];
  const starY = oy - 5 * s + Math.sin(frame * 0.06) * 2 * s;
  const starX = ox + 5 * s;
  ctx.fillStyle = C.gold;
  const ss = s * starScale;
  ctx.fillRect(starX + ss, starY, ss, ss * 3); // vertical
  ctx.fillRect(starX, starY + ss, ss * 3, ss); // horizontal
}

// ===== TILE DRAWING — Rich Stardew-style textures =====

export function drawTile(
  ctx: CanvasRenderingContext2D,
  tileType: number,
  screenX: number,
  screenY: number,
  tilePixels: number,
  tileX: number,
  tileY: number
) {
  const s = tilePixels / 16;
  const r = seedRand(tileX, tileY);
  const r2 = seedRand(tileX, tileY, 42);
  const r3 = seedRand(tileX, tileY, 99);

  switch (tileType) {
    case TILE_GRASS: {
      // Base green with variation
      ctx.fillStyle = r < 0.4 ? C.grass1 : r < 0.7 ? C.grass2 : C.grass3;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Subtle darker patches
      ctx.fillStyle = C.grass4;
      const px1 = Math.floor(r * 12);
      const py1 = Math.floor(r2 * 12);
      ctx.fillRect(screenX + px1 * s, screenY + py1 * s, 3 * s, 2 * s);

      // Grass blades / tufts (varied positions)
      ctx.fillStyle = C.grass3;
      if (r < 0.3) {
        ctx.fillRect(screenX + 3 * s, screenY + 8 * s, 1 * s, 3 * s);
        ctx.fillRect(screenX + 4 * s, screenY + 7 * s, 1 * s, 2 * s);
        ctx.fillRect(screenX + 5 * s, screenY + 9 * s, 1 * s, 2 * s);
      }
      if (r2 > 0.6) {
        ctx.fillStyle = C.grass4;
        ctx.fillRect(screenX + 10 * s, screenY + 5 * s, 1 * s, 2 * s);
        ctx.fillRect(screenX + 11 * s, screenY + 4 * s, 1 * s, 3 * s);
      }
      // Occasional tiny flower
      if (r3 > 0.92) {
        ctx.fillStyle = r < 0.5 ? "#fff" : "#f9e154";
        ctx.fillRect(screenX + Math.floor(r * 12) * s, screenY + Math.floor(r2 * 10 + 2) * s, 2 * s, 2 * s);
      }
      break;
    }

    case TILE_DARK_GRASS: {
      ctx.fillStyle = C.grassDark1;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
      ctx.fillStyle = C.grassDark2;
      ctx.fillRect(screenX + Math.floor(r * 10) * s, screenY + Math.floor(r2 * 10) * s, 4 * s, 3 * s);
      break;
    }

    case TILE_PATH: {
      // Dirt path base
      ctx.fillStyle = C.dirt1;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Subtle color variation patches
      ctx.fillStyle = C.dirt2;
      ctx.fillRect(screenX + Math.floor(r * 8) * s, screenY + Math.floor(r2 * 8) * s, 6 * s, 4 * s);
      ctx.fillStyle = C.dirt3;
      ctx.fillRect(screenX + Math.floor(r3 * 10) * s, screenY + Math.floor(r * 10 + 2) * s, 4 * s, 3 * s);

      // Small pebbles
      ctx.fillStyle = C.stone1;
      if (r < 0.4) {
        ctx.fillRect(screenX + 4 * s, screenY + 11 * s, 2 * s, 1 * s);
      }
      if (r2 > 0.5) {
        ctx.fillRect(screenX + 10 * s, screenY + 5 * s, 1 * s, 1 * s);
      }
      if (r3 < 0.3) {
        ctx.fillStyle = C.dirt4;
        ctx.fillRect(screenX + 7 * s, screenY + 8 * s, 2 * s, 2 * s);
      }
      break;
    }

    case TILE_WATER: {
      // Animated water base
      const phase = (tileX + tileY) % 3;
      ctx.fillStyle = phase === 0 ? C.water1 : phase === 1 ? C.water2 : C.water3;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Darker depth
      ctx.fillStyle = C.waterDark;
      ctx.fillRect(screenX + 2 * s, screenY + 8 * s, 12 * s, 4 * s);

      // Wave highlights (offset by position for animation feel)
      ctx.fillStyle = C.waterHL;
      const waveOff = (tileX * 3 + tileY * 5) % 12;
      ctx.fillRect(screenX + waveOff * s, screenY + 3 * s, 4 * s, 1 * s);
      ctx.fillRect(screenX + ((waveOff + 6) % 14) * s, screenY + 9 * s, 3 * s, 1 * s);

      // Sparkle
      if (r > 0.7) {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(screenX + Math.floor(r * 12) * s, screenY + Math.floor(r2 * 12) * s, 1 * s, 1 * s);
      }
      break;
    }

    case TILE_WALL: {
      // Stone wall with proper brick pattern
      ctx.fillStyle = C.stone2;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Brick rows
      for (let row = 0; row < 4; row++) {
        const rowY = screenY + row * 4 * s;
        ctx.fillStyle = C.stone3;
        ctx.fillRect(screenX, rowY + 3 * s, tilePixels, 1 * s); // mortar line

        // Brick offset pattern
        const offset = row % 2 === 0 ? 0 : 4;
        ctx.fillStyle = C.stoneEdge;
        for (let bx = offset; bx < 16; bx += 8) {
          ctx.fillRect(screenX + bx * s, rowY, 1 * s, 3 * s);
        }
      }

      // Subtle variation
      ctx.fillStyle = C.stone4;
      ctx.fillRect(screenX + Math.floor(r * 10) * s, screenY + Math.floor(r2 * 10) * s, 3 * s, 3 * s);
      break;
    }

    case TILE_DOOR: {
      // Ground
      ctx.fillStyle = C.dirt1;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Door frame (darker wood)
      ctx.fillStyle = C.woodDark;
      ctx.fillRect(screenX + 2 * s, screenY, 12 * s, 16 * s);

      // Door panels
      ctx.fillStyle = C.wood1;
      ctx.fillRect(screenX + 3 * s, screenY + 1 * s, 10 * s, 14 * s);

      // Door detail (panels)
      ctx.fillStyle = C.wood3;
      ctx.fillRect(screenX + 4 * s, screenY + 2 * s, 4 * s, 5 * s);
      ctx.fillRect(screenX + 9 * s, screenY + 2 * s, 3 * s, 5 * s);
      ctx.fillRect(screenX + 4 * s, screenY + 9 * s, 4 * s, 5 * s);
      ctx.fillRect(screenX + 9 * s, screenY + 9 * s, 3 * s, 5 * s);

      // Doorknob
      ctx.fillStyle = C.gold;
      ctx.fillRect(screenX + 10 * s, screenY + 8 * s, 2 * s, 2 * s);
      ctx.fillStyle = C.goldDark;
      px(ctx, screenX + 11 * s, screenY + 9 * s, s, C.goldDark);

      // Welcome mat
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(screenX + 4 * s, screenY + 15 * s, 8 * s, 1 * s);
      break;
    }

    case TILE_TREE: {
      // Grass base
      ctx.fillStyle = C.grass2;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Trunk with bark texture
      ctx.fillStyle = C.wood1;
      ctx.fillRect(screenX + 6 * s, screenY + 9 * s, 4 * s, 7 * s);
      ctx.fillStyle = C.wood3;
      ctx.fillRect(screenX + 7 * s, screenY + 10 * s, 1 * s, 5 * s); // bark line
      ctx.fillStyle = C.wood2;
      ctx.fillRect(screenX + 9 * s, screenY + 11 * s, 1 * s, 3 * s); // highlight

      // Root base
      ctx.fillStyle = C.wood3;
      ctx.fillRect(screenX + 5 * s, screenY + 14 * s, 1 * s, 2 * s);
      ctx.fillRect(screenX + 10 * s, screenY + 14 * s, 1 * s, 2 * s);

      // Canopy layers (dark → light, bottom → top for depth)
      ctx.fillStyle = C.leaf3; // darkest layer
      ctx.fillRect(screenX + 1 * s, screenY + 5 * s, 14 * s, 6 * s);
      ctx.fillRect(screenX + 3 * s, screenY + 3 * s, 10 * s, 3 * s);

      ctx.fillStyle = C.leaf1; // mid layer
      ctx.fillRect(screenX + 2 * s, screenY + 4 * s, 12 * s, 5 * s);
      ctx.fillRect(screenX + 4 * s, screenY + 2 * s, 8 * s, 3 * s);

      ctx.fillStyle = C.leaf2; // light patches
      ctx.fillRect(screenX + 3 * s, screenY + 4 * s, 5 * s, 3 * s);
      ctx.fillRect(screenX + 6 * s, screenY + 3 * s, 4 * s, 2 * s);

      ctx.fillStyle = C.leaf4; // highlights
      ctx.fillRect(screenX + 4 * s, screenY + 3 * s, 3 * s, 2 * s);
      ctx.fillRect(screenX + 9 * s, screenY + 5 * s, 2 * s, 2 * s);

      ctx.fillStyle = C.leafHL; // top highlight
      px(ctx, screenX + 5 * s, screenY + 3 * s, s, C.leafHL);
      px(ctx, screenX + 7 * s, screenY + 2 * s, s, C.leafHL);

      // Shadow on ground
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(screenX + 2 * s, screenY + 12 * s, 12 * s, 2 * s);
      break;
    }

    case TILE_FLOWERS: {
      // Grass base
      ctx.fillStyle = C.grass1;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Multiple flowers with stems
      const flowers = [
        { x: 2, y: 6, color: "#e74c3c" },
        { x: 6, y: 4, color: "#f4d03f" },
        { x: 10, y: 7, color: "#9b59b6" },
        { x: 4, y: 10, color: "#3498db" },
        { x: 12, y: 11, color: "#e74c3c" },
        { x: 8, y: 12, color: "#f39c12" },
      ];
      for (const f of flowers) {
        // Stem
        ctx.fillStyle = "#27ae60";
        ctx.fillRect(screenX + f.x * s, screenY + (f.y + 2) * s, 1 * s, 3 * s);
        // Leaf
        px(ctx, screenX + (f.x + 1) * s, screenY + (f.y + 3) * s, s, "#2ecc71");
        // Flower head
        ctx.fillStyle = f.color;
        ctx.fillRect(screenX + (f.x - 1) * s, screenY + f.y * s, 3 * s, 2 * s);
        // Center
        px(ctx, screenX + f.x * s, screenY + f.y * s, s, "#f9e154");
      }
      break;
    }

    case TILE_FENCE: {
      ctx.fillStyle = C.grass1;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Fence posts with wood texture
      ctx.fillStyle = C.wood2;
      ctx.fillRect(screenX + 1 * s, screenY + 3 * s, 3 * s, 13 * s);
      ctx.fillRect(screenX + 12 * s, screenY + 3 * s, 3 * s, 13 * s);
      // Post caps
      ctx.fillStyle = C.wood1;
      ctx.fillRect(screenX + 1 * s, screenY + 3 * s, 3 * s, 2 * s);
      ctx.fillRect(screenX + 12 * s, screenY + 3 * s, 3 * s, 2 * s);
      // Rails
      ctx.fillStyle = C.wood2;
      ctx.fillRect(screenX, screenY + 6 * s, 16 * s, 2 * s);
      ctx.fillRect(screenX, screenY + 11 * s, 16 * s, 2 * s);
      // Rail highlights
      ctx.fillStyle = C.wood1;
      ctx.fillRect(screenX, screenY + 6 * s, 16 * s, 1 * s);
      ctx.fillRect(screenX, screenY + 11 * s, 16 * s, 1 * s);
      // Wood grain
      ctx.fillStyle = C.wood3;
      ctx.fillRect(screenX + 2 * s, screenY + 5 * s, 1 * s, 8 * s);
      ctx.fillRect(screenX + 13 * s, screenY + 5 * s, 1 * s, 8 * s);
      break;
    }

    case TILE_BRIDGE: {
      // Water underneath
      ctx.fillStyle = C.water1;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Bridge planks
      ctx.fillStyle = C.wood2;
      ctx.fillRect(screenX + 1 * s, screenY, 14 * s, tilePixels);

      // Plank lines
      ctx.fillStyle = C.wood3;
      for (let py = 0; py < 16; py += 3) {
        ctx.fillRect(screenX + 1 * s, screenY + py * s, 14 * s, 1 * s);
      }

      // Rails
      ctx.fillStyle = C.wood1;
      ctx.fillRect(screenX, screenY, 2 * s, tilePixels);
      ctx.fillRect(screenX + 14 * s, screenY, 2 * s, tilePixels);

      // Nail details
      ctx.fillStyle = C.stoneEdge;
      px(ctx, screenX + 1 * s, screenY + 2 * s, s, C.stoneEdge);
      px(ctx, screenX + 14 * s, screenY + 5 * s, s, C.stoneEdge);
      px(ctx, screenX + 1 * s, screenY + 8 * s, s, C.stoneEdge);
      px(ctx, screenX + 14 * s, screenY + 11 * s, s, C.stoneEdge);
      break;
    }

    case TILE_SIGN: {
      ctx.fillStyle = C.grass1;
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);

      // Post
      ctx.fillStyle = C.wood2;
      ctx.fillRect(screenX + 7 * s, screenY + 8 * s, 2 * s, 8 * s);

      // Sign board
      ctx.fillStyle = "#DEB887";
      ctx.fillRect(screenX + 2 * s, screenY + 2 * s, 12 * s, 7 * s);
      // Frame
      ctx.fillStyle = C.wood1;
      ctx.fillRect(screenX + 2 * s, screenY + 2 * s, 12 * s, 1 * s);
      ctx.fillRect(screenX + 2 * s, screenY + 8 * s, 12 * s, 1 * s);
      ctx.fillRect(screenX + 2 * s, screenY + 2 * s, 1 * s, 7 * s);
      ctx.fillRect(screenX + 13 * s, screenY + 2 * s, 1 * s, 7 * s);

      // "!" text
      ctx.fillStyle = "#2C3E50";
      ctx.fillRect(screenX + 7 * s, screenY + 4 * s, 2 * s, 2 * s);
      ctx.fillRect(screenX + 7 * s, screenY + 7 * s, 2 * s, 1 * s);
      break;
    }

    default:
      ctx.fillStyle = "#444";
      ctx.fillRect(screenX, screenY, tilePixels, tilePixels);
  }
}

// ===== BUILDING TILES (zone-colored) =====

export function drawBuildingRoof(
  ctx: CanvasRenderingContext2D, x: number, y: number, tp: number, color: string
) {
  const s = tp / 16;
  // Darken for depth
  ctx.fillStyle = color;
  ctx.fillRect(x, y, tp, tp);

  // Shingle rows
  for (let row = 0; row < 4; row++) {
    const ry = y + row * 4 * s;
    const offset = row % 2 === 0 ? 0 : 4;
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(x, ry + 3 * s, tp, 1 * s);
    for (let bx = offset; bx < 16; bx += 8) {
      ctx.fillRect(x + bx * s, ry, 1 * s, 3 * s);
    }
  }
  // Highlight on top
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(x, y, tp, 2 * s);
}

export function drawBuildingWall(
  ctx: CanvasRenderingContext2D, x: number, y: number, tp: number, color: string
) {
  const s = tp / 16;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, tp, tp);

  // Brick pattern
  for (let row = 0; row < 4; row++) {
    const ry = y + row * 4 * s;
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(x, ry + 3 * s, tp, 1 * s);
    const offset = row % 2 === 0 ? 0 : 4;
    for (let bx = offset; bx < 16; bx += 8) {
      ctx.fillRect(x + bx * s, ry, 1 * s, 3 * s);
    }
  }
}

export function drawBuildingDoor(
  ctx: CanvasRenderingContext2D, x: number, y: number, tp: number, accent: string
) {
  const s = tp / 16;
  ctx.fillStyle = C.dirt1;
  ctx.fillRect(x, y, tp, tp);

  // Door frame
  ctx.fillStyle = accent;
  ctx.fillRect(x + 2 * s, y, 12 * s, tp);
  // Door wood
  ctx.fillStyle = C.wood1;
  ctx.fillRect(x + 3 * s, y + 1 * s, 10 * s, 14 * s);
  ctx.fillStyle = C.wood3;
  ctx.fillRect(x + 4 * s, y + 2 * s, 4 * s, 5 * s);
  ctx.fillRect(x + 9 * s, y + 2 * s, 3 * s, 5 * s);
  ctx.fillRect(x + 4 * s, y + 9 * s, 4 * s, 5 * s);
  ctx.fillRect(x + 9 * s, y + 9 * s, 3 * s, 5 * s);
  // Doorknob
  ctx.fillStyle = C.gold;
  ctx.fillRect(x + 10 * s, y + 8 * s, 2 * s, 2 * s);
}

export function drawWindow(
  ctx: CanvasRenderingContext2D, x: number, y: number, tp: number,
  wallColor: string, lit: boolean
) {
  drawBuildingWall(ctx, x, y, tp, wallColor);
  const s = tp / 16;
  // Window frame
  ctx.fillStyle = C.wood1;
  ctx.fillRect(x + 3 * s, y + 2 * s, 10 * s, 10 * s);
  // Glass
  ctx.fillStyle = lit ? "#FFF8DC" : "#4A6FA5";
  ctx.fillRect(x + 4 * s, y + 3 * s, 8 * s, 8 * s);
  // Cross frame
  ctx.fillStyle = C.wood1;
  ctx.fillRect(x + 7.5 * s, y + 3 * s, 1 * s, 8 * s);
  ctx.fillRect(x + 4 * s, y + 6.5 * s, 8 * s, 1 * s);
  // Curtain hint
  if (lit) {
    ctx.fillStyle = "rgba(255,200,100,0.3)";
    ctx.fillRect(x + 4 * s, y + 3 * s, 2 * s, 8 * s);
  }
  // Sill
  ctx.fillStyle = C.wood2;
  ctx.fillRect(x + 3 * s, y + 12 * s, 10 * s, 1 * s);
}

// ===== ZONE SIGN =====

export function drawZoneSign(
  ctx: CanvasRenderingContext2D, x: number, y: number, tp: number,
  emoji: string, name: string
) {
  const centerX = x + tp / 2;
  const topY = y - tp * 0.35;
  const textWidth = name.length * 8 + 28;

  // Sign background
  ctx.fillStyle = "rgba(20,15,10,0.85)";
  const rx = centerX - textWidth / 2;
  ctx.fillRect(rx, topY, textWidth, 20);

  // Gold border
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(rx, topY, textWidth, 20);

  // Text
  ctx.fillStyle = "#FFF";
  ctx.font = "11px 'Galmuri11', monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${emoji} ${name}`, centerX, topY + 14);
  ctx.textAlign = "start";
}

// ===== TOOLTIP =====

export function drawTooltip(
  ctx: CanvasRenderingContext2D, x: number, y: number,
  text: string, frame: number
) {
  const bob = Math.sin(frame * 0.08) * 3;
  const ty = y - 24 + bob;
  const width = text.length * 7 + 20;
  const tx = x - width / 2;

  ctx.fillStyle = "rgba(20,15,10,0.85)";
  ctx.fillRect(tx, ty, width, 20);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 1;
  ctx.strokeRect(tx, ty, width, 20);

  ctx.fillStyle = "#FFF";
  ctx.font = "10px 'Galmuri11', monospace";
  ctx.textAlign = "center";
  ctx.fillText(text, x, ty + 14);
  ctx.textAlign = "start";
}
