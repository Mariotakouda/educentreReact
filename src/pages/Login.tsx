import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { toast } from 'react-toastify';

// --- Icônes SVG ---
const IconEmail = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
  </svg>
);

const IconLock = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-11V7a4 4 0 118 0v4" />
  </svg>
);

const IconInfo = () => (
  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAdmin, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Connexion réussie');
      
      if (isAdmin) navigate('/admin/dashboard');
      else if (isTeacher) navigate('/teacher/dashboard');
      else if (isStudent) navigate('/student/dashboard');
      else navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-6">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Espace Membre</h1>
          <p className="mt-2 text-sm text-slate-500">Accédez à votre plateforme de formation</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Adresse email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconEmail />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 text-sm"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Mot de passe</label>
                <Link to="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Oublié ?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLock />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all font-bold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Vérification...
                </span>
              ) : 'Se connecter'}
            </Button>
          </form>

          {/* Footer Card */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Pas encore de compte ?{' '}
              <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-bold">
                Voir les formations
              </Link>
            </p>
          </div>
        </Card>

        {/* Test Accounts Info */}
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex gap-3">
          <div className="mt-0.5"><IconInfo /></div>
          <div>
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Information</h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>Admin:</strong> admin@gmail.com / admin123<br/>
              Les accès étudiants sont générés après validation par un <strong>superviseur</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;