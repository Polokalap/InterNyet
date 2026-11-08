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
            user TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role INTEGER NOT NULL DEFAULT 0,
            created INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE TABLE IF NOT EXISTS settings (
            account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            display TEXT NOT NULL,
            color TEXT NOT NULL DEFAULT "#000000"
        );
        CREATE TABLE IF NOT EXISTS cooldowns (
            account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            key TEXT NOT NULL,
            expiration TIMESTAMP NOT NULL
        );
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            path TEXT NOT NULL,
            release TIMESTAMP NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            token TEXT NOT NULL,
            expiration TIMESTAMP NOT NULL
        );
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            board TEXT NOT NULL,
            title TEXT NOT NULL,
            path TEXT NOT NULL,
            spoiler BOOLEAN NOT NULL,
            release TIMESTAMP NOT NULL
        );
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            post INTEGER NOT NULL,
            spoiler BOOLEAN NOT NULL,
            path TEXT NOT NULL,
            release TIMESTAMP NOT NULL
        );
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS ratelimit (
            fingerprint TEXT NOT NULL,
            action TEXT NOT NULL,
            count INTEGER NOT NULL,
            window_start INTEGER NOT NULL,
            PRIMARY KEY (fingerprint, action)
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
        CREATE INDEX IF NOT EXISTS idx_sessions_expiration ON sessions(expiration);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
        CREATE INDEX IF NOT EXISTS idx_posts_board ON posts(board);
        CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post);
        CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post);
        CREATE INDEX IF NOT EXISTS idx_sessions_expiration ON sessions(expiration);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_post_account ON likes(post, account);
    `);

    db.exec("ANALYZE");
    db.pragma("optimize");

    db.prepare("DELETE FROM sessions WHERE expiration < unixepoch()").run();

}

init();

export function getDatabase(): Database.Database {

    return db;

}