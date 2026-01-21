-- DropForeignKey
ALTER TABLE IF EXISTS "Asistencia" DROP CONSTRAINT IF EXISTS "Asistencia_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "Evidencia" DROP CONSTRAINT IF EXISTS "Evidencia_reporteId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "Reporte" DROP CONSTRAINT IF EXISTS "Reporte_creadorId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "Reporte" DROP CONSTRAINT IF EXISTS "Reporte_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "ReporteComentario" DROP CONSTRAINT IF EXISTS "ReporteComentario_reporteId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "ReporteComentario" DROP CONSTRAINT IF EXISTS "ReporteComentario_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "ReporteParticipante" DROP CONSTRAINT IF EXISTS "ReporteParticipante_reporteId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "ReporteParticipante" DROP CONSTRAINT IF EXISTS "ReporteParticipante_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "Tarea" DROP CONSTRAINT IF EXISTS "Tarea_creadorId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "TareaAsignada" DROP CONSTRAINT IF EXISTS "TareaAsignada_tareaId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "TareaAsignada" DROP CONSTRAINT IF EXISTS "TareaAsignada_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "checklists" DROP CONSTRAINT IF EXISTS "checklists_user_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "fcm_tokens" DROP CONSTRAINT IF EXISTS "fcm_tokens_usuario_id_fkey";

-- AlterTable
ALTER TABLE "SyncQueue" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "lockedAt" TIMESTAMPTZ(6),
ADD COLUMN     "maxRetries" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "nextRunAt" TIMESTAMPTZ(6),
ADD COLUMN     "processedAt" TIMESTAMPTZ(6),
ADD COLUMN     "retries" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "gerencias" ADD COLUMN     "carga_gas" TEXT,
ADD COLUMN     "uso_car" TEXT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "gerencias" WHERE "nombre" IS NULL) THEN
        ALTER TABLE "gerencias" ALTER COLUMN "nombre" SET NOT NULL;
    END IF;
END $$;

-- AlterTable
ALTER TABLE "uso_car_tics" ADD COLUMN     "vehiculo" TEXT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "uso_car_tics" WHERE "vehiculo" IS NULL) THEN
        ALTER TABLE "uso_car_tics" ALTER COLUMN "vehiculo" SET NOT NULL;
    END IF;
END $$;

-- DropTable
DROP TABLE IF EXISTS "Asistencia";

-- DropTable
DROP TABLE IF EXISTS "Evidencia";

-- DropTable
DROP TABLE IF EXISTS "Notificacion";

-- DropTable
DROP TABLE IF EXISTS "Reporte";

-- DropTable
DROP TABLE IF EXISTS "ReporteComentario";

-- DropTable
DROP TABLE IF EXISTS "ReporteParticipante";

-- DropTable
DROP TABLE IF EXISTS "Tarea";

-- DropTable
DROP TABLE IF EXISTS "TareaAsignada";

-- DropTable
DROP TABLE IF EXISTS "checklists";

-- DropTable
DROP TABLE IF EXISTS "fcm_tokens";

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "placas" TEXT NOT NULL,
    "gerencia" VARCHAR NOT NULL,
    "nombre_clave" TEXT NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_nombre_clave_key" ON "vehiculos"("nombre_clave");

-- CreateIndex
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM (
            SELECT "nombre" FROM "gerencias" GROUP BY "nombre" HAVING COUNT(*) > 1
        ) d
    ) THEN
        CREATE UNIQUE INDEX IF NOT EXISTS "gerencias_nombre_key" ON "gerencias"("nombre");
    END IF;
END $$;

-- AddForeignKey
ALTER TABLE "carga_car_tics" ADD CONSTRAINT "carga_car_tics_vehiculo_fkey" FOREIGN KEY ("vehiculo") REFERENCES "vehiculos"("nombre_clave") ON DELETE NO ACTION ON UPDATE NO ACTION NOT VALID;

-- AddForeignKey
ALTER TABLE "uso_car_tics" ADD CONSTRAINT "uso_car_tics_vehiculo_fkey" FOREIGN KEY ("vehiculo") REFERENCES "vehiculos"("nombre_clave") ON DELETE NO ACTION ON UPDATE NO ACTION NOT VALID;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_gerencia_fkey" FOREIGN KEY ("gerencia") REFERENCES "gerencias"("nombre") ON DELETE NO ACTION ON UPDATE NO ACTION;

