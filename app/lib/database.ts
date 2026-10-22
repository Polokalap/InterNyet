import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const globaldb = globalThis as unknown as { db: Database.Database };

const db = globaldb.db ?? new Database(path.join(dataDir, "app.db"));
if (process.env.NODE_ENV !== "production") globaldb.db = db;

function init() {

    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    db.exec(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            password TEXT NOT NULL,
            created INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            token TEXT NOT NULL,
            expiration TIMESTAMP NOT NULL
        );
    `);

}

init();

export function getDatabase(): Database.Database {

    return db;

}