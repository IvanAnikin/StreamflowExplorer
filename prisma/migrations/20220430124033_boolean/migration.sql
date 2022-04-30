/*
  Warnings:

  - You are about to alter the column `isFork` on the `forkedProgram` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_forkedProgram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "programId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "isFork" BOOLEAN NOT NULL
);
INSERT INTO "new_forkedProgram" ("id", "isFork", "owner", "programId") SELECT "id", "isFork", "owner", "programId" FROM "forkedProgram";
DROP TABLE "forkedProgram";
ALTER TABLE "new_forkedProgram" RENAME TO "forkedProgram";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
