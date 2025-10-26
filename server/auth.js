import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// 注册用户
export function registerUser(username, password) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  
  try {
    const result = stmt.run(username, hashedPassword);
    return { success: true, userId: result.lastInsertRowid };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return { success: false, error: '用户名已存在' };
    }
    throw error;
  }
}

// 登录验证
export function loginUser(username, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);
  
  if (!user) {
    return { success: false, error: '用户不存在' };
  }
  
  const isValid = bcrypt.compareSync(password, user.password);
  
  if (!isValid) {
    return { success: false, error: '密码错误' };
  }
  
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '7d'
  });
  
  return { success: true, token, userId: user.id, username: user.username };
}

// 验证token中间件
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效或已过期' });
    }
    req.user = user;
    next();
  });
}

