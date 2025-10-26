import { useEffect, useState } from 'react';
import axios from 'axios';

interface WeeklyReport {
  id: number;
  title: string;
  week_start_date: string;
  week_end_date: string;
  no_repeat_mistakes: string;
}

export default function Mistakes() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reports/public');
      
      // 只保留有不贰过内容的周报
      const reportsWithMistakes = response.data
        .filter((r: any) => r.no_repeat_mistakes && r.no_repeat_mistakes.trim() !== '')
        .map((r: any) => ({
          id: r.id,
          title: r.title,
          week_start_date: r.week_start_date,
          week_end_date: r.week_end_date,
          no_repeat_mistakes: r.no_repeat_mistakes,
        }))
        .sort((a: any, b: any) => 
          new Date(b.week_start_date).getTime() - new Date(a.week_start_date).getTime()
        );

      setReports(reportsWithMistakes);
      setLoading(false);
    } catch (error) {
      console.error('获取数据失败:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-4">🔄</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">不贰过</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            "不贰过"出自《论语》，意为不重复犯同样的错误。
            <br />
            记录错误，反思教训，持续成长。
          </p>
        </div>

        {/* 统计信息 */}
        {reports.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-red-600">{reports.length}</div>
                <div className="text-sm text-gray-600 mt-1">周报记录</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {reports.reduce((sum, r) => sum + r.no_repeat_mistakes.split('\n').filter(l => l.trim()).length, 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">错误教训</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">
                  {new Date().getFullYear() - new Date(reports[reports.length - 1]?.week_start_date).getFullYear() + 1}
                </div>
                <div className="text-sm text-gray-600 mt-1">持续年份</div>
              </div>
            </div>
          </div>
        )}

        {/* 不贰过列表 */}
        {reports.length > 0 ? (
          <div className="space-y-6">
            {reports.map((report) => {
              const lines = report.no_repeat_mistakes
                .split('\n')
                .filter(line => line.trim() !== '');
              
              return (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-red-500"
                >
                  {/* 卡片头部 */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">{report.title}</h3>
                      <span className="text-sm text-gray-500">
                        {report.week_start_date}
                      </span>
                    </div>
                  </div>

                  {/* 卡片内容 */}
                  <div className="px-6 py-5">
                    {lines.length > 1 ? (
                      // 如果是列表形式
                      <ul className="space-y-3">
                        {lines.map((line, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700 leading-relaxed flex-1">
                              {line.replace(/^\d+[\.\、]?\s*/, '')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // 如果是段落形式
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {report.no_repeat_mistakes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">暂无记录</h3>
            <p className="text-gray-600 mb-8">
              开始记录你的错误和教训，避免重蹈覆辙
            </p>
            <a
              href="/dashboard/reports"
              className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              创建第一条周报
            </a>
          </div>
        )}

        {/* 底部提示 */}
        {reports.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              💡 提示：在管理后台创建周报时，填写"不贰过"模块并设置为公开，内容就会在这里显示
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

