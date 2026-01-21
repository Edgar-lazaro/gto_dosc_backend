import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  const envTag = process.env.SEED_TAG?.trim();
  let tag = envTag;

  // If SEED_TAG isn't provided, try to auto-detect it from usernames seeded by seed-dummy.ts
  if (!tag) {
    const candidates = await prisma.user.findMany({
      where: { username: { startsWith: 'dummy_', contains: '_user_' } },
      select: { username: true },
      take: 50,
    });

    const tags = new Set<string>();
    for (const { username } of candidates) {
      const idx = username.indexOf('_user_');
      if (idx > 0) tags.add(username.slice(0, idx));
    }

    if (tags.size === 1) {
      tag = Array.from(tags)[0];
      console.log(`Auto-detected SEED_TAG=${tag}`);
    } else if (tags.size > 1) {
      throw new Error(
        `Missing SEED_TAG and found multiple dummy tags: ${Array.from(tags).join(', ')}. ` +
          'Please run: SEED_TAG=<tag> npm run clean:dummy',
      );
    } else {
      throw new Error('Missing SEED_TAG and no dummy users found to auto-detect it.');
    }
  }

  const tagUserPrefix = `${tag}_user_`;

  console.log(`Cleaning dummy data for tag=${tag}`);

  try {
    // Identify dummy users (never delete admin)
    const dummyUsers = await prisma.user.findMany({
      where: { username: { startsWith: tagUserPrefix } },
      select: { id: true },
    });
    const dummyUserIds = dummyUsers.map((u) => u.id);

    // Identify legacy catalog ids created by this seed
    const [dummyGerencias, dummyJefaturas, dummyCargos] = await Promise.all([
      prisma.gerencias.findMany({ where: { nombre: { startsWith: tag } }, select: { id: true } }),
      prisma.jefaturas.findMany({ where: { nombre_jefatura: { startsWith: tag } }, select: { id: true } }),
      prisma.cargos.findMany({ where: { nombre_cargo: { startsWith: tag } }, select: { id: true } }),
    ]);

    const dummyGerenciaIds = dummyGerencias.map((g) => g.id);
    const dummyJefaturaIds = dummyJefaturas.map((j) => j.id);
    const dummyCargoIds = dummyCargos.map((c) => c.id);

    // Find legacy tareas ids created by this seed
    const legacyTareas = await prisma.tareas.findMany({
      where: { titulo: { startsWith: tag } },
      select: { id: true },
    });
    const legacyTareaIds = legacyTareas.map((t) => t.id);

    // Find core entities ids created by this seed
    const [coreTareas, coreReportes] = await Promise.all([
      prisma.tarea.findMany({ where: { titulo: { startsWith: tag } }, select: { id: true } }),
      prisma.reporte.findMany({ where: { titulo: { startsWith: tag } }, select: { id: true } }),
    ]);
    const coreTareaIds = coreTareas.map((t) => t.id);
    const coreReporteIds = coreReportes.map((r) => r.id);

    // 1) Break FK references from User -> gerencias/jefaturas/cargos so we can delete catalogs
    // This also removes dummy legacy profile data from admin if it was assigned during seed.
    if (dummyGerenciaIds.length || dummyJefaturaIds.length || dummyCargoIds.length) {
      await prisma.user.updateMany({
        where: {
          OR: [
            dummyGerenciaIds.length ? { gerenciaId: { in: dummyGerenciaIds } } : undefined,
            dummyJefaturaIds.length ? { jefaturaId: { in: dummyJefaturaIds.map(BigInt) } } : undefined,
            dummyCargoIds.length ? { cargoId: { in: dummyCargoIds } } : undefined,
          ].filter(Boolean) as any,
        },
        data: {
          apellido: null,
          gerenciaId: null,
          jefaturaId: null,
          cargoId: null,
          cargoLegacy: null,
        },
      });
    }

    // 2) Delete core dependents
    if (coreReporteIds.length) {
      await prisma.evidencia.deleteMany({ where: { reporteId: { in: coreReporteIds } } });
      await prisma.reporteComentario.deleteMany({ where: { reporteId: { in: coreReporteIds } } });
      await prisma.reporteParticipante.deleteMany({ where: { reporteId: { in: coreReporteIds } } });
      await prisma.reporte.deleteMany({ where: { id: { in: coreReporteIds } } });
    }

    if (coreTareaIds.length) {
      await prisma.tareaAsignada.deleteMany({ where: { tareaId: { in: coreTareaIds } } });
      await prisma.tarea.deleteMany({ where: { id: { in: coreTareaIds } } });
    }

    if (dummyUserIds.length) {
      await prisma.asistencia.deleteMany({ where: { usuarioId: { in: dummyUserIds } } });
    }

    await prisma.notificacion.deleteMany({ where: { titulo: { startsWith: tag } } });
    await prisma.syncQueue.deleteMany({ where: { entidadId: 'dummy' } });

    // 3) Delete legacy dependents
    if (legacyTareaIds.length) {
      await prisma.tarea_avances.deleteMany({ where: { tarea_id: { in: legacyTareaIds } } });
      await prisma.tarea_asignaciones.deleteMany({ where: { tarea_id: { in: legacyTareaIds } } });
      await prisma.tareas.deleteMany({ where: { id: { in: legacyTareaIds } } });
    }

    await prisma.documentos_pdf.deleteMany({ where: { nombre_archivo: { startsWith: tag } } });
    await prisma.checklists.deleteMany({ where: { name_cl: { startsWith: `${tag}_checklist_` } } });
    await prisma.cl_existentes.deleteMany({ where: { nombre_cl: { startsWith: `${tag} CL ` } } });
    await prisma.inventario_tics.deleteMany({ where: { nombre: { startsWith: tag } } });
    await prisma.notificaciones.deleteMany({ where: { titulo: { startsWith: tag } } });
    await prisma.carga_car_tics.deleteMany({ where: { operador: { startsWith: tag } } });
    await prisma.uso_car_tics.deleteMany({ where: { conductor: { startsWith: tag } } });

    // combustible.nombre is a User.id (uuid). Delete rows that reference dummy users.
    if (dummyUserIds.length) {
      await prisma.combustible.deleteMany({ where: { nombre: { in: dummyUserIds } } });
    }

    // 4) Delete dummy users last (never delete admin)
    if (dummyUserIds.length) {
      await prisma.user.deleteMany({ where: { id: { in: dummyUserIds } } });
    }

    // 5) Delete catalogs created by this seed (after detaching from users)
    if (dummyJefaturaIds.length) {
      await prisma.jefaturas.deleteMany({ where: { id: { in: dummyJefaturaIds } } });
    }
    if (dummyGerenciaIds.length) {
      await prisma.gerencias.deleteMany({ where: { id: { in: dummyGerenciaIds } } });
    }
    if (dummyCargoIds.length) {
      await prisma.cargos.deleteMany({ where: { id: { in: dummyCargoIds } } });
    }

    console.log('Cleanup completed.');
    console.log(`- Deleted core reportes: ${coreReporteIds.length}`);
    console.log(`- Deleted core tareas: ${coreTareaIds.length}`);
    console.log(`- Deleted legacy tareas: ${legacyTareaIds.length}`);
    console.log(`- Deleted dummy users: ${dummyUserIds.length}`);
    console.log(`- Deleted gerencias/jefaturas/cargos: ${dummyGerenciaIds.length}/${dummyJefaturaIds.length}/${dummyCargoIds.length}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
