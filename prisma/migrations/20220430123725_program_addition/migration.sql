-- CreateTable
CREATE TABLE "forkedProgram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "programId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "isFork" TEXT NOT NULL
);
