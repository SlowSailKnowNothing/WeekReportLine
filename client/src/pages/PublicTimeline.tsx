import { useEffect, useState } from 'react';
import axios from 'axios';
import Timeline from '../components/Timeline';

interface Profile {
  name: string;
  avatar_url: string;
  bio: string;
  skills: string[];
  contact_info: {
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  cover_image: string;
}

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

export default function PublicTimeline() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [decisions, setDecisions] = useState<TimelineDecision[]>([]);
  const [loading, setLoading] = useState(true);

  // 筛选状态
  const [eventLevels, setEventLevels] = useState<string[]>(['major', 'medium', 'daily']);
  const [decisionImportance, setDecisionImportance] = useState<string[]>(['important', 'medium', 'trivial']);
  const [decisionStatus, setDecisionStatus] = useState<string[]>(['good', 'average', 'pending']);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, projectsRes, timelineRes] = await Promise.all([
        axios.get('http://localhost:3001/api/profile'),
        axios.get('http://localhost:3001/api/projects/public'),
        axios.get('http://localhost:3001/api/timeline/public'),
      ]);

      setProfile(profileRes.data);
      setProjects(projectsRes.data);
      
      // 处理事件数据
      const eventsData = timelineRes.data.events.map((e: any) => ({
        ...e,
        date: e.event_date,
        type: 'event' as const,
      }));
      
      // 处理决策数据
      const decisionsData = timelineRes.data.decisions.map((d: any) => ({
        ...d,
        date: d.decision_date,
        type: 'decision' as const,
      }));

      setEvents(eventsData);
      setDecisions(decisionsData);
      setLoading(false);
    } catch (error) {
      console.error('获取数据失败:', error);
      setLoading(false);
    }
  };

  // 切换筛选项
  const toggleFilter = (type: 'event' | 'decision-importance' | 'decision-status', value: string) => {
    if (type === 'event') {
      setEventLevels(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (type === 'decision-importance') {
      setDecisionImportance(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (type === 'decision-status') {
      setDecisionStatus(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  // 筛选后的数据
  const filteredEvents = events.filter(e => eventLevels.includes(e.level));
  const filteredDecisions = decisions.filter(d =>
    decisionImportance.includes(d.importance) &&
    decisionStatus.includes(d.implementation_status)
  );

  // 合并并排序
  const timelineItems: TimelineItem[] = [
    ...filteredEvents,
    ...filteredDecisions,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 个人信息卡片 */}
      {profile && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                />
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{profile.name}</h1>
                <p className="text-lg text-gray-600 mb-4 max-w-2xl">{profile.bio}</p>
                
                {/* 技能标签 */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* 联系方式 */}
                {profile.contact_info && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                    {profile.contact_info.email && (
                      <a href={`mailto:${profile.contact_info.email}`} className="text-gray-600 hover:text-blue-600">
                        📧 Email
                      </a>
                    )}
                    {profile.contact_info.github && (
                      <a href={profile.contact_info.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        💻 GitHub
                      </a>
                    )}
                    {profile.contact_info.linkedin && (
                      <a href={profile.contact_info.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        💼 LinkedIn
                      </a>
                    )}
                    {profile.contact_info.twitter && (
                      <a href={profile.contact_info.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        🐦 Twitter
                      </a>
                    )}
                    {profile.contact_info.website && (
                      <a href={profile.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        🌐 Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 项目展示 */}
      {projects.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">精选项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
                >
                  {project.cover_image && (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
                      >
                        查看项目 →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 时间轴 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">成长时间轴</h2>

        {/* 轻量筛选器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">🔍 筛选显示：</h3>
            <span className="text-xs text-gray-500">{timelineItems.length} 条记录</span>
          </div>
          
          <div className="space-y-3">
            {/* 事件分级 */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-gray-600 w-20">⭐ 事件:</span>
              {[
                { value: 'major', label: '重大' },
                { value: 'medium', label: '中等' },
                { value: 'daily', label: '日常' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleFilter('event', value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    eventLevels.includes(value)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {eventLevels.includes(value) && '✓ '}{label}
                </button>
              ))}
            </div>

            {/* 决策重要性 */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-gray-600 w-20">🎯 重要性:</span>
              {[
                { value: 'important', label: '重要' },
                { value: 'medium', label: '中等' },
                { value: 'trivial', label: '无关紧要' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleFilter('decision-importance', value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    decisionImportance.includes(value)
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {decisionImportance.includes(value) && '✓ '}{label}
                </button>
              ))}
            </div>

            {/* 落地情况 */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-gray-600 w-20">📊 落地:</span>
              {[
                { value: 'good', label: '很好' },
                { value: 'average', label: '一般' },
                { value: 'pending', label: '待落地' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleFilter('decision-status', value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    decisionStatus.includes(value)
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {decisionStatus.includes(value) && '✓ '}{label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 时间轴内容 */}
        <Timeline items={timelineItems} />
      </div>
    </div>
  );
}
