import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  let connection;
  try {
    console.log("Memulai pengecekan dan inisialisasi database...");
    
    // 1. Koneksi tanpa memilih database terlebih dahulu
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true // Penting untuk menjalankan banyak statement sekaligus
    });

    // 2. Buat database jika belum ada
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`Database '${process.env.DB_NAME}' dipastikan ada.`);

    // 3. Gunakan database tersebut
    await connection.query(`USE \`${process.env.DB_NAME}\``);

    // 4. Cek apakah tabel 'users' sudah ada sebagai indikator
    const [rows] = await connection.query("SHOW TABLES LIKE 'users'");
    
    if (rows.length === 0) {
      console.log("Tabel utama belum ditemukan. Mengimpor schema.sql...");
      
      // 5. Baca file schema.sql
      const schemaPath = path.join(__dirname, 'database', 'schema.sql');
      const schemaSql = await fs.readFile(schemaPath, 'utf8');
      
      // 6. Eksekusi schema (karena multipleStatements = true, ini akan berhasil)
      await connection.query(schemaSql);
      console.log("✅ Schema database berhasil diimpor!");
    } else {
      console.log("✅ Tabel sudah ada, melewati inisialisasi schema.");
    }

  } catch (error) {
    console.error("❌ Gagal menginisialisasi database:", error.message);
    process.exit(1); // Hentikan proses npm jika gagal
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDB();
