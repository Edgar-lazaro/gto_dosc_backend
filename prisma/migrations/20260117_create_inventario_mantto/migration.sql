-- CreateTable
-- New legacy-style table for maintenance inventory

CREATE TABLE IF NOT EXISTS public.inventario_mantto (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre varchar NOT NULL,
  descripcion text,
  cantidad integer DEFAULT 0,
  precio numeric,
  categoria varchar,
  estado varchar DEFAULT 'disponible',
  ubicacion varchar,
  gerencia integer,
  jefatura bigint,
  img text,
  fecha_registro timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT inventario_mantto_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF to_regclass('public.gerencias') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_mantto_gerencia_fkey') THEN
    ALTER TABLE public.inventario_mantto
      ADD CONSTRAINT inventario_mantto_gerencia_fkey FOREIGN KEY (gerencia) REFERENCES public.gerencias(id);
  END IF;

  IF to_regclass('public.jefaturas') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_mantto_jefatura_fkey') THEN
    ALTER TABLE public.inventario_mantto
      ADD CONSTRAINT inventario_mantto_jefatura_fkey FOREIGN KEY (jefatura) REFERENCES public.jefaturas(id);
  END IF;
END $$;
