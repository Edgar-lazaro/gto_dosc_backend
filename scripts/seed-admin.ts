import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const username = args[0] ?? 'admin';
  const password = args[1];

  if (!password) {
    console.error('Uso: npx ts-node scripts/seed-admin.ts <username> <password> [nombre] [area] [email]');
    process.exit(1);
  }

  const nombre = args[2] ?? 'Administrador';
  const area = args[3] ?? 'SISTEMAS';
  const email = args[4] ?? 'admin@example.com';

  const passwordHash = bcrypt.hashSync(password, 10);

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, nombre: true, area: true, email: true },
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        nombre,
        area,
        email,
      },
      select: { id: true, username: true, nombre: true, area: true, email: true },
    });

    await ensureLegacyAdmin(updated.id, nombre);

    console.log('Admin actualizado:', { user: updated });
    return;
  }

  const created = await prisma.user.create({
    data: {
      username,
      passwordHash,
      nombre,
      area,
      email,
    },
    select: { id: true, username: true, nombre: true, area: true, email: true },
  });

  await ensureLegacyAdmin(created.id, nombre);

  console.log('Admin creado:', { user: created });
}

async function ensureLegacyAdmin(userId: string, nombre: string) {
  // Ensure an ADMIN cargo exists
  const cargoAdmin =
    (await prisma.cargos.findFirst({
      where: {
        OR: [{ nivel_cargo: 'ADMIN' }, { nombre_cargo: 'ADMIN' }],
      },
      select: { id: true },
    })) ??
    (await prisma.cargos.create({
      data: { nombre_cargo: 'ADMIN', nivel_cargo: 'ADMIN' },
      select: { id: true },
    }));

  // Ensure a gerencia and jefatura exist for linking
  const gerencia =
    (await prisma.gerencias.findFirst({
      where: { nombre: 'SISTEMAS' },
      select: { id: true },
    })) ??
    (await prisma.gerencias.create({
      data: { nombre: 'SISTEMAS', tabla_inventario: 'inv_sistemas' },
      select: { id: true },
    }));

  const jefatura =
    (await prisma.jefaturas.findFirst({
      where: { nombre_jefatura: 'SISTEMAS', gerencia: gerencia.id },
      select: { id: true },
    })) ??
    (await prisma.jefaturas.create({
      data: { nombre_jefatura: 'SISTEMAS', gerencia: gerencia.id },
      select: { id: true },
    }));

  await prisma.user.update({
    where: { id: userId },
    data: {
      apellido: 'Admin',
      gerenciaId: gerencia.id,
      jefaturaId: jefatura.id,
      cargoId: cargoAdmin.id,
      cargoLegacy: 'ADMIN',
    },
    select: { id: true },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
