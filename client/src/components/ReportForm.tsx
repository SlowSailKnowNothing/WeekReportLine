import { useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
  title: string;
  description: string;
  event_date: string;
  level: string;
  is_public: boolean;
}

interface Decision {
  title: string;
  description: string;
  decision_date: string;
  importance: string;
  implementation_status: string;
  is_public: boolean;
}

interface ReportFormProps {
  report?: any;
  onClose: () => void;
}

export default function ReportForm({ report, onClose }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    week_start_date: '',
    week_end_date: '',
    summary: '',
    reading_notes: '',
    no_repeat_mistakes: '',
    other_metrics: {} as Record<string, string>,
    is_public: true, // 默认公开
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [newMetricKey, setNewMetricKey] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || '',
        week_start_date: report.week_start_date || '',
        week_end_date: report.week_end_date || '',
        summary: report.summary || '',
        reading_notes: report.reading_notes || '',
        no_repeat_mistakes: report.no_repeat_mistakes || '',
        other_metrics: report.other_metrics || {},
        is_public: true, // 始终公开
      });
      setEvents(report.events || []);
      setDecisions(report.decisions || []);
    }
  }, [report]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        events: events.filter(e => e.title.trim() !== ''),
        decisions: decisions.filter(d => d.title.trim() !== ''),
      };

      if (report) {
        await axios.put(`http://localhost:3001/api/reports/${report.id}`, data);
      } else {
        await axios.post('http://localhost:3001/api/reports', data);
      }

      alert(report ? '周报更新成功！' : '周报创建成功！');
      onClose();
    } catch (error) {
      console.error('保存周报失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const addEvent = () => {
    setEvents([...events, {
      title: '',
      description: '',
      event_date: formData.week_start_date || new Date().toISOString().split('T')[0],
      level: 'medium',
      is_public: true, // 始终公开
    }]);
  };

  const updateEvent = (index: number, field: keyof Event, value: any) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEvents(newEvents);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const addDecision = () => {
    setDecisions([...decisions, {
      title: '',
      description: '',
      decision_date: formData.week_start_date || new Date().toISOString().split('T')[0],
      importance: 'medium',
      implementation_status: 'pending',
      is_public: true, // 始终公开
    }]);
  };

  const updateDecision = (index: number, field: keyof Decision, value: any) => {
    const newDecisions = [...decisions];
    newDecisions[index] = { ...newDecisions[index], [field]: value };
    setDecisions(newDecisions);
  };

  const removeDecision = (index: number) => {
    setDecisions(decisions.filter((_, i) => i !== index));
  };

  const addMetric = () => {
    if (newMetricKey.trim() && newMetricValue.trim()) {
      setFormData({
        ...formData,
        other_metrics: {
          ...formData.other_metrics,
          [newMetricKey]: newMetricValue,
        },
      });
      setNewMetricKey('');
      setNewMetricValue('');
    }
  };

  const removeMetric = (key: string) => {
    const newMetrics = { ...formData.other_metrics };
    delete newMetrics[key];
    setFormData({ ...formData, other_metrics: newMetrics });
  };

  return (
    <div className="card max-w-5xl">
      <h2 className="text-2xl font-bold mb-6">
        {report ? '编辑周报' : '新建周报'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本信息 */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded mr-3"></span>
            基本信息
          </h3>
          <div className="space-y-4 ml-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题 *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="例如：第42周周报"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  开始日期 *
                </label>
                <input
                  type="date"
                  required
                  className="input"
                  value={formData.week_start_date}
                  onChange={(e) => setFormData({ ...formData, week_start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  结束日期 *
                </label>
                <input
                  type="date"
                  required
                  className="input"
                  value={formData.week_end_date}
                  onChange={(e) => setFormData({ ...formData, week_end_date: e.target.value })}
                />
              </div>
            </div>

          </div>
        </section>

        {/* 重大事件 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-6 bg-green-500 rounded mr-3"></span>
              ⭐ 重大事件
            </h3>
            <button
              type="button"
              onClick={addEvent}
              className="text-sm btn btn-secondary"
            >
              + 添加事件
            </button>
          </div>
          <div className="space-y-4 ml-5">
            {events.map((event, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-600">事件 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEvent(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="事件标题 *"
                    className="input"
                    value={event.title}
                    onChange={(e) => updateEvent(index, 'title', e.target.value)}
                  />
                  <textarea
                    placeholder="事件描述"
                    rows={3}
                    className="input"
                    value={event.description}
                    onChange={(e) => updateEvent(index, 'description', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">事件日期</label>
                      <input
                        type="date"
                        className="input"
                        value={event.event_date}
                        onChange={(e) => updateEvent(index, 'event_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">事件分级</label>
                      <select
                        className="input"
                        value={event.level}
                        onChange={(e) => updateEvent(index, 'level', e.target.value)}
                      >
                        <option value="major">重大</option>
                        <option value="medium">中等</option>
                        <option value="daily">日常</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                暂无事件，点击"添加事件"按钮创建
              </p>
            )}
          </div>
        </section>

        {/* 决策 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-6 bg-purple-500 rounded mr-3"></span>
              🎯 决策
            </h3>
            <button
              type="button"
              onClick={addDecision}
              className="text-sm btn btn-secondary"
            >
              + 添加决策
            </button>
          </div>
          <div className="space-y-4 ml-5">
            {decisions.map((decision, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-600">决策 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeDecision(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="决策标题 *"
                    className="input"
                    value={decision.title}
                    onChange={(e) => updateDecision(index, 'title', e.target.value)}
                  />
                  <textarea
                    placeholder="决策描述"
                    rows={3}
                    className="input"
                    value={decision.description}
                    onChange={(e) => updateDecision(index, 'description', e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">决策日期</label>
                      <input
                        type="date"
                        className="input"
                        value={decision.decision_date}
                        onChange={(e) => updateDecision(index, 'decision_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">重要性</label>
                      <select
                        className="input"
                        value={decision.importance}
                        onChange={(e) => updateDecision(index, 'importance', e.target.value)}
                      >
                        <option value="important">重要</option>
                        <option value="medium">中等</option>
                        <option value="trivial">无关紧要</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">落地情况</label>
                      <select
                        className="input"
                        value={decision.implementation_status}
                        onChange={(e) => updateDecision(index, 'implementation_status', e.target.value)}
                      >
                        <option value="pending">待落地</option>
                        <option value="good">落地很好</option>
                        <option value="average">落地一般</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {decisions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                暂无决策，点击"添加决策"按钮创建
              </p>
            )}
          </div>
        </section>

        {/* 总结和想法 */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-2 h-6 bg-yellow-500 rounded mr-3"></span>
            💭 总结和想法
          </h3>
          <div className="ml-5">
            <textarea
              rows={6}
              className="input"
              placeholder="写下本周的总结、反思和想法..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>
        </section>

        {/* 阅读、学习记录 */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-2 h-6 bg-indigo-500 rounded mr-3"></span>
            📚 阅读、学习记录 <span className="text-sm text-gray-500 ml-2">(可选)</span>
          </h3>
          <div className="ml-5">
            <textarea
              rows={4}
              className="input"
              placeholder="记录本周阅读的书籍、文章或学习的内容..."
              value={formData.reading_notes}
              onChange={(e) => setFormData({ ...formData, reading_notes: e.target.value })}
            />
          </div>
        </section>

        {/* 不贰过 */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-2 h-6 bg-red-500 rounded mr-3"></span>
            🔄 不贰过 <span className="text-sm text-gray-500 ml-2">(可选)</span>
          </h3>
          <div className="ml-5">
            <textarea
              rows={4}
              className="input"
              placeholder="反思本周的错误和不足，避免重复犯错..."
              value={formData.no_repeat_mistakes}
              onChange={(e) => setFormData({ ...formData, no_repeat_mistakes: e.target.value })}
            />
          </div>
        </section>

        {/* 其他指标 */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-2 h-6 bg-teal-500 rounded mr-3"></span>
            📊 其他指标 <span className="text-sm text-gray-500 ml-2">(可选)</span>
          </h3>
          <div className="ml-5 space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="指标名称（如：运动次数）"
                className="input flex-1"
                value={newMetricKey}
                onChange={(e) => setNewMetricKey(e.target.value)}
              />
              <input
                type="text"
                placeholder="指标值（如：3次）"
                className="input flex-1"
                value={newMetricValue}
                onChange={(e) => setNewMetricValue(e.target.value)}
              />
              <button
                type="button"
                onClick={addMetric}
                className="btn btn-secondary"
              >
                添加
              </button>
            </div>
            
            {Object.keys(formData.other_metrics).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.other_metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="ml-2 text-gray-600">{value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMetric(key)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 提交按钮 */}
        <div className="flex space-x-4 pt-6 border-t">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary flex-1"
          >
            {submitting ? '保存中...' : (report ? '更新周报' : '创建周报')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

