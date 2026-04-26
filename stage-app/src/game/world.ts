// === World Map Generation & Zone Definitions ===
// Compact 36×30 map with rich Stardew Valley-style layout

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
    bx: 3, by: 19, bw: 5, bh: 4,
    doorX: 5, doorY: 23,
    wallColor: "#B03A2E", roofColor: "#922B21", accentColor: "#E74C3C",
    activities: [
      { id: "exercise", name: "운동하기", emoji: "🏋️", description: "헬스, 러닝, 홈트 등 운동", statReward: { stat: "body", delta: 2 } },
      { id: "stretch", name: "스트레칭", emoji: "🧘", description: "몸 풀어주는 스트레칭", statReward: { stat: "body", delta: 1 } },
      { id: "run", name: "러닝", emoji: "🏃", description: "달리기 (실외/트레드밀)", statReward: { stat: "body", delta: 2 } },
    ],
  },
  {
    id: "mind", name: "정신수련관", emoji: "🧠", stat: "mind",
    description: "마음의 안정과 내면의 성장.\n명상, 일기, 감정 관리로 성장한다.",
    bx: 8, by: 3, bw: 5, bh: 4,
    doorX: 10, doorY: 7,
    wallColor: "#4A90C4", roofColor: "#2E7AB5", accentColor: "#85C1E9",
    activities: [
      { id: "meditate", name: "명상하기", emoji: "🧘", description: "15분 이상 명상", statReward: { stat: "mind", delta: 2 } },
      { id: "journal", name: "일기 쓰기", emoji: "📝", description: "하루 돌아보며 일기 작성", statReward: { stat: "mind", delta: 1 } },
      { id: "reflect", name: "감정 정리", emoji: "🪞", description: "지금 감정을 글로 정리", statReward: { stat: "mind", delta: 1 } },
    ],
  },
  {
    id: "art", name: "예술의 집", emoji: "🎭", stat: "art",
    description: "창작과 표현의 힘.\n연기, 음악, 글쓰기로 성장한다.",
    bx: 27, by: 11, bw: 5, bh: 4,
    doorX: 29, doorY: 15,
    wallColor: "#7D3C98", roofColor: "#6C3483", accentColor: "#9B59B6",
    activities: [
      { id: "acting", name: "연기 연습", emoji: "🎬", description: "대본 읽기, 감정 연기 연습", statReward: { stat: "art", delta: 2 } },
      { id: "script", name: "대본 분석", emoji: "📖", description: "영화/드라마 대본 정독", statReward: { stat: "art", delta: 1 } },
      { id: "create", name: "창작 활동", emoji: "✍️", description: "글쓰기, 그리기 등 창작", statReward: { stat: "art", delta: 1 } },
    ],
  },
  {
    id: "knowledge", name: "지식의 서재", emoji: "📖", stat: "knowledge",
    description: "배움과 기술의 확장.\n독서, 코딩, 학습으로 성장한다.",
    bx: 3, by: 11, bw: 5, bh: 4,
    doorX: 5, doorY: 15,
    wallColor: "#C9A715", roofColor: "#B7950B", accentColor: "#F4D03F",
    activities: [
      { id: "study", name: "공부하기", emoji: "📚", description: "책 읽기, 강의 듣기", statReward: { stat: "knowledge", delta: 2 } },
      { id: "code", name: "코딩하기", emoji: "💻", description: "개인 프로젝트 작업", statReward: { stat: "knowledge", delta: 2 } },
      { id: "read", name: "독서", emoji: "📖", description: "30분 이상 독서", statReward: { stat: "knowledge", delta: 1 } },
    ],
  },
  {
    id: "bond", name: "인연의 정원", emoji: "💗", stat: "bond",
    description: "관계의 깊이와 따뜻함.\n소통, 배려, 함께하는 시간으로 성장한다.",
    bx: 25, by: 3, bw: 5, bh: 4,
    doorX: 27, doorY: 7,
    wallColor: "#D98880", roofColor: "#C0776E", accentColor: "#F1948A",
    activities: [
      { id: "connect", name: "연락하기", emoji: "💬", description: "소중한 사람에게 연락", statReward: { stat: "bond", delta: 2 } },
      { id: "walk_pree", name: "프리와 산책", emoji: "🐩", description: "프리와 30분 산책", statReward: { stat: "bond", delta: 1 } },
      { id: "letter", name: "편지 쓰기", emoji: "💌", description: "소중한 사람에게 손편지", statReward: { stat: "bond", delta: 2 } },
    ],
  },
  {
    id: "sleep", name: "휴식의 여관", emoji: "🌙", stat: null,
    description: "충분한 수면은 모든 성장의 기초.\n잠들기 전에 기록을 시작하세요.",
    bx: 15, by: 19, bw: 5, bh: 4,
    doorX: 17, doorY: 23,
    wallColor: "#2C3E50", roofColor: "#1C2833", accentColor: "#5D6D7E",
    activities: [
      { id: "sleep_start", name: "잠들기", emoji: "😴", description: "수면 기록 시작", statReward: { stat: "body", delta: 1 } },
    ],
  },
  {
    id: "market", name: "시장", emoji: "💰", stat: "gold",
    description: "재정 건강을 관리하는 곳.\n실제 수입/지출을 게임 재화로 변환.",
    bx: 27, by: 19, bw: 5, bh: 4,
    doorX: 29, doorY: 23,
    wallColor: "#D68910", roofColor: "#CA6F1E", accentColor: "#F39C12",
    activities: [
      { id: "income", name: "수입 기록", emoji: "💵", description: "오늘의 수입 기록", statReward: null },
      { id: "expense", name: "지출 기록", emoji: "💸", description: "오늘의 지출 기록", statReward: null },
    ],
  },
];

// ===== 별이 NPC =====
export const STAR_NPC: NPCEntity = {
  id: "star", name: "별이", type: "star",
  x: 17 * TILE_SIZE, y: 13 * TILE_SIZE,
  direction: DIR_DOWN, moving: false, frame: 0, frameTimer: 0,
};

// ===== PLAYER SPAWN (town center) =====
export const PLAYER_SPAWN = { x: 17 * TILE_SIZE, y: 16 * TILE_SIZE };

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

  // === Border: trees ===
  for (let x = 0; x < MAP_COLS; x++) {
    map[0][x] = TILE_TREE;
    map[MAP_ROWS - 1][x] = TILE_TREE;
  }
  for (let y = 0; y < MAP_ROWS; y++) {
    map[y][0] = TILE_TREE;
    map[y][MAP_COLS - 1] = TILE_TREE;
  }

  // === Extra border trees ===
  const borderTrees = [
    [1,1],[2,1],[1,2],[34,1],[33,1],[34,2],
    [1,28],[2,28],[1,27],[34,28],[33,28],[34,27],
  ];
  for (const [tx, ty] of borderTrees) {
    if (tx < MAP_COLS && ty < MAP_ROWS) map[ty][tx] = TILE_TREE;
  }

  // === Scattered decoration trees ===
  const treeClusters = [
    [5,8],[6,9],[30,8],[31,9],[3,17],[33,17],
    [12,2],[22,2],[15,27],[20,27],[32,12],[2,25],
  ];
  for (const [tx, ty] of treeClusters) {
    if (tx > 0 && tx < MAP_COLS && ty > 0 && ty < MAP_ROWS && map[ty][tx] === TILE_GRASS) {
      map[ty][tx] = TILE_TREE;
    }
  }

  // === Small pond (right side) ===
  for (let y = 9; y <= 10; y++) {
    for (let x = 21; x <= 24; x++) {
      map[y][x] = TILE_WATER;
    }
  }
  map[9][24] = TILE_BRIDGE; // bridge across

  // === MAIN PATHS ===
  // Center horizontal path
  for (let x = 2; x < MAP_COLS - 1; x++) {
    map[16][x] = TILE_PATH;
    map[17][x] = TILE_PATH;
  }
  // Center vertical path
  for (let y = 2; y < MAP_ROWS - 1; y++) {
    map[y][17] = TILE_PATH;
    map[y][18] = TILE_PATH;
  }

  // Upper horizontal
  for (let x = 5; x < MAP_COLS - 3; x++) {
    map[8][x] = TILE_PATH;
  }
  // Lower horizontal
  for (let x = 2; x < MAP_COLS - 1; x++) {
    map[24][x] = TILE_PATH;
  }
  // Left vertical
  for (let y = 8; y <= 24; y++) {
    map[y][7] = TILE_PATH;
  }
  // Right vertical
  for (let y = 8; y <= 24; y++) {
    map[y][30] = TILE_PATH;
  }

  // === Flower patches ===
  const flowers = [
    [10,9],[11,9],[12,10],[25,10],[26,9],
    [16,14],[19,14],[9,17],[26,17],
    [10,25],[11,25],[24,25],[25,25],
    [14,10],[20,10],
  ];
  for (const [fx, fy] of flowers) {
    if (map[fy]?.[fx] === TILE_GRASS) map[fy][fx] = TILE_FLOWERS;
  }

  // === Dark grass patches ===
  const darkGrass = [[4,6],[5,7],[30,6],[31,7],[4,26],[31,26]];
  for (const [dx, dy] of darkGrass) {
    if (map[dy]?.[dx] === TILE_GRASS) map[dy][dx] = TILE_DARK_GRASS;
  }

  // === Town center fence ===
  for (let x = 14; x <= 21; x++) {
    if (map[12][x] === TILE_GRASS) map[12][x] = TILE_FENCE;
    if (map[18][x] === TILE_GRASS) map[18][x] = TILE_FENCE;
  }

  // === Place all buildings ===
  for (const zone of ZONES) {
    placeBuilding(map, zone);
  }

  return map;
}

function placeBuilding(map: number[][], zone: Zone) {
  const { bx, by, bw, bh, doorX, doorY } = zone;

  // Roof row (1 tile above building, extends 1 wider)
  for (let x = bx - 1; x <= bx + bw; x++) {
    if (x >= 0 && x < MAP_COLS && by - 1 >= 0) {
      map[by - 1][x] = TILE_WALL;
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

  // Path to door
  for (let dy = doorY + 1; dy <= Math.min(doorY + 3, MAP_ROWS - 1); dy++) {
    if (map[dy][doorX] === TILE_GRASS || map[dy][doorX] === TILE_FLOWERS) {
      map[dy][doorX] = TILE_PATH;
    }
  }
}

// ===== COLLISION =====

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

  for (const zone of ZONES) {
    points.push({
      x: zone.doorX * TILE_SIZE,
      y: zone.doorY * TILE_SIZE,
      width: TILE_SIZE, height: TILE_SIZE,
      type: "zone", id: zone.id,
      label: `${zone.emoji} ${zone.name}`,
    });
  }

  points.push({
    x: STAR_NPC.x, y: STAR_NPC.y,
    width: TILE_SIZE, height: TILE_SIZE,
    type: "npc", id: "star",
    label: "⭐ 별이와 대화",
  });

  return points;
}

export function getZoneById(id: string): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}

export function getZoneAtTile(tx: number, ty: number): Zone | undefined {
  for (const zone of ZONES) {
    const { bx, by, bw, bh } = zone;
    if (ty === by - 1 && tx >= bx - 1 && tx <= bx + bw) return zone;
    if (tx >= bx && tx < bx + bw && ty >= by && ty < by + bh) return zone;
    if (tx === zone.doorX && ty === zone.doorY) return zone;
  }
  return undefined;
}
