--
-- PostgreSQL database dump
--

\restrict GhaAuDPaMeoGfVVaiewf7qbNbqHe3tmLgH6j9s06aqN5CLv00JRFY7pSAIWgW3f

-- Dumped from database version 16.11 (Homebrew)
-- Dumped by pg_dump version 16.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Asistencia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Asistencia" (
    id text NOT NULL,
    "fechaHora" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tipo text NOT NULL,
    metodo text NOT NULL,
    "usuarioId" text NOT NULL
);


--
-- Name: Evidencia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Evidencia" (
    id text NOT NULL,
    "reporteId" text NOT NULL,
    tipo text NOT NULL,
    nombre text NOT NULL,
    "localPath" text NOT NULL,
    synced boolean DEFAULT false NOT NULL
);


--
-- Name: Notificacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notificacion" (
    id text NOT NULL,
    tipo text NOT NULL,
    titulo text NOT NULL,
    mensaje text NOT NULL,
    "referenciaId" text,
    leida boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Reporte; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Reporte" (
    id text NOT NULL,
    titulo text NOT NULL,
    descripcion text NOT NULL,
    area text NOT NULL,
    estado text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creadorId" text NOT NULL,
    "usuarioId" text NOT NULL
);


--
-- Name: ReporteComentario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ReporteComentario" (
    id text NOT NULL,
    "reporteId" text NOT NULL,
    "usuarioId" text NOT NULL,
    mensaje text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ReporteParticipante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ReporteParticipante" (
    id text NOT NULL,
    "reporteId" text NOT NULL,
    "usuarioId" text NOT NULL
);


--
-- Name: Role; Type: TABLE; Schema: public; Owner: -
--
--
-- Name: SyncQueue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SyncQueue" (
    id integer NOT NULL,
    entidad text NOT NULL,
    "entidadId" text NOT NULL,
    accion text NOT NULL,
    payload jsonb,
    procesado boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: SyncQueue_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."SyncQueue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: SyncQueue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."SyncQueue_id_seq" OWNED BY public."SyncQueue".id;


--
-- Name: Tarea; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tarea" (
    id text NOT NULL,
    titulo text NOT NULL,
    descripcion text NOT NULL,
    estado text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creadorId" text NOT NULL
);


--
-- Name: TareaAsignada; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TareaAsignada" (
    id text NOT NULL,
    "tareaId" text NOT NULL,
    "usuarioId" text NOT NULL,
    rol text NOT NULL,
    estado text NOT NULL,
    "asignadaEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    "passwordHash" text NOT NULL,
    nombre text NOT NULL,
    apellido text,
    area text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "gerenciaId" smallint,
    "jefaturaId" bigint,
    "cargoId" integer,
    "cargoLegacy" text
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: carga_car_tics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carga_car_tics (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    operador text NOT NULL,
    km_bf_carga text NOT NULL,
    foto_km_bf bytea NOT NULL,
    km_af_carga text NOT NULL,
    foto_km_af bytea NOT NULL,
    vehiculo text NOT NULL,
    foto_ticket bytea NOT NULL
);


--
-- Name: carga_car_tics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.carga_car_tics ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.carga_car_tics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cargos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cargos (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    nombre_cargo text,
    nivel_cargo text
);


--
-- Name: cargos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cargos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cargos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: checklists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checklists (
    id_cl bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
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
    name_cl text NOT NULL,
    "user" text
);


--
-- Name: checklists_id_cl_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.checklists ALTER COLUMN id_cl ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.checklists_id_cl_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cl_existentes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cl_existentes (
    id bigint NOT NULL,
    nombre_cl text NOT NULL,
    gerencia smallint NOT NULL,
    jefatura bigint NOT NULL
);


--
-- Name: cl_existentes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cl_existentes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cl_existentes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: combustible; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.combustible (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    hora_ini time with time zone NOT NULL,
    hora_final time with time zone NOT NULL,
    nombre text NOT NULL,
    km_inicio numeric NOT NULL,
    lvl_km_ini numeric NOT NULL,
    destino text NOT NULL,
    km_final numeric NOT NULL,
    lvl_km_fin numeric NOT NULL,
    foto_ini json NOT NULL,
    foto_fin json NOT NULL
);


--
-- Name: combustible_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.combustible ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.combustible_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: documentos_pdf; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documentos_pdf (
    id bigint NOT NULL,
    nombre_archivo text NOT NULL,
    tipo_documento text NOT NULL,
    url_storage text NOT NULL,
    usuario_id text NOT NULL,
    usuario_nombre text NOT NULL,
    gerencia_id integer NOT NULL,
    jefatura_id integer NOT NULL,
    checklist_nombre text NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    tamano_bytes bigint,
    CONSTRAINT documentos_pdf_tipo_documento_check CHECK ((tipo_documento = ANY (ARRAY['checklist'::text, 'mantenimiento'::text, 'sites'::text, 'reporte'::text, 'mantenimiento sites'::text, 'mantenimiento mostradores'::text, 'mantenimiento telecomm'::text, 'combustible'::text, 'vehiculo'::text])))
);


--
-- Name: documentos_pdf_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.documentos_pdf ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.documentos_pdf_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: fcm_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fcm_tokens (
    id bigint NOT NULL,
    usuario_id text NOT NULL,
    token text NOT NULL,
    dispositivo_info text,
    fecha_registro timestamp with time zone DEFAULT now(),
    ultima_actualizacion timestamp with time zone DEFAULT now(),
    activo boolean DEFAULT true
);


--
-- Name: fcm_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.fcm_tokens ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fcm_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: gerencias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gerencias (
    id smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    nombre character varying,
    tabla_inventario text
);


--
-- Name: gerencias_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.gerencias ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.gerencias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: inventario_tics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventario_tics (
    id bigint NOT NULL,
    nombre character varying NOT NULL,
    descripcion text,
    cantidad integer DEFAULT 0,
    precio numeric,
    categoria character varying,
    estado character varying DEFAULT 'disponible'::character varying,
    ubicacion character varying,
    gerencia integer,
    jefatura bigint,
    img text,
    fecha_registro timestamp with time zone DEFAULT now(),
    fecha_actualizacion timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: inventario_tics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.inventario_tics ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inventario_tics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: jefaturas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jefaturas (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    nombre_jefatura text,
    gerencia smallint NOT NULL,
    img text
);


--
-- Name: jefaturas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.jefaturas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.jefaturas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notificaciones (
    id bigint NOT NULL,
    usuario_id text NOT NULL,
    tipo text NOT NULL,
    titulo text NOT NULL,
    mensaje text NOT NULL,
    datos_adicionales jsonb,
    leida boolean DEFAULT false,
    fecha_envio timestamp with time zone DEFAULT now(),
    fecha_lectura timestamp with time zone
);


--
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.notificaciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notificaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tarea_asignaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tarea_asignaciones (
    id bigint NOT NULL,
    tarea_id bigint NOT NULL,
    usuario_id text NOT NULL,
    fecha_asignacion timestamp with time zone DEFAULT now()
);


--
-- Name: tarea_asignaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tarea_asignaciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tarea_asignaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tarea_avances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tarea_avances (
    id bigint NOT NULL,
    tarea_id bigint NOT NULL,
    usuario_id text NOT NULL,
    descripcion text,
    imagenes text[],
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: tarea_avances_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tarea_avances ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tarea_avances_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tareas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tareas (
    id bigint NOT NULL,
    titulo text NOT NULL,
    descripcion text,
    estatus text DEFAULT 'pendiente'::text NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    fecha_limite date,
    usuario_asignado text NOT NULL,
    asignado_por text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT tareas_estatus_check CHECK ((estatus = ANY (ARRAY['pendiente'::text, 'en_progreso'::text, 'completada'::text, 'cancelada'::text])))
);


--
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tareas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tareas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: uso_car_tics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.uso_car_tics (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    conductor text NOT NULL,
    destino text NOT NULL,
    hora_inicio text NOT NULL,
    nivel_combustible text NOT NULL,
    kilometraje_inicial text NOT NULL,
    foto_km_inicial bytea,
    hora_final text NOT NULL,
    kilometraje_final text NOT NULL,
    foto_km_final bytea
);


--
-- Name: uso_car_tics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.uso_car_tics ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.uso_car_tics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: SyncQueue id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SyncQueue" ALTER COLUMN id SET DEFAULT nextval('public."SyncQueue_id_seq"'::regclass);


--
-- Name: Asistencia Asistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asistencia"
    ADD CONSTRAINT "Asistencia_pkey" PRIMARY KEY (id);


--
-- Name: Evidencia Evidencia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Evidencia"
    ADD CONSTRAINT "Evidencia_pkey" PRIMARY KEY (id);


--
-- Name: Notificacion Notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notificacion"
    ADD CONSTRAINT "Notificacion_pkey" PRIMARY KEY (id);


--
-- Name: ReporteComentario ReporteComentario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReporteComentario"
    ADD CONSTRAINT "ReporteComentario_pkey" PRIMARY KEY (id);


--
-- Name: ReporteParticipante ReporteParticipante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReporteParticipante"
    ADD CONSTRAINT "ReporteParticipante_pkey" PRIMARY KEY (id);


--
-- Name: Reporte Reporte_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reporte"
    ADD CONSTRAINT "Reporte_pkey" PRIMARY KEY (id);


--
-- Name: SyncQueue SyncQueue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SyncQueue"
    ADD CONSTRAINT "SyncQueue_pkey" PRIMARY KEY (id);


--
-- Name: TareaAsignada TareaAsignada_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TareaAsignada"
    ADD CONSTRAINT "TareaAsignada_pkey" PRIMARY KEY (id);


--
-- Name: Tarea Tarea_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tarea"
    ADD CONSTRAINT "Tarea_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: carga_car_tics carga_car_tics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carga_car_tics
    ADD CONSTRAINT carga_car_tics_pkey PRIMARY KEY (id);


--
-- Name: cargos cargos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cargos
    ADD CONSTRAINT cargos_pkey PRIMARY KEY (id);


--
-- Name: checklists checklists_name_cl_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklists
    ADD CONSTRAINT checklists_name_cl_key UNIQUE (name_cl);


--
-- Name: checklists checklists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklists
    ADD CONSTRAINT checklists_pkey PRIMARY KEY (id_cl);


--
-- Name: cl_existentes cl_existentes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cl_existentes
    ADD CONSTRAINT cl_existentes_pkey PRIMARY KEY (id);


--
-- Name: combustible combustible_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combustible
    ADD CONSTRAINT combustible_pkey PRIMARY KEY (id);


--
-- Name: documentos_pdf documentos_pdf_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos_pdf
    ADD CONSTRAINT documentos_pdf_pkey PRIMARY KEY (id);


--
-- Name: fcm_tokens fcm_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fcm_tokens
    ADD CONSTRAINT fcm_tokens_pkey PRIMARY KEY (id);


--
-- Name: gerencias gerencias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gerencias
    ADD CONSTRAINT gerencias_pkey PRIMARY KEY (id);


--
-- Name: inventario_tics inventario_tics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario_tics
    ADD CONSTRAINT inventario_tics_pkey PRIMARY KEY (id);


--
-- Name: jefaturas jefaturas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jefaturas
    ADD CONSTRAINT jefaturas_pkey PRIMARY KEY (id);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- Name: tarea_asignaciones tarea_asignaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarea_asignaciones
    ADD CONSTRAINT tarea_asignaciones_pkey PRIMARY KEY (id);


--
-- Name: tarea_avances tarea_avances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarea_avances
    ADD CONSTRAINT tarea_avances_pkey PRIMARY KEY (id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: uso_car_tics uso_car_tics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uso_car_tics
    ADD CONSTRAINT uso_car_tics_pkey PRIMARY KEY (id);


--
-- Name: ReporteParticipante_reporteId_usuarioId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ReporteParticipante_reporteId_usuarioId_key" ON public."ReporteParticipante" USING btree ("reporteId", "usuarioId");


--
-- Name: TareaAsignada_tareaId_usuarioId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TareaAsignada_tareaId_usuarioId_key" ON public."TareaAsignada" USING btree ("tareaId", "usuarioId");


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Asistencia Asistencia_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asistencia"
    ADD CONSTRAINT "Asistencia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Evidencia Evidencia_reporteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Evidencia"
    ADD CONSTRAINT "Evidencia_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES public."Reporte"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReporteComentario ReporteComentario_reporteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReporteComentario"
    ADD CONSTRAINT "ReporteComentario_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES public."Reporte"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReporteComentario ReporteComentario_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReporteComentario"
    ADD CONSTRAINT "ReporteComentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReporteParticipante ReporteParticipante_reporteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReporteParticipante"
    ADD CONSTRAINT "ReporteParticipante_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES public."Reporte"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReporteParticipante ReporteParticipante_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReporteParticipante"
    ADD CONSTRAINT "ReporteParticipante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reporte Reporte_creadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reporte"
    ADD CONSTRAINT "Reporte_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reporte Reporte_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reporte"
    ADD CONSTRAINT "Reporte_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TareaAsignada TareaAsignada_tareaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TareaAsignada"
    ADD CONSTRAINT "TareaAsignada_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES public."Tarea"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TareaAsignada TareaAsignada_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TareaAsignada"
    ADD CONSTRAINT "TareaAsignada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tarea Tarea_creadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tarea"
    ADD CONSTRAINT "Tarea_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_cargoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES public.cargos(id);


--
-- Name: User User_gerenciaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_gerenciaId_fkey" FOREIGN KEY ("gerenciaId") REFERENCES public.gerencias(id);


--
-- Name: User User_jefaturaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_jefaturaId_fkey" FOREIGN KEY ("jefaturaId") REFERENCES public.jefaturas(id);


--
-- Name: checklists checklists_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklists
    ADD CONSTRAINT checklists_user_fkey FOREIGN KEY ("user") REFERENCES public."User"(id);


--
-- Name: cl_existentes cl_existentes_gerencia_cl_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cl_existentes
    ADD CONSTRAINT cl_existentes_gerencia_fkey FOREIGN KEY (gerencia) REFERENCES public.gerencias(id);


--
-- Name: cl_existentes cl_existentes_jefatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cl_existentes
    ADD CONSTRAINT cl_existentes_jefatura_fkey FOREIGN KEY (jefatura) REFERENCES public.jefaturas(id);


--
-- Name: combustible combustible_nombre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combustible
    ADD CONSTRAINT combustible_nombre_fkey FOREIGN KEY (nombre) REFERENCES public."User"(id);


--
-- Name: fcm_tokens fcm_tokens_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fcm_tokens
    ADD CONSTRAINT fcm_tokens_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public."User"(id);


--
-- Name: documentos_pdf fk_documentos_pdf_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos_pdf
    ADD CONSTRAINT fk_documentos_pdf_usuario FOREIGN KEY (usuario_id) REFERENCES public."User"(id);


--
-- Name: inventario_tics inventario_tics_gerencia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario_tics
    ADD CONSTRAINT inventario_tics_gerencia_fkey FOREIGN KEY (gerencia) REFERENCES public.gerencias(id);


--
-- Name: inventario_tics inventario_tics_jefatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario_tics
    ADD CONSTRAINT inventario_tics_jefatura_fkey FOREIGN KEY (jefatura) REFERENCES public.jefaturas(id);


--
-- Name: jefaturas jefaturas_gerencia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jefaturas
    ADD CONSTRAINT jefaturas_gerencia_fkey FOREIGN KEY (gerencia) REFERENCES public.gerencias(id);


--
-- Name: notificaciones notificaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public."User"(id);


--
-- Name: tarea_asignaciones tarea_asignaciones_tarea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarea_asignaciones
    ADD CONSTRAINT tarea_asignaciones_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES public.tareas(id);


--
-- Name: tarea_asignaciones tarea_asignaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarea_asignaciones
    ADD CONSTRAINT tarea_asignaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public."User"(id);


--
-- Name: tarea_avances tarea_avances_tarea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarea_avances
    ADD CONSTRAINT tarea_avances_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES public.tareas(id);


--
-- Name: tarea_avances tarea_avances_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarea_avances
    ADD CONSTRAINT tarea_avances_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public."User"(id);


--
-- Name: tareas tareas_asignado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_asignado_por_fkey FOREIGN KEY (asignado_por) REFERENCES public."User"(id);


--
-- Name: tareas tareas_usuario_asignado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_usuario_asignado_fkey FOREIGN KEY (usuario_asignado) REFERENCES public."User"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict GhaAuDPaMeoGfVVaiewf7qbNbqHe3tmLgH6j9s06aqN5CLv00JRFY7pSAIWgW3f

