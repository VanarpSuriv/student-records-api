import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export const getDatabase = (dbPath?: string) => {
  const isMemory = dbPath === ':memory:';
  
  if (!isMemory && dbPath) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new Database(dbPath || ':memory:');

  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rollNumber TEXT NOT NULL UNIQUE,
      department TEXT NOT NULL,
      year INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
};
