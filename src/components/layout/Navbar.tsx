import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Icônes SVG ---
const IconDashboard = () => (
  <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isTeacher) return '/teacher/dashboard';
    if (isStudent) return '/student/dashboard';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              EduCentre<span className="text-indigo-600">.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Accueil
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-6 pl-6 border-l border-slate-200">
                {/* Dashboard Link */}
                <Link 
                  to={getDashboardLink()} 
                  className="flex items-center text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <IconDashboard />
                  Dashboard
                </Link>

                {/* User Profile Mini */}
                <div className="flex items-center bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                  <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold mr-2.5">
                    {user?.firstname?.[0]}{user?.lastname?.[0]}
                  </div>
                  <div className="flex flex-col mr-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter leading-none">
                      {user?.role}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {user?.firstname}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                    title="Déconnexion"
                  >
                    <IconLogout />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  Connexion
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;