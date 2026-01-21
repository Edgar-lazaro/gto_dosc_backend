-- Legacy v1 schema (idempotent-ish) adapted to point to current "User" table (Prisma) instead of auth.users
-- Run with: psql -U <user> -d <db> -f scripts/legacy_v1_schema.sql

BEGIN;

-- Helper: ensure schema exists
CREATE SCHEMA IF NOT EXISTS public;

-- cargos
CREATE TABLE IF NOT EXISTS public.cargos (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  nombre_cargo text,
  nivel_cargo text,
  CONSTRAINT cargos_pkey PRIMARY KEY (id)
);

-- gerencias
CREATE TABLE IF NOT EXISTS public.gerencias (
  id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  nombre varchar,
  tabla_inventario text,
  CONSTRAINT gerencias_pkey PRIMARY KEY (id)
);

-- jefaturas
CREATE TABLE IF NOT EXISTS public.jefaturas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  nombre_jefatura text,
  gerencia smallint NOT NULL,
  img text,
  CONSTRAINT jefaturas_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'jefaturas_gerencia_fkey'
  ) THEN
    ALTER TABLE public.jefaturas
      ADD CONSTRAINT jefaturas_gerencia_fkey FOREIGN KEY (gerencia) REFERENCES public.gerencias(id);
  END IF;
END $$;

-- usuarios (links to current "User" table via user_id)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  nombre text NOT NULL,
  apellido text NOT NULL,
  gerencia smallint NOT NULL,
  cargo text NOT NULL,
  id_cargo integer NOT NULL,
  user_id text NOT NULL UNIQUE,
  jefatura bigint NOT NULL,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_gerencia_fkey') THEN
    ALTER TABLE public.usuarios
      ADD CONSTRAINT usuarios_gerencia_fkey FOREIGN KEY (gerencia) REFERENCES public.gerencias(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_id_cargo_fkey') THEN
    ALTER TABLE public.usuarios
      ADD CONSTRAINT usuarios_id_cargo_fkey FOREIGN KEY (id_cargo) REFERENCES public.cargos(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_jefatura_fkey') THEN
    ALTER TABLE public.usuarios
      ADD CONSTRAINT usuarios_jefatura_fkey FOREIGN KEY (jefatura) REFERENCES public.jefaturas(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_user_id_fkey') THEN
    ALTER TABLE public.usuarios
      ADD CONSTRAINT usuarios_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id);
  END IF;
END $$;

-- checklists (column name kept as "user")
CREATE TABLE IF NOT EXISTS public.checklists (
  id_cl bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  system text,
  telefonia text,
  pava text,
  eq_computo text,
  impr text,
  fids text,
  cupps text,
  radio text,
  sis_aero text,
  wifi text,
  egate text,
  telefono_rojo text,
  videovigi text,
  kioskos text,
  grp text,
  equipo_red text,
  nombre_cl text NOT NULL,
  datatime date,
  name_cl text NOT NULL UNIQUE,
  "user" text,
  CONSTRAINT checklists_pkey PRIMARY KEY (id_cl)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'checklists_user_fkey') THEN
    ALTER TABLE public.checklists
      ADD CONSTRAINT checklists_user_fkey FOREIGN KEY ("user") REFERENCES public."User"(id);
  END IF;
END $$;

-- cl_existentes
CREATE TABLE IF NOT EXISTS public.cl_existentes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  nombre_cl text NOT NULL,
  gerencia_cl smallint NOT NULL,
  jefatura bigint NOT NULL,
  funcion_form text NOT NULL DEFAULT 'FilesEdit_manto',
  CONSTRAINT cl_existentes_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cl_existentes_gerencia_cl_fkey') THEN
    ALTER TABLE public.cl_existentes
      ADD CONSTRAINT cl_existentes_gerencia_cl_fkey FOREIGN KEY (gerencia_cl) REFERENCES public.gerencias(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cl_existentes_jefatura_fkey') THEN
    ALTER TABLE public.cl_existentes
      ADD CONSTRAINT cl_existentes_jefatura_fkey FOREIGN KEY (jefatura) REFERENCES public.jefaturas(id);
  END IF;
END $$;

-- inventario_tics
CREATE TABLE IF NOT EXISTS public.inventario_tics (
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
  CONSTRAINT inventario_tics_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_tics_gerencia_fkey') THEN
    ALTER TABLE public.inventario_tics
      ADD CONSTRAINT inventario_tics_gerencia_fkey FOREIGN KEY (gerencia) REFERENCES public.gerencias(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_tics_jefatura_fkey') THEN
    ALTER TABLE public.inventario_tics
      ADD CONSTRAINT inventario_tics_jefatura_fkey FOREIGN KEY (jefatura) REFERENCES public.jefaturas(id);
  END IF;
END $$;

-- combustible (nombre references usuarios.id)
CREATE TABLE IF NOT EXISTS public.combustible (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  hora_ini time with time zone NOT NULL,
  hora_final time with time zone NOT NULL,
  nombre bigint NOT NULL,
  km_inicio numeric NOT NULL,
  lvl_km_ini numeric NOT NULL,
  destino text NOT NULL,
  km_final numeric NOT NULL,
  lvl_km_fin numeric NOT NULL,
  foto_ini json NOT NULL,
  foto_fin json NOT NULL,
  CONSTRAINT combustible_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'combustible_nombre_fkey') THEN
    ALTER TABLE public.combustible
      ADD CONSTRAINT combustible_nombre_fkey FOREIGN KEY (nombre) REFERENCES public.usuarios(id);
  END IF;
END $$;

-- fcm_tokens (usuario_id references usuarios.user_id)
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuario_id text NOT NULL,
  token text NOT NULL,
  dispositivo_info text,
  fecha_registro timestamptz DEFAULT now(),
  ultima_actualizacion timestamptz DEFAULT now(),
  activo boolean DEFAULT true,
  CONSTRAINT fcm_tokens_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fcm_tokens_usuario_id_fkey') THEN
    ALTER TABLE public.fcm_tokens
      ADD CONSTRAINT fcm_tokens_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(user_id);
  END IF;
END $$;

-- notificaciones (usuario_id references usuarios.user_id)
CREATE TABLE IF NOT EXISTS public.notificaciones (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuario_id text NOT NULL,
  tipo text NOT NULL,
  titulo text NOT NULL,
  mensaje text NOT NULL,
  datos_adicionales jsonb,
  leida boolean DEFAULT false,
  fecha_envio timestamptz DEFAULT now(),
  fecha_lectura timestamptz,
  CONSTRAINT notificaciones_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notificaciones_usuario_id_fkey') THEN
    ALTER TABLE public.notificaciones
      ADD CONSTRAINT notificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(user_id);
  END IF;
END $$;

-- tareas (usuario_asignado/asignado_por references usuarios.user_id)
CREATE TABLE IF NOT EXISTS public.tareas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  estatus text NOT NULL DEFAULT 'pendiente',
  fecha_creacion timestamptz NOT NULL DEFAULT now(),
  fecha_limite date,
  usuario_asignado text NOT NULL,
  asignado_por text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT tareas_pkey PRIMARY KEY (id),
  CONSTRAINT tareas_estatus_check CHECK (estatus = ANY (ARRAY['pendiente','en_progreso','completada','cancelada']))
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tareas_usuario_asignado_fkey') THEN
    ALTER TABLE public.tareas
      ADD CONSTRAINT tareas_usuario_asignado_fkey FOREIGN KEY (usuario_asignado) REFERENCES public.usuarios(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tareas_asignado_por_fkey') THEN
    ALTER TABLE public.tareas
      ADD CONSTRAINT tareas_asignado_por_fkey FOREIGN KEY (asignado_por) REFERENCES public.usuarios(user_id);
  END IF;
END $$;

-- tarea_asignaciones
CREATE TABLE IF NOT EXISTS public.tarea_asignaciones (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tarea_id bigint NOT NULL,
  usuario_id text NOT NULL,
  fecha_asignacion timestamptz DEFAULT now(),
  CONSTRAINT tarea_asignaciones_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tarea_asignaciones_tarea_id_fkey') THEN
    ALTER TABLE public.tarea_asignaciones
      ADD CONSTRAINT tarea_asignaciones_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES public.tareas(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tarea_asignaciones_usuario_id_fkey') THEN
    ALTER TABLE public.tarea_asignaciones
      ADD CONSTRAINT tarea_asignaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(user_id);
  END IF;
END $$;

-- tarea_avances
CREATE TABLE IF NOT EXISTS public.tarea_avances (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tarea_id bigint NOT NULL,
  usuario_id text NOT NULL,
  descripcion text,
  imagenes text[],
  fecha_creacion timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT tarea_avances_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tarea_avances_tarea_id_fkey') THEN
    ALTER TABLE public.tarea_avances
      ADD CONSTRAINT tarea_avances_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES public.tareas(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tarea_avances_usuario_id_fkey') THEN
    ALTER TABLE public.tarea_avances
      ADD CONSTRAINT tarea_avances_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(user_id);
  END IF;
END $$;

-- documentos_pdf (usuario_id points to current "User" id)
CREATE TABLE IF NOT EXISTS public.documentos_pdf (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre_archivo text NOT NULL,
  tipo_documento text NOT NULL,
  url_storage text NOT NULL,
  usuario_id text NOT NULL,
  usuario_nombre text NOT NULL,
  gerencia_id integer NOT NULL,
  jefatura_id integer NOT NULL,
  checklist_nombre text NOT NULL,
  fecha_creacion timestamptz NOT NULL DEFAULT now(),
  tamano_bytes bigint,
  CONSTRAINT documentos_pdf_pkey PRIMARY KEY (id),
  CONSTRAINT documentos_pdf_tipo_documento_check CHECK (tipo_documento = ANY (ARRAY['checklist','mantenimiento','sites','combustible','vehiculo']))
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_documentos_pdf_usuario') THEN
    ALTER TABLE public.documentos_pdf
      ADD CONSTRAINT fk_documentos_pdf_usuario FOREIGN KEY (usuario_id) REFERENCES public."User"(id);
  END IF;
END $$;

-- uso_car_tics
CREATE TABLE IF NOT EXISTS public.uso_car_tics (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  conductor text NOT NULL,
  destino text NOT NULL,
  hora_inicio text NOT NULL,
  nivel_combustible text NOT NULL,
  kilometraje_inicial text NOT NULL,
  foto_km_inicial bytea,
  hora_final text NOT NULL,
  kilometraje_final text NOT NULL,
  foto_km_final bytea,
  CONSTRAINT uso_car_tics_pkey PRIMARY KEY (id)
);

-- carga_car_tics
CREATE TABLE IF NOT EXISTS public.carga_car_tics (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  operador text NOT NULL,
  km_bf_carga text NOT NULL,
  foto_km_bf bytea NOT NULL,
  km_af_carga text NOT NULL,
  foto_km_af bytea NOT NULL,
  vehiculo text NOT NULL,
  foto_ticket bytea NOT NULL,
  CONSTRAINT carga_car_tics_pkey PRIMARY KEY (id)
);

COMMIT;
