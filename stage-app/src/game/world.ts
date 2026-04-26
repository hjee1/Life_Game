// === World Map Generation & Zone Definitions ===

import {
  Zone, InteractionPoint, NPCEntity,
  MAP_COLS, MAP_ROWS, TILE_SIZE,
  TILE_GRASS, TILE_PATH, TILE_WATER, TILE_WALL,
  TILE_DOOR, TILE_TREE, TILE_FLOWERS, TILE_FENCE,
  TILE_DARK_GRASS, TILE_BRIDGE,
  DIR_DOWN,
} from "./types";

// ===== ZONE DEFINITIONS =====

export const ZONES: Zone[] = [
  {
    id: "health", name: "단련의 마당", emoji: "💪", stat: "body",
    description: "체력은 물리적 건강과 에너지.\n운동, 수면, 식습관으로 성장한다.",
    bx: 3, by: 25, bw: 6, bh: 4,
    doorX: 6, doorY: 29,
    wallColor: "#C0392B", roofColor: "#922B21", accentColor: "#E74C3C",
    activities: [
      { id: "exercise", name: "운동하기", emoji: "🏋️", description: "헬스, 러닝, 홈트 등 운동", statReward: { stat: "body", delta: 2 } },
      { id: "stretch", name: "스트레칭", emoji: "🧘", description: "몸을 풀어주는 스트레칭", statReward: { stat: "body", delta: 1 } },
      { id: "run", name: "러닝", emoji: "🏃", description: "달리기 (실외/트레드밀)", statReward: { stat: "body", delta: 2 } },
    ],
  },
  {
    id: "mind", name: "정신수련관", emoji: "🧠", stat: "mind",
    description: "마음의 안정과 내면의 성장.\n명상, 일기, 감정 관리로 성장한다.",
    bx: 10, by: 3, bw: 6, bh: 4,
    doorX: 13, doorY: 7,
    wallColor: "#5DADE2", roofColor: "#2E86C1", accentColor: "#85C1E9",
    activities: [
      { id: "meditate", name: "명상하기", emoji: "🧘", description: "15분 이상 명상", statReward: { stat: "mind", delta: 2 } },
      { id: "journal", name: "일기 쓰기", emoji: "📝", description: "하루를 돌아보며 일기 작성", statReward: { stat: "mind", delta: 1 } },
      { id: "reflect", name: "감정 정리", emoji: "🪞", description: "지금 느끼는 감정을 글로 정리", statReward: { stat: "mind", delta: 1 } },
    ],
  },
  {
    id: "art", name: "예술의 집", emoji: "🎭", stat: "art",
    description: "창작과 표현의 힘.\n연기, 음악, 글쓰기로 성장한다.",
    bx: 37, by: 14, bw: 6, bh: 4,
    doorX: 40, doorY: 18,
    wallColor: "#8E44AD", roofColor: "#6C3483", accentColor: "#9B59B6",
    activities: [
      { id: "acting", name: "연기 연습", emoji: "🎬", description: "대본 읽기, 감정 연기 연습", statReward: { stat: "art", delta: 2 } },
      { id: "script", name: "대본 분석", emoji: "📖", description: "영화/드라마 대본 정독 분석", statReward: { stat: "art", delta: 1 } },
      { id: "create", name: "창작 활동", emoji: "✍️", description: "글쓰기, 그리기 등 창작", statReward: { stat: "art", delta: 1 } },
    ],
  },
  {
    id: "knowledge", name: "지식의 서재", emoji: "📖", stat: "knowledge",
    description: "배움과 기술의 확장.\n독서, 코딩, 학습으로 성장한다.",
    bx: 3, by: 14, bw: 6, bh: 4,
    doorX: 6, doorY: 18,
    wallColor: "#D4AC0D", roofColor: "#B7950B", accentColor: "#F4D03F",
    activities: [
      { id: "study", name: "공부하기", emoji: "📚", description: "책 읽기, 강의 듣기", statReward: { stat: "knowledge", delta: 2 } },
      { id: "code", name: "코딩하기", emoji: "💻", description: "개인 프로젝트 작업", statReward: { stat: "knowledge", delta: 2 } },
      { id: "read", name: "독서", emoji: "📖", description: "30분 이상 독서", statReward: { stat: "knowledge", delta: 1 } },
    ],
  },
  {
    id: "bond", name: "인연의 정원", emoji: "💗", stat: "bond",
    description: "관계의 깊이와 따뜻함.\n소통, 배려, 함께하는 시간으로 성장한다.",
    bx: 35, by: 3, bw: 6, bh: 4,
    doorX: 38, doorY: 7,
    wallColor: "#E8A0A0", roofColor: "#C0776E", accentColor: "#F1948A",
    activities: [
      { id: "connect", name: "소중한 사람에게 연락", emoji: "💬", description: "가족, 친구, 연인에게 연락", statReward: { stat: "bond", delta: 2 } },
      { id: "walk_pree", name: "프리와 산책", emoji: "🐩", description: "프리와 30분 산책", statReward: { stat: "bond", delta: 1 } },
      { id: "letter", name: "편지 쓰기", emoji: "💌", description: "소중한 사람에게 손편지", statReward: { stat: "bond", delta: 2 } },
    ],
  },
  {
    id: "sleep", name: "휴식의 여관", emoji: "🌙", stat: null,
    description: "충분한 수면은 모든 성장의 기초.\n잠들기 전에 기록을 시작하세요.",
    bx: 20, by: 25, bw: 6, bh: 4,
    doorX: 23, doorY: 29,
    wallColor: "#34495E", roofColor: "#2C3E50", accentColor: "#5D6D7E",
    activities: [
      { id: "sleep_start", name: "잠들기", emoji: "😴", description: "수면 기록 시작 (취침)", statReward: { stat: "body", delta: 1 } },
    ],
  },
  {
    id: "market", name: "시장", emoji: "💰", stat: "gold",
    description: "재정 건강을 관리하는 곳.\n실제 수입/지출을 게임 재화로 변환.",
    bx: 37, by: 25, bw: 6, bh: 4,
    doorX: 40, doorY: 29,
    wallColor: "#E67E22", roofColor: "#CA6F1E", accentColor: "#F39C12",
    activities: [
      { id: "income", name: "수입 기록", emoji: "💵", description: "오늘의 수입 기록", statReward: null },
      { id: "expense", name: "지출 기록", emoji: "💸", description: "오늘의 지출 기록", statReward: null },
    ],
  },
];

// ===== 별이 NPC =====

export const STAR_NPC: NPCEntity = {
  id: "star",
  name: "별이",
  type: "star",
  x: 24 * TILE_SIZE, // town center
  y: 17 * TILE_SIZE,
  direction: DIR_DOWN,
  moving: false,
  frame: 0,
  frameTimer: 0,
};

// ===== PLAYER SPAWN =====

export const PLAYER_SPAWN = { x: 24 * TILE_SIZE, y: 20 * TILE_SIZE };

// ===== MAP GENERATION =====

export function generateMap(): number[][] {
  const map: number[][] = [];

  // Initialize with grass
  for (let y = 0; y < MAP_ROWS; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_COLS; x++) {
      map[y][x] = TILE_GRASS;
    }
  }

  // === Border trees ===
  for (let x = 0; x < MAP_COLS; x++) {
    map[0][x] = TILE_TREE;
    map[1][x] = TILE_TREE;
    map[MAP_ROWS - 1][x] = TILE_TREE;
    map[MAP_ROWS - 2][x] = TILE_TREE;
  }
  for (let y = 0; y < MAP_ROWS; y++) {
    map[y][0] = TILE_TREE;
    map[y][1] = TILE_TREE;
    map[y][MAP_COLS - 1] = TILE_TREE;
    map[y][MAP_COLS - 2] = TILE_TREE;
  }

  // === Scattered trees for decoration ===
  const treeClusters = [
    [4, 10], [7, 8], [8, 22], [14, 2], [45, 8], [43, 22],
    [15, 32], [30, 32], [46, 15], [46, 28],
    [3, 10], [3, 11], [47, 10], [47, 20],
  ];
  for (const [tx, ty] of treeClusters) {
    if (tx >= 0 && tx < MAP_COLS && ty >= 0 && ty < MAP_ROWS) {
      map[ty][tx] = TILE_TREE;
    }
  }

  // === Water pond (center-right area) ===
  for (let y = 10; y <= 12; y++) {
    for (let x = 28; x <= 33; x++) {
      map[y][x] = TILE_WATER;
    }
  }
  // Bridge over water
  map[11][28] = TILE_BRIDGE;
  map[11][33] = TILE_BRIDGE;

  // === Main paths (horizontal) ===
  // Center horizontal path
  for (let x = 3; x < MAP_COLS - 2; x++) {
    map[19][x] = TILE_PATH;
    map[20][x] = TILE_PATH;
  }
  // Upper horizontal path
  for (let x = 3; x < MAP_COLS - 2; x++) {
    map[9][x] = TILE_PATH;
    map[10][x] = TILE_PATH;
  }
  // Lower horizontal path
  for (let x = 3; x < MAP_COLS - 2; x++) {
    map[30][x] = TILE_PATH;
    map[31][x] = TILE_PATH;
  }

  // === Main paths (vertical) ===
  // Center vertical
  for (let y = 3; y < MAP_ROWS - 2; y++) {
    map[y][24] = TILE_PATH;
    map[y][25] = TILE_PATH;
  }
  // Left vertical
  for (let y = 9; y <= 31; y++) {
    map[y][8] = TILE_PATH;
    map[y][9] = TILE_PATH;
  }
  // Right vertical
  for (let y = 9; y <= 31; y++) {
    map[y][40] = TILE_PATH;
    map[y][41] = TILE_PATH;
  }

  // === Flowers near paths ===
  const flowerSpots = [
    [11, 19], [12, 20], [26, 19], [27, 20],
    [24, 8], [25, 8], [24, 22], [25, 22],
    [10, 12], [11, 13], [38, 12], [39, 13],
    [20, 33], [21, 33], [28, 33], [29, 33],
  ];
  for (const [fx, fy] of flowerSpots) {
    if (map[fy]?.[fx] === TILE_GRASS) {
      map[fy][fx] = TILE_FLOWERS;
    }
  }

  // === Place buildings ===
  for (const zone of ZONES) {
    placeBuilding(map, zone);
  }

  // === Town center decoration ===
  // Fence around center area
  for (let x = 20; x <= 29; x++) {
    if (map[15][x] === TILE_GRASS) map[15][x] = TILE_FENCE;
    if (map[23][x] === TILE_GRASS) map[23][x] = TILE_FENCE;
  }

  return map;
}

function placeBuilding(map: number[][], zone: Zone) {
  const { bx, by, bw, bh, doorX, doorY } = zone;

  // Roof (top 1 row, extends 1 tile wider)
  for (let x = bx - 1; x <= bx + bw; x++) {
    if (x >= 0 && x < MAP_COLS && by - 1 >= 0) {
      map[by - 1][x] = TILE_WALL; // Will be drawn as roof via zone color
    }
  }

  // Walls
  for (let y = by; y < by + bh; y++) {
    for (let x = bx; x < bx + bw; x++) {
      if (y >= 0 && y < MAP_ROWS && x >= 0 && x < MAP_COLS) {
        map[y][x] = TILE_WALL;
      }
    }
  }

  // Door
  if (doorY >= 0 && doorY < MAP_ROWS && doorX >= 0 && doorX < MAP_COLS) {
    map[doorY][doorX] = TILE_DOOR;
  }

  // Path leading to door
  if (doorY + 1 < MAP_ROWS) map[doorY + 1][doorX] = TILE_PATH;
  if (doorY + 2 < MAP_ROWS) map[doorY + 2][doorX] = TILE_PATH;
}

// ===== COLLISION MAP =====

export function isWalkable(tile: number): boolean {
  return tile === TILE_GRASS
    || tile === TILE_PATH
    || tile === TILE_FLOWERS
    || tile === TILE_DARK_GRASS
    || tile === TILE_BRIDGE;
}

// ===== INTERACTION POINTS =====

export function getInteractionPoints(): InteractionPoint[] {
  const points: InteractionPoint[] = [];

  // Zone doors
  for (const zone of ZONES) {
    points.push({
      x: zone.doorX * TILE_SIZE,
      y: zone.doorY * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
      type: "zone",
      id: zone.id,
      label: `${zone.emoji} ${zone.name}`,
    });
  }

  // 별이 NPC
  points.push({
    x: STAR_NPC.x,
    y: STAR_NPC.y,
    width: TILE_SIZE,
    height: TILE_SIZE,
    type: "npc",
    id: "star",
    label: "⭐ 별이와 대화",
  });

  return points;
}

// ===== ZONE LOOKUP =====

export function getZoneById(id: string): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}

// Find which zone a building tile belongs to (for colored rendering)
export function getZoneAtTile(tx: number, ty: number): Zone | undefined {
  for (const zone of ZONES) {
    const { bx, by, bw, bh } = zone;
    // Check roof area
    if (ty === by - 1 && tx >= bx - 1 && tx <= bx + bw) return zone;
    // Check walls
    if (tx >= bx && tx < bx + bw && ty >= by && ty < by + bh) return zone;
    // Check door
    if (tx === zone.doorX && ty === zone.doorY) return zone;
  }
  return undefined;
}
