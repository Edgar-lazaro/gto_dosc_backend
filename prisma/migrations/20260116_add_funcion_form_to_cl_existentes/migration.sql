-- Add legacy column to cl_existentes
-- legacy_v1_schema.sql defines: funcion_form text NOT NULL DEFAULT 'FilesEdit_manto'

ALTER TABLE IF EXISTS "cl_existentes"
ADD COLUMN IF NOT EXISTS "funcion_form" TEXT NOT NULL DEFAULT 'FilesEdit_manto';
