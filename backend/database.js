const Database = require("better-sqlite3");

const db = new Database("database.db");

// إنشاء جدول الطلبات
db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        project_type TEXT,
        budget TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);
try {
    db.exec(`
        ALTER TABLE contacts
        ADD COLUMN status TEXT DEFAULT 'Nouveau'
    `);
} catch (error) {
    // La colonne existe déjà
}
console.log("✅ SQLite database connected.");

module.exports = db;