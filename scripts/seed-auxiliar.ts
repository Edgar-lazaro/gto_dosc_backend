import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();

  const username = 'auxiliar';
  const password = process.env.AUXILIAR_PASSWORD ?? 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { username },
      update: {
        passwordHash,
        nombre: 'Auxiliar',
        area: 'Operaciones',
        email: 'auxiliar@example.com',
        apellido: null,
        gerenciaId: 1,
        jefaturaId: BigInt(1),
        cargoId: 3,
        cargoLegacy: null,
      },
      create: {
        username,
        passwordHash,
        nombre: 'Auxiliar',
        area: 'Operaciones',
        email: 'auxiliar@example.com',
        gerenciaId: 1,
        jefaturaId: BigInt(1),
        cargoId: 3,
      },
      select: {
        id: true,
        username: true,
        nombre: true,
        gerenciaId: true,
        jefaturaId: true,
        cargoId: true,
      },
    });

    console.log('OK:', user);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
