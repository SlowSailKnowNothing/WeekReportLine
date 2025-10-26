import { useEffect, useState } from 'react';
import axios from 'axios';
import ReportForm from '../../components/ReportForm';

interface Report {
  id: number;
  title: string;
  week_start_date: string;
  week_end_date: string;
  summary: string;
  reading_notes?: string;
  no_repeat_mistakes?: string;
  other_metrics?: Record<string, string>;
  is_public: number;
  events: any[];
  decisions: any[];
  created_at: string;
}

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedReports, setExpandedReports] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reports');
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('获取周报失败:', error);
      setLoading(false);
    }
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条周报吗？删除后相关的事件和决策也会被删除。')) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/reports/${id}`);
      fetchReports();
    } catch (error) {
      console.error('删除周报失败:', error);
      alert('删除失败，请重试');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingReport(null);
    fetchReports();
  };

  const toggleExpand = (reportId: number) => {
    setExpandedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">周报管理</h1>
          <p className="text-gray-600 mt-2">创建和管理你的周报，包含事件、决策等信息</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? '取消' : '+ 新建周报'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ReportForm 
            report={editingReport} 
            onClose={handleFormClose}
          />
        </div>
      )}

      {/* 周报列表 */}
      <div className="space-y-6">
        {reports.map((report) => (
          <div key={report.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-semibold text-gray-900">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  📅 {report.week_start_date} 至 {report.week_end_date}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(report)}
                  className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded hover:bg-blue-50"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="text-red-600 hover:text-red-800 px-4 py-2 rounded hover:bg-red-50"
                >
                  删除
                </button>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{report.events?.length || 0}</div>
                <div className="text-sm text-gray-600">重大事件</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{report.decisions?.length || 0}</div>
                <div className="text-sm text-gray-600">决策</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {report.summary ? '✓' : '-'}
                </div>
                <div className="text-sm text-gray-600">总结</div>
              </div>
            </div>

            {/* 总结预览 - 可折叠 */}
            {report.summary && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-700">💭 总结和想法</h4>
                  <button
                    onClick={() => toggleExpand(report.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>{expandedReports.has(report.id) ? '收起' : '展开'}</span>
                    <span>{expandedReports.has(report.id) ? '▲' : '▼'}</span>
                  </button>
                </div>
                <p className={`text-gray-600 whitespace-pre-wrap transition-all duration-300 ${
                  expandedReports.has(report.id) ? '' : 'line-clamp-3'
                }`}>
                  {report.summary}
                </p>
                {!expandedReports.has(report.id) && report.summary.length > 150 && (
                  <div className="mt-2 text-sm text-gray-400">
                    ... 点击"展开"查看完整内容
                  </div>
                )}
              </div>
            )}

            {/* 事件列表 */}
            {report.events && report.events.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">⭐ 重大事件</h4>
                <div className="space-y-2">
                  {report.events.map((event, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        event.level === 'major' ? 'bg-red-100 text-red-800' :
                        event.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.level === 'major' ? '重大' : event.level === 'medium' ? '中等' : '日常'}
                      </span>
                      <span className="text-gray-700">{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 决策列表 */}
            {report.decisions && report.decisions.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">🎯 决策</h4>
                <div className="space-y-2">
                  {report.decisions.map((decision, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        decision.importance === 'important' ? 'bg-purple-100 text-purple-800' :
                        decision.importance === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {decision.importance === 'important' ? '重要' : 
                         decision.importance === 'medium' ? '中等' : '无关紧要'}
                      </span>
                      {decision.implementation_status && decision.implementation_status !== 'pending' && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          decision.implementation_status === 'good' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {decision.implementation_status === 'good' ? '落地很好' : '落地一般'}
                        </span>
                      )}
                      <span className="text-gray-700">{decision.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 阅读记录 - 可折叠 */}
            {report.reading_notes && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-700">📚 阅读学习记录</h4>
                  <button
                    onClick={() => toggleExpand(report.id + 10000)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>{expandedReports.has(report.id + 10000) ? '收起' : '展开'}</span>
                    <span>{expandedReports.has(report.id + 10000) ? '▲' : '▼'}</span>
                  </button>
                </div>
                <p className={`text-gray-600 whitespace-pre-wrap transition-all duration-300 ${
                  expandedReports.has(report.id + 10000) ? '' : 'line-clamp-2'
                }`}>
                  {report.reading_notes}
                </p>
              </div>
            )}

            {/* 不贰过 - 可折叠 */}
            {report.no_repeat_mistakes && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-700">🔄 不贰过</h4>
                  <button
                    onClick={() => toggleExpand(report.id + 20000)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>{expandedReports.has(report.id + 20000) ? '收起' : '展开'}</span>
                    <span>{expandedReports.has(report.id + 20000) ? '▲' : '▼'}</span>
                  </button>
                </div>
                <p className={`text-gray-600 whitespace-pre-wrap transition-all duration-300 ${
                  expandedReports.has(report.id + 20000) ? '' : 'line-clamp-2'
                }`}>
                  {report.no_repeat_mistakes}
                </p>
              </div>
            )}

            {/* 其他指标 */}
            {report.other_metrics && Object.keys(report.other_metrics).length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">📊 其他指标</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(report.other_metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded px-3 py-2">
                      <div className="text-xs text-gray-500">{key}</div>
                      <div className="text-sm font-medium text-gray-900">{value as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">还没有周报</p>
            <p className="text-sm">点击右上角"新建周报"按钮开始创建</p>
          </div>
        )}
      </div>
    </div>
  );
}
