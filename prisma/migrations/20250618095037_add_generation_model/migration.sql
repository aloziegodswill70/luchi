/*
  Warnings:

  - You are about to drop the column `input` on the `Generation` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `Generation` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `content` to the `Generation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "input",
DROP COLUMN "result",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "password" TEXT;
