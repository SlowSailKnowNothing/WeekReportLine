import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PublicTimeline from './pages/PublicTimeline';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Mistakes from './pages/Mistakes';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function Navigation() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              时间轴
            </Link>
            <Link
              to="/mistakes"
              className="text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              不贰过
            </Link>
            <Link
              to="/dashboard"
              className="text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              管理后台
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  👋 {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />

          <main>
            <Routes>
              <Route path="/" element={<PublicTimeline />} />
              <Route path="/mistakes" element={<Mistakes />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
