import db from './config/db.js';
import bcrypt from 'bcrypt';

const run = async () => {
    try {
        console.log("1. Menambahkan kolom role ke tabel users...");
        try {
            await db.execute("ALTER TABLE users ADD COLUMN role ENUM('admin', 'kasir') NOT NULL DEFAULT 'kasir'");
            console.log("Kolom role berhasil ditambahkan.");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("Kolom role sudah ada.");
            } else {
                throw e;
            }
        }

        console.log("2. Menambahkan akun admin default...");
        const [existing] = await db.execute("SELECT * FROM users WHERE username = 'admin'");
        if (existing.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await db.execute(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                ['admin', hashedPassword, 'admin']
            );
            console.log("Berhasil membuat akun: username=admin, password=admin123, role=admin");
        } else {
            // Force update role to admin just in case
            await db.execute("UPDATE users SET role = 'admin' WHERE username = 'admin'");
            console.log("Akun admin sudah ada, pastikan role sudah diset sebagai admin.");
        }

        console.log("Update database selesai!");
        process.exit(0);
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        process.exit(1);
    }
};

run();
