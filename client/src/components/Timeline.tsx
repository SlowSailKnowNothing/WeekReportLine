import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  level: string;
  type: 'event';
}

interface TimelineDecision {
  id: number;
  title: string;
  description: string;
  date: string;
  importance: string;
  implementation_status: string;
  type: 'decision';
}

type TimelineItem = TimelineEvent | TimelineDecision;

interface TimelineProps {
  items: TimelineItem[];
}

const levelConfig = {
  major: { label: '重大', color: 'bg-red-500' },
  medium: { label: '中等', color: 'bg-yellow-500' },
  daily: { label: '日常', color: 'bg-gray-400' },
};

const importanceConfig = {
  important: { label: '重要', color: 'bg-purple-500' },
  medium: { label: '中等', color: 'bg-blue-500' },
  trivial: { label: '无关紧要', color: 'bg-gray-400' },
};

const statusConfig = {
  good: { label: '落地很好', color: 'bg-green-500' },
  average: { label: '落地一般', color: 'bg-orange-500' },
  pending: { label: '待落地', color: 'bg-gray-400' },
};

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* 时间轴线 */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-8">
        {items.map((item) => {
          const isEvent = item.type === 'event';
          const mainColor = isEvent 
            ? levelConfig[(item as TimelineEvent).level as keyof typeof levelConfig]?.color || 'bg-gray-500'
            : importanceConfig[(item as TimelineDecision).importance as keyof typeof importanceConfig]?.color || 'bg-gray-500';
          
          return (
            <div key={`${item.type}-${item.id}`} className="relative flex items-start group">
              {/* 时间轴节点 */}
              <div className={`absolute left-6 w-5 h-5 rounded-full ${mainColor} border-4 border-white shadow-md z-10`}></div>

              {/* 内容卡片 */}
              <div className="ml-16 flex-1">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-2xl">{isEvent ? '⭐' : '🎯'}</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${mainColor}`}>
                        {isEvent ? '事件' : '决策'}
                      </span>
                      
                      {isEvent ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {levelConfig[(item as TimelineEvent).level as keyof typeof levelConfig]?.label}
                        </span>
                      ) : (
                        <>
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {importanceConfig[(item as TimelineDecision).importance as keyof typeof importanceConfig]?.label}
                          </span>
                          {(item as TimelineDecision).implementation_status !== 'pending' && (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
                              statusConfig[(item as TimelineDecision).implementation_status as keyof typeof statusConfig]?.color
                            }`}>
                              {statusConfig[(item as TimelineDecision).implementation_status as keyof typeof statusConfig]?.label}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <time className="text-sm text-gray-500 whitespace-nowrap ml-2">
                      {format(new Date(item.date), 'yyyy年MM月dd日', { locale: zhCN })}
                    </time>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">没有符合筛选条件的数据</p>
          <p className="text-sm">调整上方的筛选条件以查看更多内容</p>
        </div>
      )}
    </div>
  );
}

