import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../api/apiService';
import { toast } from 'react-toastify';

// --- Types ---
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'violet';
}

// --- Icônes Professionnelles (Stroke 2px) ---
const IconBookOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);

const IconFileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalCourses: 0, totalModules: 0, totalLessons: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [c, m, l] = await Promise.all([
          apiService.teacherGetCourses(),
          apiService.teacherGetModules(),
          apiService.teacherGetLessons(),
        ]);
        setStats({
          totalCourses: c.data?.length || 0,
          totalModules: m.data?.length || 0,
          totalLessons: l.data?.length || 0,
        });
      } catch (err) {
        toast.error('Erreur de synchronisation');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white text-slate-400 font-mono text-xs tracking-widest uppercase animate-pulse">
      Initialisation du dashboard...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header Humain mais Pro */}
        <header className="mb-16 border-b border-slate-100 pb-10">
          <div className="flex items-center gap-2 text-blue-600 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Espace Formateur</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Votre activité pédagogique
          </h1>
        </header>

        {/* Statistiques - Style Grid Fine */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-16">
          <StatBox label="Formations" value={stats.totalCourses} icon={<IconBookOpen />} color="blue" />
          <StatBox label="Modules" value={stats.totalModules} icon={<IconLayers />} color="emerald" />
          <StatBox label="Leçons" value={stats.totalLessons} icon={<IconFileText />} color="violet" />
        </div>

        {/* Actions - Style Cards Minimalistes */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Outils de gestion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              to="/teacher/courses" 
              title="Catalogue" 
              desc="Éditez vos formations et leur structure." 
              icon={<IconBookOpen />} 
              accent="blue"
            />
            <ActionCard 
              to="/teacher/modules" 
              title="Modules" 
              desc="Gérez les chapitres de vos cours." 
              icon={<IconLayers />} 
              accent="emerald"
            />
            <ActionCard 
              to="/teacher/lessons" 
              title="Leçons" 
              desc="Mettez à jour vos contenus vidéos et textes." 
              icon={<IconFileText />} 
              accent="violet"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    violet: "text-violet-600 bg-violet-50"
  };

  return (
    <div className="bg-white p-8 border-r border-slate-100 last:border-r-0 transition-colors hover:bg-slate-50/50">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-light text-slate-900 mt-1 tracking-tighter">{value}</p>
    </div>
  );
};

const ActionCard: React.FC<{ to: string, title: string, desc: string, icon: React.ReactNode, accent: 'blue' | 'emerald' | 'violet' }> = ({ to, title, desc, icon, accent }) => {
  const hoverBorders = {
    blue: "hover:border-blue-500",
    emerald: "hover:border-emerald-500",
    violet: "hover:border-violet-500"
  };

  return (
    <Link to={to} className="group">
      <div className={`h-full p-8 bg-white border border-slate-200 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 ${hoverBorders[accent]}`}>
        <div className="text-slate-300 group-hover:text-slate-900 transition-colors mb-6">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight group-hover:text-inherit">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed font-normal">
          {desc}
        </p>
      </div>
    </Link>
  );
};

export default TeacherDashboard;