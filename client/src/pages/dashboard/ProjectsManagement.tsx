import { useEffect, useState } from 'react';
import axios from 'axios';

interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  cover_image: string;
  display_order: number;
  is_visible: number;
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    cover_image: '',
    display_order: 0,
    is_visible: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/projects');
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('获取项目失败:', error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      cover_image: '',
      display_order: 0,
      is_visible: true,
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      link: project.link,
      cover_image: project.cover_image,
      display_order: project.display_order,
      is_visible: project.is_visible === 1,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProject) {
        await axios.put(`http://localhost:3001/api/projects/${editingProject.id}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/projects', formData);
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('保存项目失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个项目吗？')) return;

    try {
      await axios.delete(`http://localhost:3001/api/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('删除项目失败:', error);
      alert('删除失败，请重试');
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">项目管理</h1>
          <p className="text-gray-600 mt-2">管理你的项目展示，这些项目将在公开页面显示</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? '取消' : '+ 新建项目'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? '编辑项目' : '新建项目'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目名称 *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="我的项目"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目描述
              </label>
              <textarea
                rows={4}
                className="input"
                placeholder="简要描述这个项目..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目链接
              </label>
              <input
                type="url"
                className="input"
                placeholder="https://example.com/project"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                封面图片链接
              </label>
              <input
                type="url"
                className="input"
                placeholder="https://example.com/cover.jpg"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              />
              {formData.cover_image && (
                <div className="mt-3">
                  <img
                    src={formData.cover_image}
                    alt="封面预览"
                    className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                显示顺序（数字越小越靠前）
              </label>
              <input
                type="number"
                className="input"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_visible"
                className="w-4 h-4 text-blue-600 rounded"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              />
              <label htmlFor="is_visible" className="ml-2 text-sm text-gray-700">
                在公开页面显示
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="submit" className="btn btn-primary">
                保存
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card hover:shadow-lg transition-shadow">
            {project.cover_image && (
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  {project.is_visible === 0 && (
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                      隐藏
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                    顺序: {project.display_order}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {project.description}
                </p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    🔗 查看项目 →
                  </a>
                )}
              </div>
            </div>

            <div className="flex space-x-2 pt-3 border-t">
              <button
                onClick={() => handleEdit(project)}
                className="flex-1 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="flex-1 text-red-600 hover:bg-red-50 px-4 py-2 rounded"
              >
                删除
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <p className="text-lg mb-2">还没有项目</p>
            <p className="text-sm">点击右上角"新建项目"按钮开始创建</p>
          </div>
        )}
      </div>
    </div>
  );
}

