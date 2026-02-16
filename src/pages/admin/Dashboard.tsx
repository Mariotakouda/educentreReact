import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../api/apiService';
import { toast } from 'react-toastify';

// --- Types ---
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

// --- Icônes Professionnelles (Tracé 2px - Style Lucide) ---
const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const IconInbox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
);

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalCourses: 0, totalTeachers: 0, pendingEnrollments: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [c, t, e] = await Promise.all([
          apiService.adminGetCourses(),
          apiService.adminGetTeachers(),
          apiService.adminGetEnrollments('pending'),
        ]);
        setStats({ 
          totalCourses: c.data?.length || 0, 
          totalTeachers: t.data?.length || 0, 
          pendingEnrollments: e.data?.length || 0 
        });
      } catch {
        toast.error('Erreur de synchronisation');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="h-5 w-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        
        <header className="mb-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Console de gestion</h1>
            <p className="text-sm text-slate-500 mt-1 font-normal">Vue d'ensemble et pilotage des services.</p>
          </div>
          <div className="px-3 py-1 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Live Mode
          </div>
        </header>

        {/* Stats - Grid fine 1px */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-200 rounded-lg overflow-hidden mb-16 shadow-sm">
          <StatCard label="Formations" value={stats.totalCourses} icon={<IconBook />} />
          <StatCard label="Enseignants" value={stats.totalTeachers} icon={<IconUsers />} />
          <StatCard label="En attente" value={stats.pendingEnrollments} icon={<IconInbox />} />
        </div>

        {/* Navigation - Section Liste */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Navigation système</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NavItem to="/admin/courses" title="Catalogue" desc="Gérer les formations" icon={<IconBook />} count={stats.totalCourses} />
            <NavItem to="/admin/modules" title="Modules" desc="Structure pédagogique" icon={<IconLayers />} />
            <NavItem to="/admin/teachers" title="Enseignants" desc="Gestion de l'équipe" icon={<IconUsers />} count={stats.totalTeachers} />
            <NavItem to="/admin/enrollments" title="Inscriptions" desc="Validation des accès" icon={<IconInbox />} count={stats.pendingEnrollments} urgent />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Composants Internes ---

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="bg-white p-8 border-r border-slate-200 last:border-r-0">
    <div className="flex items-center gap-2 text-slate-400 mb-3">
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-4xl font-light tracking-tight text-slate-900 leading-none">{value}</p>
  </div>
);

const NavItem: React.FC<{ to: string, title: string, desc: string, icon: React.ReactNode, count?: number, urgent?: boolean }> = ({ to, title, desc, icon, count, urgent }) => (
  <Link to={to} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-lg hover:border-slate-900 transition-all group shadow-sm hover:shadow-md">
    <div className="flex items-center gap-4">
      <div className={`text-slate-400 group-hover:text-slate-900 transition-colors`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {count !== undefined && (
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${urgent && count > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
          {count}
        </span>
      )}
      <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
    </div>
  </Link>
);

export default AdminDashboard;