import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- Stats (단일 행) ---
  await prisma.stats.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // --- Streaks (단일 행) ---
  await prisma.streak.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // --- 데일리 퀘스트 5종 ---
  const dailyQuests = [
    {
      questId: "dq-01",
      title: "새벽의 기상",
      type: "daily",
      emoji: "☀️",
      description: "06:30 이전에 일어나기",
      statReward: { stat: "body", delta: 1 },
      totalSteps: 1,
    },
    {
      questId: "dq-02",
      title: "단련의 시간",
      type: "daily",
      emoji: "💪",
      description: "운동 30분 이상 완료",
      statReward: { stat: "body", delta: 2 },
      totalSteps: 1,
    },
    {
      questId: "dq-03",
      title: "지식의 조각",
      type: "daily",
      emoji: "📖",
      description: "학습 또는 독서 30분",
      statReward: { stat: "knowledge", delta: 1 },
      totalSteps: 1,
    },
    {
      questId: "dq-04",
      title: "내면의 기록",
      type: "daily",
      emoji: "🪞",
      description: "하루 돌아보기 / 일기 쓰기",
      statReward: { stat: "mind", delta: 1 },
      totalSteps: 1,
    },
    {
      questId: "dq-05",
      title: "인연의 온기",
      type: "daily",
      emoji: "💬",
      description: "소중한 사람에게 연락하기",
      statReward: { stat: "bond", delta: 1 },
      totalSteps: 1,
    },
  ];

  // --- 메인 퀘스트 5종 ---
  const mainQuests = [
    {
      questId: "mq-01",
      title: "일어서는 법",
      type: "main",
      emoji: "🌅",
      description: "무대 위에 서는 첫 번째 단계. 습관의 기초를 세운다.",
      statReward: { stat: "body", delta: 5 },
      unlockCondition: null,
      totalSteps: 3,
    },
    {
      questId: "mq-02",
      title: "기억의 항구",
      type: "main",
      emoji: "⚓",
      description: "다섯 도시의 기억을 되짚으며, 나를 만든 경험과 화해한다.",
      statReward: { stat: "mind", delta: 5 },
      unlockCondition: { requires: "mq-01" },
      totalSteps: 5,
    },
    {
      questId: "mq-03",
      title: "첫 번째 공연",
      type: "main",
      emoji: "🎭",
      description: "연기 수업에서 배운 것을 실전에 적용한다.",
      statReward: { stat: "art", delta: 5 },
      unlockCondition: { requires: "mq-02", stat_min: { art: 15 } },
      totalSteps: 4,
    },
    {
      questId: "mq-04",
      title: "균형의 길",
      type: "main",
      emoji: "⚖️",
      description: "일상과 꿈, 관계 사이의 균형을 찾는다.",
      statReward: { stat: "bond", delta: 5 },
      unlockCondition: { requires: "mq-03", stat_min: { bond: 20 } },
      totalSteps: 4,
    },
    {
      questId: "mq-05",
      title: "전설의 무대",
      type: "main",
      emoji: "⭐",
      description: "모든 준비를 마치고, 나만의 무대에 오른다.",
      statReward: { stat: "art", delta: 10 },
      unlockCondition: { requires: "mq-04", spotlight_min: 80 },
      totalSteps: 5,
    },
  ];

  // --- 사이드 퀘스트 10종 ---
  const sideQuests = [
    { questId: "sq-01", title: "프리와의 산책", type: "side", emoji: "🐩", description: "프리와 30분 산책", statReward: { stat: "bond", delta: 2 }, totalSteps: 1 },
    { questId: "sq-02", title: "새로운 레시피", type: "side", emoji: "🍳", description: "새로운 요리 도전", statReward: { stat: "knowledge", delta: 2 }, totalSteps: 1 },
    { questId: "sq-03", title: "코드 리뷰어", type: "side", emoji: "💻", description: "개인 프로젝트 커밋 5회", statReward: { stat: "knowledge", delta: 3 }, totalSteps: 5 },
    { questId: "sq-04", title: "대본 읽기", type: "side", emoji: "📝", description: "영화/드라마 대본 1편 정독", statReward: { stat: "art", delta: 2 }, totalSteps: 1 },
    { questId: "sq-05", title: "새벽 러닝", type: "side", emoji: "🏃", description: "5km 러닝 완료", statReward: { stat: "body", delta: 3 }, totalSteps: 1 },
    { questId: "sq-06", title: "감사 편지", type: "side", emoji: "💌", description: "소중한 사람에게 손편지 쓰기", statReward: { stat: "bond", delta: 3 }, totalSteps: 1 },
    { questId: "sq-07", title: "명상의 시간", type: "side", emoji: "🧘", description: "15분 명상 완료", statReward: { stat: "mind", delta: 2 }, totalSteps: 1 },
    { questId: "sq-08", title: "영어 일기", type: "side", emoji: "✍️", description: "영어로 일기 쓰기", statReward: { stat: "knowledge", delta: 2 }, totalSteps: 1 },
    { questId: "sq-09", title: "즉흥 연기", type: "side", emoji: "🎬", description: "즉흥 연기 연습 20분", statReward: { stat: "art", delta: 2 }, totalSteps: 1 },
    { questId: "sq-10", title: "디지털 디톡스", type: "side", emoji: "📵", description: "SNS 없이 하루 보내기", statReward: { stat: "mind", delta: 3 }, totalSteps: 1 },
  ];

  // --- 히든 퀘스트 3종 ---
  const hiddenQuests = [
    { questId: "hq-01", title: "마스크의 균열", type: "hidden", emoji: "🎭", description: "과거의 그림자와 마주하다", statReward: { stat: "mind", delta: 5 }, unlockCondition: { mask_crack: 3 }, totalSteps: 3 },
    { questId: "hq-02", title: "7살의 소원", type: "hidden", emoji: "⭐", description: "별이의 진짜 이야기를 듣다", statReward: { stat: "bond", delta: 10 }, unlockCondition: { star_intimacy: 50, requires: "mq-03" }, totalSteps: 1 },
    { questId: "hq-03", title: "모든 길은 무대로", type: "hidden", emoji: "🌟", description: "숨겨진 엔딩을 향하여", statReward: { stat: "art", delta: 10 }, unlockCondition: { all_main_complete: true, spotlight_min: 90 }, totalSteps: 1 },
  ];

  const allQuests = [...dailyQuests, ...mainQuests, ...sideQuests, ...hiddenQuests];

  for (const q of allQuests) {
    await prisma.quest.upsert({
      where: { questId: q.questId },
      update: {},
      create: {
        questId: q.questId,
        title: q.title,
        type: q.type,
        emoji: q.emoji,
        description: q.description,
        statReward: q.statReward,
        unlockCondition: (q as Record<string, unknown>).unlockCondition ?? null,
        totalSteps: q.totalSteps,
      },
    });
  }

  // --- 칭호 11종 ---
  const titles = [
    { titleId: "first_step", titleName: "첫 걸음", description: "첫 번째 퀘스트를 완료했다", condition: { quest_complete: 1 } },
    { titleId: "dawn_warrior", titleName: "새벽의 전사", description: "7일 연속 새벽 기상", condition: { streak_min: 7 } },
    { titleId: "iron_body", titleName: "강철 체력", description: "체(體) 레벨 5 달성", condition: { stat_level: { body: 5 } } },
    { titleId: "calm_mind", titleName: "고요한 마음", description: "심(心) 레벨 5 달성", condition: { stat_level: { mind: 5 } } },
    { titleId: "stage_light", titleName: "무대의 빛", description: "예(藝) 레벨 5 달성", condition: { stat_level: { art: 5 } } },
    { titleId: "knowledge_seeker", titleName: "지식 탐구자", description: "지(知) 레벨 5 달성", condition: { stat_level: { knowledge: 5 } } },
    { titleId: "bond_keeper", titleName: "인연의 수호자", description: "연(緣) 레벨 5 달성", condition: { stat_level: { bond: 5 } } },
    { titleId: "balanced_one", titleName: "균형 잡힌 자", description: "5대 스탯 모두 레벨 3 이상", condition: { all_stat_level_min: 3 } },
    { titleId: "month_warrior", titleName: "한 달의 전사", description: "30일 연속 달성", condition: { streak_min: 30 } },
    { titleId: "star_friend", titleName: "별의 친구", description: "별이와 100회 대화", condition: { chat_count: 100 } },
    { titleId: "legend", titleName: "전설의 시작", description: "메인 퀘스트 전체 완료", condition: { all_main_complete: true } },
  ];

  for (const t of titles) {
    await prisma.title.upsert({
      where: { titleId: t.titleId },
      update: {},
      create: t,
    });
  }

  // --- 구역 7종 ---
  const districts = [
    { districtId: "dawn_street", name: "새벽 거리", emoji: "🌅", unlocked: true, unlockCondition: null },
    { districtId: "forge_woods", name: "단련의 숲", emoji: "🌲", unlocked: true, unlockCondition: null },
    { districtId: "memory_harbor", name: "기억의 항구", emoji: "⚓", unlocked: false, unlockCondition: { requires: "mq-01" } },
    { districtId: "code_workshop", name: "코드 공방", emoji: "💻", unlocked: false, unlockCondition: { stat_min: { knowledge: 10 } } },
    { districtId: "spotlight_theatre", name: "스포트라이트 극장", emoji: "🎭", unlocked: false, unlockCondition: { stat_min: { art: 15 } } },
    { districtId: "starlight_garden", name: "별빛 정원", emoji: "🌙", unlocked: false, unlockCondition: { requires: "mq-03", stat_min: { bond: 20 } } },
    { districtId: "noise_underground", name: "소음 지하도", emoji: "🎮", unlocked: false, unlockCondition: { mask_crack: 3 } },
  ];

  for (const d of districts) {
    await prisma.district.upsert({
      where: { districtId: d.districtId },
      update: {},
      create: d,
    });
  }

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
