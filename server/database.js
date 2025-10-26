import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'data.db'));

// 初始化数据库表结构
function initDatabase() {
  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 周报表（核心表）
  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      week_start_date DATE NOT NULL,
      week_end_date DATE NOT NULL,
      summary TEXT,
      reading_notes TEXT,
      no_repeat_mistakes TEXT,
      other_metrics TEXT,
      is_public INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 重大事件表（关联周报）
  db.exec(`
    CREATE TABLE IF NOT EXISTS major_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      event_date DATE NOT NULL,
      level TEXT DEFAULT 'medium',
      is_public INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (report_id) REFERENCES weekly_reports(id) ON DELETE CASCADE
    )
  `);

  // 决策表（关联周报）
  db.exec(`
    CREATE TABLE IF NOT EXISTS major_decisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      decision_date DATE NOT NULL,
      importance TEXT DEFAULT 'medium',
      implementation_status TEXT DEFAULT 'pending',
      is_public INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (report_id) REFERENCES weekly_reports(id) ON DELETE CASCADE
    )
  `);

  // 个人信息表
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      avatar_url TEXT,
      bio TEXT,
      skills TEXT,
      contact_info TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 项目表
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      link TEXT,
      cover_image TEXT,
      display_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 初始化默认个人信息（如果不存在）
  const profileExists = db.prepare('SELECT COUNT(*) as count FROM profile').get();
  if (profileExists.count === 0) {
    db.prepare(`
      INSERT INTO profile (name, bio, skills, contact_info)
      VALUES (?, ?, ?, ?)
    `).run(
      '你的名字',
      '这里是你的个人简介...',
      JSON.stringify(['技能1', '技能2', '技能3']),
      JSON.stringify({ email: 'your@email.com', github: 'your-github' })
    );
  }

  console.log('数据库初始化完成');
}

initDatabase();

export default db;

