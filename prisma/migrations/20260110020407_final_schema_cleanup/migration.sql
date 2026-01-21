/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Reporte` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Reporte" DROP COLUMN "usuarioId";
