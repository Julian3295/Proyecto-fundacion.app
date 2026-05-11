const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  try {
    const cols = await p.$queryRawUnsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Usuario'");
    console.log('COLUMNS:');
    cols.forEach(c => console.log(' ', c.column_name, c.data_type));
    const users = await p.usuario.findMany();
    console.log('USERS:', users.length);
  } catch(e) {
    console.error('ERROR:', e.message);
    console.error('STACK:', e.stack);
  } finally {
    await p.$disconnect();
  }
}
main();
