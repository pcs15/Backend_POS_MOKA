import db from './config/db.js';

const run = async () => {
    try {
        console.log("Menambahkan kolom status ke tabel orders...");
        try {
            await db.execute("ALTER TABLE orders ADD COLUMN status ENUM('success', 'cancelled') NOT NULL DEFAULT 'success'");
            console.log("Kolom status berhasil ditambahkan.");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("Kolom status sudah ada.");
            } else {
                throw e;
            }
        }
        
        console.log("Update database selesai!");
        process.exit(0);
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        process.exit(1);
    }
};

run();
