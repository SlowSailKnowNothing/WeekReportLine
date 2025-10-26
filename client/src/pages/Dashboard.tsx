import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReportsManagement from './dashboard/ReportsManagement';
import ProfileSettings from './dashboard/ProfileSettings';
import ProjectsManagement from './dashboard/ProjectsManagement';

export default function Dashboard() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
              {username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{username}</p>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/dashboard/reports"
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive('reports')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📝 周报管理
          </Link>
          <Link
            to="/dashboard/profile"
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive('profile')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            👤 个人信息
          </Link>
          <Link
            to="/dashboard/projects"
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive('projects')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            💼 项目管理
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 p-8 bg-gray-50">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="reports" element={<ReportsManagement />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="projects" element={<ProjectsManagement />} />
        </Routes>
      </main>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">管理后台</h1>
      <p className="text-gray-600 mb-8">欢迎来到管理后台，在这里你可以管理周报、个人信息和项目展示</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/reports" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-xl font-semibold mb-2">周报管理</h3>
          <p className="text-gray-600">创建和管理周报，记录事件和决策</p>
        </Link>
        
        <Link to="/dashboard/profile" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-3">👤</div>
          <h3 className="text-xl font-semibold mb-2">个人信息</h3>
          <p className="text-gray-600">配置展示页面的个人信息</p>
        </Link>
        
        <Link to="/dashboard/projects" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="text-xl font-semibold mb-2">项目管理</h3>
          <p className="text-gray-600">管理你的项目展示</p>
        </Link>
      </div>
    </div>
  );
}

