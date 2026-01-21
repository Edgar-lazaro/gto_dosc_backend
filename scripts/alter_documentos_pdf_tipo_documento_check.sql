-- Extiende el CHECK constraint de public.documentos_pdf.tipo_documento
-- Edita la lista de valores permitidos en el ARRAY antes de ejecutar.

BEGIN;

ALTER TABLE public.documentos_pdf
  DROP CONSTRAINT IF EXISTS documentos_pdf_tipo_documento_check;

ALTER TABLE public.documentos_pdf
  ADD CONSTRAINT documentos_pdf_tipo_documento_check
  CHECK (
    tipo_documento = ANY (
      ARRAY[
        'checklist'::text,
        'mantenimiento'::text,
        'sites'::text,
        'reporte'::text,
        'mantenimiento sites'::text,
        'mantenimiento mostradores'::text,
        'mantenimiento telecomm'::text,
        'combustible'::text,
        'vehiculo'::text
      ]
    )
  );

COMMIT;
