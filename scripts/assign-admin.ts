import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list')) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nombre: true,
        cargoLegacy: true,
        cargoId: true,
        cargo: { select: { nombre_cargo: true, nivel_cargo: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Users:');
    for (const u of users) {
      const cargo = u.cargo?.nombre_cargo ?? u.cargoLegacy ?? null;
      const nivel = u.cargo?.nivel_cargo ?? null;
      console.log(`- ${u.username} (${u.nombre}) cargo=${cargo ?? 'null'} nivel=${nivel ?? 'null'}`);
    }
    return;
  }

  const username = args[0];
  if (!username) {
    console.error('Uso: npm run assign:admin -- <username>');
    console.error('Opcional: npm run assign:admin -- --list');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, nombre: true },
  });

  if (!user) {
    console.error(`No existe usuario con username='${username}'.`);
    process.exit(1);
  }

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

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      apellido: 'Admin',
      gerenciaId: gerencia.id,
      jefaturaId: jefatura.id,
      cargoId: cargoAdmin.id,
      cargoLegacy: 'ADMIN',
    },
    select: { id: true, username: true, nombre: true, cargoId: true },
  });

  console.log('Cargo ADMIN asignado:');
  console.log({ user: updated, cargoAdmin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
