require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('Daftar tabel database inventori_kayu:');
    console.table(result.rows);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Gagal memeriksa database:', error.message);
  process.exit(1);
}); 