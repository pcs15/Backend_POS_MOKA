import mysql from 'mysql2/promise';

const db = await mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'pos_db'
});

async function test() {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC LIMIT 1');
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
test();
