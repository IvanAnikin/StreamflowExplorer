/*
  Warnings:

  - A unique constraint covering the columns `[programId]` on the table `forkedProgram` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "forkedProgram_programId_key" ON "forkedProgram"("programId");
