import express from 'express';
import db from './database.js';
import { authenticateToken, loginUser, registerUser } from './auth.js';

const router = express.Router();

// ==================== 认证相关 ====================
router.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  const result = registerUser(username, password);
  
  if (result.success) {
    res.json({ message: '注册成功', userId: result.userId });
  } else {
    res.status(400).json({ error: result.error });
  }
});

router.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const result = loginUser(username, password);
  
  if (result.success) {
    res.json({ token: result.token, username: result.username });
  } else {
    res.status(401).json({ error: result.error });
  }
});

// ==================== 周报相关 ====================
// 获取公开的周报列表（包含关联的事件和决策）
router.get('/api/reports/public', (req, res) => {
  try {
    const reportsStmt = db.prepare('SELECT * FROM weekly_reports WHERE is_public = 1 ORDER BY week_start_date DESC');
    const reports = reportsStmt.all();
    
    // 为每个周报获取关联的事件和决策
    reports.forEach(report => {
      const eventsStmt = db.prepare('SELECT * FROM major_events WHERE report_id = ? AND is_public = 1');
      report.events = eventsStmt.all(report.id);
      
      const decisionsStmt = db.prepare('SELECT * FROM major_decisions WHERE report_id = ? AND is_public = 1');
      report.decisions = decisionsStmt.all(report.id);
      
      // 解析 JSON 字段
      if (report.other_metrics) {
        try {
          report.other_metrics = JSON.parse(report.other_metrics);
        } catch (e) {
          report.other_metrics = {};
        }
      }
    });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取所有周报（需要认证）
router.get('/api/reports', authenticateToken, (req, res) => {
  try {
    const reportsStmt = db.prepare('SELECT * FROM weekly_reports ORDER BY week_start_date DESC');
    const reports = reportsStmt.all();
    
    // 为每个周报获取关联的事件和决策
    reports.forEach(report => {
      const eventsStmt = db.prepare('SELECT * FROM major_events WHERE report_id = ?');
      report.events = eventsStmt.all(report.id);
      
      const decisionsStmt = db.prepare('SELECT * FROM major_decisions WHERE report_id = ?');
      report.decisions = decisionsStmt.all(report.id);
      
      // 解析 JSON 字段
      if (report.other_metrics) {
        try {
          report.other_metrics = JSON.parse(report.other_metrics);
        } catch (e) {
          report.other_metrics = {};
        }
      }
    });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个周报详情
router.get('/api/reports/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const report = db.prepare('SELECT * FROM weekly_reports WHERE id = ?').get(id);
    
    if (!report) {
      return res.status(404).json({ error: '周报不存在' });
    }
    
    // 获取关联的事件和决策
    report.events = db.prepare('SELECT * FROM major_events WHERE report_id = ?').all(id);
    report.decisions = db.prepare('SELECT * FROM major_decisions WHERE report_id = ?').all(id);
    
    // 解析 JSON 字段
    if (report.other_metrics) {
      try {
        report.other_metrics = JSON.parse(report.other_metrics);
      } catch (e) {
        report.other_metrics = {};
      }
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建周报（包含事件和决策）
router.post('/api/reports', authenticateToken, (req, res) => {
  try {
    const { 
      title, 
      week_start_date, 
      week_end_date, 
      summary, 
      reading_notes, 
      no_repeat_mistakes, 
      other_metrics,
      is_public,
      events,
      decisions
    } = req.body;
    
    // 序列化 other_metrics
    const metricsJson = other_metrics ? JSON.stringify(other_metrics) : null;
    
    // 创建周报
    const reportStmt = db.prepare(`
      INSERT INTO weekly_reports 
      (title, week_start_date, week_end_date, summary, reading_notes, no_repeat_mistakes, other_metrics, is_public)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = reportStmt.run(
      title, 
      week_start_date, 
      week_end_date, 
      summary, 
      reading_notes, 
      no_repeat_mistakes, 
      metricsJson,
      is_public ? 1 : 0
    );
    
    const reportId = result.lastInsertRowid;
    
    // 创建关联的事件
    if (events && events.length > 0) {
      const eventStmt = db.prepare(`
        INSERT INTO major_events (report_id, title, description, event_date, level, is_public)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      events.forEach(event => {
        eventStmt.run(
          reportId,
          event.title,
          event.description || '',
          event.event_date,
          event.level || 'medium',
          event.is_public ? 1 : 0
        );
      });
    }
    
    // 创建关联的决策
    if (decisions && decisions.length > 0) {
      const decisionStmt = db.prepare(`
        INSERT INTO major_decisions (report_id, title, description, decision_date, importance, implementation_status, is_public)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      decisions.forEach(decision => {
        decisionStmt.run(
          reportId,
          decision.title,
          decision.description || '',
          decision.decision_date,
          decision.importance || 'medium',
          decision.implementation_status || 'pending',
          decision.is_public ? 1 : 0
        );
      });
    }
    
    res.json({ message: '周报创建成功', id: reportId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新周报
router.put('/api/reports/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      week_start_date, 
      week_end_date, 
      summary, 
      reading_notes, 
      no_repeat_mistakes, 
      other_metrics,
      is_public,
      events,
      decisions
    } = req.body;
    
    // 序列化 other_metrics
    const metricsJson = other_metrics ? JSON.stringify(other_metrics) : null;
    
    // 更新周报基本信息
    const reportStmt = db.prepare(`
      UPDATE weekly_reports 
      SET title = ?, week_start_date = ?, week_end_date = ?, summary = ?, 
          reading_notes = ?, no_repeat_mistakes = ?, other_metrics = ?, is_public = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    reportStmt.run(
      title, 
      week_start_date, 
      week_end_date, 
      summary, 
      reading_notes, 
      no_repeat_mistakes, 
      metricsJson,
      is_public ? 1 : 0,
      id
    );
    
    // 删除旧的事件和决策，重新创建
    db.prepare('DELETE FROM major_events WHERE report_id = ?').run(id);
    db.prepare('DELETE FROM major_decisions WHERE report_id = ?').run(id);
    
    // 创建新的事件
    if (events && events.length > 0) {
      const eventStmt = db.prepare(`
        INSERT INTO major_events (report_id, title, description, event_date, level, is_public)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      events.forEach(event => {
        eventStmt.run(
          id,
          event.title,
          event.description || '',
          event.event_date,
          event.level || 'medium',
          event.is_public ? 1 : 0
        );
      });
    }
    
    // 创建新的决策
    if (decisions && decisions.length > 0) {
      const decisionStmt = db.prepare(`
        INSERT INTO major_decisions (report_id, title, description, decision_date, importance, implementation_status, is_public)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      decisions.forEach(decision => {
        decisionStmt.run(
          id,
          decision.title,
          decision.description || '',
          decision.decision_date,
          decision.importance || 'medium',
          decision.implementation_status || 'pending',
          decision.is_public ? 1 : 0
        );
      });
    }
    
    res.json({ message: '周报更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除周报（级联删除事件和决策）
router.delete('/api/reports/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM weekly_reports WHERE id = ?').run(id);
    res.json({ message: '周报删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 时间轴数据接口 ====================
// 获取所有公开的事件和决策（用于时间轴展示）
router.get('/api/timeline/public', (req, res) => {
  try {
    // 获取事件
    const events = db.prepare(`
      SELECT e.*, r.title as report_title, r.week_start_date as report_date
      FROM major_events e
      LEFT JOIN weekly_reports r ON e.report_id = r.id
      WHERE e.is_public = 1
      ORDER BY e.event_date DESC
    `).all();
    
    // 获取决策
    const decisions = db.prepare(`
      SELECT d.*, r.title as report_title, r.week_start_date as report_date
      FROM major_decisions d
      LEFT JOIN weekly_reports r ON d.report_id = r.id
      WHERE d.is_public = 1
      ORDER BY d.decision_date DESC
    `).all();
    
    res.json({ events, decisions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 个人信息相关 ====================
// 获取个人信息（公开）
router.get('/api/profile', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    
    if (profile) {
      // 解析 JSON 字段
      if (profile.skills) {
        try {
          profile.skills = JSON.parse(profile.skills);
        } catch (e) {
          profile.skills = [];
        }
      }
      if (profile.contact_info) {
        try {
          profile.contact_info = JSON.parse(profile.contact_info);
        } catch (e) {
          profile.contact_info = {};
        }
      }
    }
    
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新个人信息（需要认证）
router.put('/api/profile', authenticateToken, (req, res) => {
  try {
    const { name, avatar_url, bio, skills, contact_info } = req.body;
    
    // 序列化 JSON 字段
    const skillsJson = skills ? JSON.stringify(skills) : null;
    const contactJson = contact_info ? JSON.stringify(contact_info) : null;
    
    const stmt = db.prepare(`
      UPDATE profile 
      SET name = ?, avatar_url = ?, bio = ?, skills = ?, contact_info = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `);
    
    stmt.run(name, avatar_url, bio, skillsJson, contactJson);
    
    res.json({ message: '个人信息更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 项目管理相关 ====================
// 获取所有可见项目（公开）
router.get('/api/projects/public', (req, res) => {
  try {
    const projects = db.prepare(`
      SELECT * FROM projects 
      WHERE is_visible = 1 
      ORDER BY display_order ASC, created_at DESC
    `).all();
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取所有项目（需要认证）
router.get('/api/projects', authenticateToken, (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY display_order ASC, created_at DESC').all();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建项目
router.post('/api/projects', authenticateToken, (req, res) => {
  try {
    const { title, description, link, cover_image, display_order, is_visible } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO projects (title, description, link, cover_image, display_order, is_visible)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title,
      description || '',
      link || '',
      cover_image || '',
      display_order || 0,
      is_visible !== false ? 1 : 0
    );
    
    res.json({ message: '项目创建成功', id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新项目
router.put('/api/projects/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, cover_image, display_order, is_visible } = req.body;
    
    const stmt = db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, link = ?, cover_image = ?, display_order = ?, is_visible = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      title,
      description || '',
      link || '',
      cover_image || '',
      display_order || 0,
      is_visible !== false ? 1 : 0,
      id
    );
    
    res.json({ message: '项目更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除项目
router.delete('/api/projects/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    res.json({ message: '项目删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
