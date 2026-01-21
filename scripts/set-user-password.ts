import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

async function main() {
  const usernameOrId = process.argv[2];
  const plainPassword = process.argv[3];

  if (!usernameOrId || !plainPassword) {
    console.error('Usage: ts-node scripts/set-user-password.ts <username|userId> <password>');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    const passwordHash = bcrypt.hashSync(plainPassword, 10);

    const byUsername = await prisma.user.findUnique({ where: { username: usernameOrId } });
    const where = byUsername ? { username: usernameOrId } : { id: usernameOrId };

    const updated = await prisma.user.update({
      where,
      data: { passwordHash },
      select: { id: true, username: true },
    });

    console.log(`OK: updated password for user id=${updated.id} username=${updated.username}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
