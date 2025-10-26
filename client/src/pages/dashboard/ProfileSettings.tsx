import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: '',
    avatar_url: '',
    bio: '',
    skills: [] as string[],
    contact_info: {
      email: '',
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    },
  });

  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/profile');
      if (response.data) {
        setProfile({
          name: response.data.name || '',
          avatar_url: response.data.avatar_url || '',
          bio: response.data.bio || '',
          skills: response.data.skills || [],
          contact_info: response.data.contact_info || {
            email: '',
            github: '',
            linkedin: '',
            twitter: '',
            website: '',
          },
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('获取个人信息失败:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put('http://localhost:3001/api/profile', profile);
      alert('个人信息保存成功！');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skill),
    });
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">个人信息配置</h1>
        <p className="text-gray-600 mt-2">这些信息将在公开展示页面显示</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <input
                type="text"
                className="input"
                placeholder="你的名字"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                头像链接
              </label>
              <input
                type="url"
                className="input"
                placeholder="https://example.com/avatar.jpg"
                value={profile.avatar_url}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              />
              {profile.avatar_url && (
                <div className="mt-3">
                  <img
                    src={profile.avatar_url}
                    alt="头像预览"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                个人简介
              </label>
              <textarea
                rows={4}
                className="input"
                placeholder="介绍一下你自己..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 技能标签 */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">技能标签</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                className="input flex-1"
                placeholder="添加技能标签（如：React, Python）"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn btn-secondary"
              >
                添加
              </button>
            </div>

            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 联系方式 */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">联系方式</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📧 邮箱
              </label>
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
                value={profile.contact_info.email}
                onChange={(e) => setProfile({
                  ...profile,
                  contact_info: { ...profile.contact_info, email: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💻 GitHub
              </label>
              <input
                type="text"
                className="input"
                placeholder="https://github.com/yourusername"
                value={profile.contact_info.github}
                onChange={(e) => setProfile({
                  ...profile,
                  contact_info: { ...profile.contact_info, github: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💼 LinkedIn
              </label>
              <input
                type="text"
                className="input"
                placeholder="https://linkedin.com/in/yourusername"
                value={profile.contact_info.linkedin}
                onChange={(e) => setProfile({
                  ...profile,
                  contact_info: { ...profile.contact_info, linkedin: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🐦 Twitter
              </label>
              <input
                type="text"
                className="input"
                placeholder="https://twitter.com/yourusername"
                value={profile.contact_info.twitter}
                onChange={(e) => setProfile({
                  ...profile,
                  contact_info: { ...profile.contact_info, twitter: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌐 个人网站
              </label>
              <input
                type="url"
                className="input"
                placeholder="https://yourwebsite.com"
                value={profile.contact_info.website}
                onChange={(e) => setProfile({
                  ...profile,
                  contact_info: { ...profile.contact_info, website: e.target.value }
                })}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary w-full"
        >
          {saving ? '保存中...' : '保存个人信息'}
        </button>
      </form>
    </div>
  );
}

