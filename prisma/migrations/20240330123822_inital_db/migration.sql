-- CreateTable
CREATE TABLE "Problem" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "upvotes" INTEGER NOT NULL,
    "tags" TEXT[],
    "score" DOUBLE PRECISION NOT NULL,
    "contest" INTEGER NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "GlobalFilter" (
    "settingId" INTEGER NOT NULL,
    "startRating" INTEGER NOT NULL,
    "endRating" INTEGER NOT NULL,
    "filterTags" TEXT[],

    CONSTRAINT "GlobalFilter_pkey" PRIMARY KEY ("settingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Problem_code_key" ON "Problem"("code");
