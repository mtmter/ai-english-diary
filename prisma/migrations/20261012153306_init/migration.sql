-- CreateTable
CREATE TABLE "Diary" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "correctedDiary" TEXT NOT NULL,
    "grammarScore" INTEGER NOT NULL,
    "naturalnessScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);
