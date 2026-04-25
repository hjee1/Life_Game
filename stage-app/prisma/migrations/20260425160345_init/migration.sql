-- CreateTable
CREATE TABLE "stats" (
    "id" SERIAL NOT NULL,
    "body" INTEGER NOT NULL DEFAULT 0,
    "mind" INTEGER NOT NULL DEFAULT 0,
    "art" INTEGER NOT NULL DEFAULT 0,
    "knowledge" INTEGER NOT NULL DEFAULT 0,
    "bond" INTEGER NOT NULL DEFAULT 0,
    "spotlight" INTEGER NOT NULL DEFAULT 0,
    "body_level" INTEGER NOT NULL DEFAULT 1,
    "mind_level" INTEGER NOT NULL DEFAULT 1,
    "art_level" INTEGER NOT NULL DEFAULT 1,
    "knowledge_level" INTEGER NOT NULL DEFAULT 1,
    "bond_level" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stat_history" (
    "id" SERIAL NOT NULL,
    "stat_name" VARCHAR(20) NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" VARCHAR(50) NOT NULL,
    "value_after" INTEGER NOT NULL,
    "recorded_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stat_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quests" (
    "id" SERIAL NOT NULL,
    "quest_id" VARCHAR(20) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "emoji" VARCHAR(10),
    "description" TEXT,
    "stat_reward" JSONB,
    "unlock_condition" JSONB,
    "total_steps" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_completions" (
    "id" SERIAL NOT NULL,
    "quest_id" VARCHAR(20) NOT NULL,
    "completed_date" DATE NOT NULL,
    "choice" VARCHAR(10),
    "rewards_given" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quest_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streaks" (
    "id" SERIAL NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_completed_date" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flags" (
    "id" SERIAL NOT NULL,
    "flag_name" VARCHAR(50) NOT NULL,
    "flag_type" VARCHAR(10) NOT NULL,
    "value_string" VARCHAR(100),
    "value_int" INTEGER NOT NULL DEFAULT 0,
    "value_bool" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flag_history" (
    "id" SERIAL NOT NULL,
    "flag_name" VARCHAR(50) NOT NULL,
    "old_value" VARCHAR(100),
    "new_value" VARCHAR(100),
    "reason" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flag_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "titles" (
    "id" SERIAL NOT NULL,
    "title_id" VARCHAR(30) NOT NULL,
    "title_name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(200),
    "condition" JSONB NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlocked_at" TIMESTAMP(3),

    CONSTRAINT "titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" SERIAL NOT NULL,
    "session_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "role" VARCHAR(10) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "district_id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "emoji" VARCHAR(10),
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlock_condition" JSONB,
    "unlocked_at" TIMESTAMP(3),

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_stat_history_date" ON "stat_history"("recorded_date");

-- CreateIndex
CREATE INDEX "idx_stat_history_name" ON "stat_history"("stat_name", "recorded_date");

-- CreateIndex
CREATE UNIQUE INDEX "quests_quest_id_key" ON "quests"("quest_id");

-- CreateIndex
CREATE INDEX "idx_quest_date" ON "quest_completions"("quest_id", "completed_date");

-- CreateIndex
CREATE UNIQUE INDEX "flags_flag_name_key" ON "flags"("flag_name");

-- CreateIndex
CREATE INDEX "idx_flag_name" ON "flags"("flag_name");

-- CreateIndex
CREATE UNIQUE INDEX "titles_title_id_key" ON "titles"("title_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_sessions_session_date_key" ON "chat_sessions"("session_date");

-- CreateIndex
CREATE INDEX "idx_chat_session" ON "chat_messages"("session_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "districts_district_id_key" ON "districts"("district_id");

-- AddForeignKey
ALTER TABLE "quest_completions" ADD CONSTRAINT "quest_completions_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("quest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flag_history" ADD CONSTRAINT "flag_history_flag_name_fkey" FOREIGN KEY ("flag_name") REFERENCES "flags"("flag_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
