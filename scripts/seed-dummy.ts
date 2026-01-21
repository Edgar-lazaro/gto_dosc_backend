import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

function envInt(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (!raw) return defaultValue;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : defaultValue;
}

function seedTag(): string {
  return process.env.SEED_TAG ?? `dummy_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
}

function bytesFromString(text: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(Buffer.from(text, 'utf8')) as unknown as Uint8Array<ArrayBuffer>;
}

async function main() {
  const prisma = new PrismaClient();
  const tag = seedTag();

  const usersCount = envInt('DUMMY_USERS', 5);
  const reportesCount = envInt('DUMMY_REPORTES', 8);
  const coreTareasCount = envInt('DUMMY_CORE_TAREAS', 6);
  const legacyTareasCount = envInt('DUMMY_LEGACY_TAREAS', 6);

  const password = process.env.DUMMY_PASSWORD ?? 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  console.log(`Seeding dummy data: tag=${tag}`);

  try {
    // Core users
    const coreUsers = [] as Array<{ id: string; username: string; nombre: string; area: string; email: string }>;

    // Ensure admin exists (if already seeded, just read it)
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        passwordHash,
        nombre: 'Administrador',
        area: 'Sistemas',
        email: 'admin@example.com',
      },
      create: {
        username: 'admin',
        passwordHash,
        nombre: 'Administrador',
        area: 'Sistemas',
        email: 'admin@example.com',
      },
      select: { id: true, username: true, nombre: true, area: true, email: true },
    });
    coreUsers.push(adminUser);

    for (let i = 1; i <= usersCount; i++) {
      const username = `${tag}_user_${i}`;
      const user = await prisma.user.upsert({
        where: { username },
        update: { passwordHash },
        create: {
          username,
          passwordHash,
          nombre: `Usuario ${i}`,
          area: i % 2 === 0 ? 'Operaciones' : 'Mantenimiento',
          email: `${username}@example.com`,
        },
        select: { id: true, username: true, nombre: true, area: true, email: true },
      });
      coreUsers.push(user);
    }

    // Core: Asistencia
    await prisma.asistencia.createMany({
      data: coreUsers.flatMap((u, idx) => [
        {
          usuarioId: u.id,
          tipo: 'entrada',
          metodo: 'gps',
          fechaHora: new Date(Date.now() - (idx + 1) * 60_000),
        },
        {
          usuarioId: u.id,
          tipo: 'salida',
          metodo: 'gps',
          fechaHora: new Date(Date.now() - (idx + 1) * 30_000),
        },
      ]),
      skipDuplicates: true,
    });

    // Core: Notificacion (core)
    await prisma.notificacion.createMany({
      data: [
        {
          tipo: 'info',
          titulo: `${tag} Bienvenida`,
          mensaje: 'Notificación dummy para pruebas',
          referenciaId: null,
          leida: false,
        },
        {
          tipo: 'alerta',
          titulo: `${tag} Alerta`,
          mensaje: 'Alerta dummy para pruebas',
          referenciaId: null,
          leida: false,
        },
      ],
    });

    // Core: SyncQueue
    await prisma.syncQueue.createMany({
      data: [
        {
          entidad: 'reporte',
          entidadId: 'dummy',
          accion: 'CREATE',
          payload: { tag },
          procesado: false,
        },
        {
          entidad: 'tarea',
          entidadId: 'dummy',
          accion: 'UPDATE',
          payload: { tag },
          procesado: false,
        },
      ],
    });

    // Core: Tarea + TareaAsignada
    const creador = coreUsers[0];
    for (let i = 1; i <= coreTareasCount; i++) {
      const tarea = await prisma.tarea.create({
        data: {
          titulo: `${tag} Tarea Core ${i}`,
          descripcion: `Descripción dummy ${i}`,
          estado: i % 2 === 0 ? 'en_progreso' : 'pendiente',
          creadorId: creador.id,
        },
        select: { id: true },
      });

      const assigned = coreUsers[(i % coreUsers.length) as number];
      await prisma.tareaAsignada.upsert({
        where: { tareaId_usuarioId: { tareaId: tarea.id, usuarioId: assigned.id } },
        update: { estado: 'asignada', rol: 'responsable' },
        create: {
          tareaId: tarea.id,
          usuarioId: assigned.id,
          rol: 'responsable',
          estado: 'asignada',
        },
      });
    }

    // Core: Reporte + dependencias
    for (let i = 1; i <= reportesCount; i++) {
      const u = coreUsers[(i % coreUsers.length) as number];
      const r = await prisma.reporte.create({
        data: {
          titulo: `${tag} Reporte ${i}`,
          descripcion: `Descripción de reporte dummy ${i}`,
          area: u.area,
          estado: i % 3 === 0 ? 'cerrado' : 'abierto',
          creadorId: creador.id,
          usuarioId: u.id,
        },
        select: { id: true },
      });

      await prisma.evidencia.createMany({
        data: [
          {
            reporteId: r.id,
            tipo: 'foto',
            nombre: `${tag}_evidencia_${i}.jpg`,
            localPath: `/tmp/${tag}_evidencia_${i}.jpg`,
            synced: i % 2 === 0,
          },
        ],
      });

      await prisma.reporteComentario.create({
        data: {
          reporteId: r.id,
          usuarioId: u.id,
          mensaje: `Comentario dummy ${i}`,
        },
      });

      await prisma.reporteParticipante.upsert({
        where: { reporteId_usuarioId: { reporteId: r.id, usuarioId: creador.id } },
        update: {},
        create: { reporteId: r.id, usuarioId: creador.id },
      });
    }

    // Legacy: gerencias, cargos, jefaturas
    const ger1 = await prisma.gerencias.create({
      data: { nombre: `${tag} Gerencia 1`, tabla_inventario: 'inv_1' },
      select: { id: true },
    });
    const ger2 = await prisma.gerencias.create({
      data: { nombre: `${tag} Gerencia 2`, tabla_inventario: 'inv_2' },
      select: { id: true },
    });

    const cargoAdmin = await prisma.cargos.create({
      data: { nombre_cargo: 'ADMIN', nivel_cargo: 'ADMIN' },
      select: { id: true },
    });

    const cargo1 = await prisma.cargos.create({
      data: { nombre_cargo: `${tag} Técnico`, nivel_cargo: '1' },
      select: { id: true },
    });
    const cargo2 = await prisma.cargos.create({
      data: { nombre_cargo: `${tag} Supervisor`, nivel_cargo: '2' },
      select: { id: true },
    });

    const jef1 = await prisma.jefaturas.create({
      data: { nombre_jefatura: `${tag} Jefatura 1`, gerencia: ger1.id },
      select: { id: true, gerencia: true },
    });
    const jef2 = await prisma.jefaturas.create({
      data: { nombre_jefatura: `${tag} Jefatura 2`, gerencia: ger2.id },
      select: { id: true, gerencia: true },
    });

    // Legacy profile fields now live on core User
    const legacyUsers = [] as Array<{ id: string }>; // id is core user uuid

    const legacyUserTargets = coreUsers.slice(0, Math.min(coreUsers.length, Math.max(3, usersCount)));

    for (let i = 0; i < legacyUserTargets.length; i++) {
      const cu = legacyUserTargets[i];
      const pickJef = i % 2 === 0 ? jef1 : jef2;
      const pickGer = pickJef.gerencia;
      const pickCargo = cu.username === 'admin' ? cargoAdmin.id : i % 2 === 0 ? cargo1.id : cargo2.id;

      await prisma.user.update({
        where: { id: cu.id },
        data: {
          apellido: 'Dummy',
          gerenciaId: pickGer,
          jefaturaId: pickJef.id,
          cargoId: pickCargo,
          cargoLegacy: cu.username === 'admin' ? 'ADMIN' : i % 2 === 0 ? 'Tecnico' : 'Supervisor',
        },
        select: { id: true },
      });

      legacyUsers.push({ id: cu.id });
    }

    // Legacy: checklists (unique name_cl)
    const checklist = await prisma.checklists.upsert({
      where: { name_cl: `${tag}_checklist_1` },
      update: { nombre_cl: `${tag} Checklist 1`, user: legacyUsers[0]?.id },
      create: {
        nombre_cl: `${tag} Checklist 1`,
        name_cl: `${tag}_checklist_1`,
        user: legacyUsers[0]?.id,
        datatime: new Date(),
        system: 'ok',
        telefonia: 'ok',
      },
      select: { nombre_cl: true },
    });

    // Legacy: cl_existentes
    await prisma.cl_existentes.createMany({
      data: [
        {
          nombre_cl: `${tag} CL 1`,
          gerencia: ger1.id,
          jefatura: jef1.id,
        },
        {
          nombre_cl: `${tag} CL 2`,
          gerencia: ger2.id,
          jefatura: jef2.id,
        },
      ] as unknown as Prisma.cl_existentesCreateManyInput[],
    });

    // Legacy: inventario_tics
    await prisma.inventario_tics.createMany({
      data: [
        {
          nombre: `${tag} Laptop`,
          descripcion: 'Equipo dummy',
          cantidad: 3,
          precio: new Prisma.Decimal('15000.50'),
          categoria: 'computo',
          estado: 'disponible',
          ubicacion: 'Almacen',
          gerencia: ger1.id,
          jefatura: jef1.id,
          img: null,
        },
        {
          nombre: `${tag} Radio`,
          descripcion: 'Equipo dummy',
          cantidad: 10,
          precio: new Prisma.Decimal('900.00'),
          categoria: 'comunicacion',
          estado: 'disponible',
          ubicacion: 'Oficina',
          gerencia: ger2.id,
          jefatura: jef2.id,
          img: null,
        },
      ],
    });

    // Legacy: tareas + avances + asignaciones
    for (let i = 1; i <= legacyTareasCount; i++) {
      const asignado = legacyUsers[(i % legacyUsers.length) as number];
      const asignador = legacyUsers[0];

      const t = await prisma.tareas.create({
        data: {
          titulo: `${tag} Tarea Legacy ${i}`,
          descripcion: `Descripción legacy dummy ${i}`,
          estatus: i % 2 === 0 ? 'en_progreso' : 'pendiente',
          fecha_limite: new Date(Date.now() + i * 86_400_000),
          usuario_asignado: asignado.id,
          asignado_por: asignador.id,
        },
        select: { id: true },
      });

      await prisma.tarea_asignaciones.create({
        data: {
          tarea_id: t.id,
          usuario_id: asignado.id,
        },
      });

      await prisma.tarea_avances.create({
        data: {
          tarea_id: t.id,
          usuario_id: asignado.id,
          descripcion: `Avance dummy ${i}`,
          imagenes: [`${tag}_img_${i}.jpg`],
        },
      });
    }

    // Legacy: notificaciones
    await prisma.notificaciones.createMany({
      data: legacyUsers.slice(0, 3).map((u, idx) => ({
        usuario_id: u.id,
        tipo: 'info',
        titulo: `${tag} Notificación ${idx + 1}`,
        mensaje: 'Notificación legacy dummy',
        datos_adicionales: { tag },
        leida: false,
      })),
    });

    // Legacy: fcm_tokens
    await prisma.fcm_tokens.createMany({
      data: legacyUsers.slice(0, 3).map((u, idx) => ({
        usuario_id: u.id,
        token: `${tag}_fcm_token_${idx + 1}`,
        dispositivo_info: 'android',
        activo: true,
      })),
    });

    // Legacy: combustible (nombre is now core User uuid)
    if (legacyUsers.length > 0) {
      await prisma.combustible.create({
        data: {
          hora_ini: new Date('1970-01-01T08:00:00.000Z'),
          hora_final: new Date('1970-01-01T09:00:00.000Z'),
          nombre: legacyUsers[0].id,
          km_inicio: new Prisma.Decimal('1000'),
          lvl_km_ini: new Prisma.Decimal('0.75'),
          destino: 'Aeropuerto',
          km_final: new Prisma.Decimal('1025'),
          lvl_km_fin: new Prisma.Decimal('0.50'),
          foto_ini: { tag, side: 'ini' },
          foto_fin: { tag, side: 'fin' },
        },
      });
    }

    // Legacy: documentos_pdf (tipo_documento has CHECK)
    const firstJefaturaIdInt = Number(jef1.id);
    await prisma.documentos_pdf.createMany({
      data: [
        {
          nombre_archivo: `${tag}_checklist.pdf`,
          tipo_documento: 'checklist',
          url_storage: `https://example.com/${tag}/checklist.pdf`,
          usuario_id: coreUsers[0].id,
          usuario_nombre: coreUsers[0].nombre,
          gerencia_id: ger1.id,
          jefatura_id: Number.isFinite(firstJefaturaIdInt) ? firstJefaturaIdInt : 1,
          checklist_nombre: checklist.nombre_cl,
          tamano_bytes: BigInt(123456),
        },
        {
          nombre_archivo: `${tag}_reporte.pdf`,
          tipo_documento: 'reporte',
          url_storage: `https://example.com/${tag}/reporte.pdf`,
          usuario_id: coreUsers[1]?.id ?? coreUsers[0].id,
          usuario_nombre: coreUsers[1]?.nombre ?? coreUsers[0].nombre,
          gerencia_id: ger2.id,
          jefatura_id: Number.isFinite(firstJefaturaIdInt) ? firstJefaturaIdInt : 1,
          checklist_nombre: checklist.nombre_cl,
          tamano_bytes: BigInt(654321),
        },
      ],
    });

    // Legacy: carga_car_tics (Bytes required)
    await prisma.carga_car_tics.createMany({
      data: [
        {
          operador: `${tag} Operador 1`,
          km_bf_carga: '100',
          foto_km_bf: bytesFromString(`${tag}_km_bf`),
          km_af_carga: '120',
          foto_km_af: bytesFromString(`${tag}_km_af`),
          vehiculo: 'CAR-001',
          foto_ticket: bytesFromString(`${tag}_ticket`),
        },
      ],
    });

    // Legacy: uso_car_tics
    await prisma.uso_car_tics.createMany({
      data: [
        {
          conductor: `${tag} Conductor 1`,
          destino: 'Terminal',
          hora_inicio: '08:00',
          nivel_combustible: '3/4',
          kilometraje_inicial: '1000',
          foto_km_inicial: bytesFromString(`${tag}_uso_km_ini`),
          hora_final: '09:00',
          kilometraje_final: '1020',
          foto_km_final: bytesFromString(`${tag}_uso_km_fin`),
        },
      ],
    });

    console.log('Dummy seed completed.');
    console.log(`Core users: ${coreUsers.length}`);
    console.log(`Legacy user profiles: ${legacyUsers.length}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
