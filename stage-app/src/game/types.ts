// === Game Engine Types ===

export const DIR_DOWN = 0;
export const DIR_LEFT = 1;
export const DIR_RIGHT = 2;
export const DIR_UP = 3;
export type Direction = 0 | 1 | 2 | 3;

export interface Vec2 {
  x: number;
  y: number;
}

// Tile types for the world map
export const TILE_GRASS = 0;
export const TILE_PATH = 1;
export const TILE_WATER = 2;
export const TILE_WALL = 3;
export const TILE_ROOF = 4;
export const TILE_DOOR = 5;
export const TILE_TREE = 6;
export const TILE_FLOWERS = 7;
export const TILE_FENCE = 8;
export const TILE_BRIDGE = 9;
export const TILE_DARK_GRASS = 10;
export const TILE_SIGN = 11;

export interface Zone {
  id: string;
  name: string;
  emoji: string;
  stat: string | null; // StatName or null
  description: string;
  // Building position in tile coords
  bx: number;
  by: number;
  bw: number;
  bh: number;
  // Door position
  doorX: number;
  doorY: number;
  // Colors
  wallColor: string;
  roofColor: string;
  accentColor: string;
  // Activities available in this zone
  activities: ZoneActivity[];
}

export interface ZoneActivity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  statReward: { stat: string; delta: number } | null;
}

export interface InteractionPoint {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "zone" | "npc" | "sign";
  id: string;
  label: string;
}

export interface GameEntity {
  x: number; // pixel position
  y: number;
  direction: Direction;
  moving: boolean;
  frame: number;
  frameTimer: number;
}

export interface NPCEntity extends GameEntity {
  id: string;
  name: string;
  type: "star"; // 별이
}

export interface ActiveActivity {
  zoneId: string;
  activityId: string;
  activityName: string;
  emoji: string;
  stat: string | null;
  startTime: number; // Date.now()
}

// What the engine exposes to React via callbacks
export interface EngineCallbacks {
  onZoneEnter: (zone: Zone) => void;
  onZoneLeave: () => void;
  onNPCInteract: (npc: NPCEntity) => void;
  onInteractionAvailable: (point: InteractionPoint | null) => void;
}

export const TILE_SIZE = 16; // base tile size in pixels
export const MAP_COLS = 36;
export const MAP_ROWS = 30;
export const PLAYER_SPEED = 4.5; // tiles per second
