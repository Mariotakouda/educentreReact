import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Course } from '../types';
import apiService from '../api/apiService';
import Card from '../components/shared/Card';
import { toast } from 'react-toastify';

// --- Icônes SVG ---
const IconArrowDown = () => (
  <svg className="w-5 h-5 ml-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const IconBookOpen = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiService.getCourses();
      setCourses(response.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Préparation de votre avenir...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section avec Dégradé Moderne */}
      <section className="relative overflow-hidden bg-slate-900 pt-32 pb-40 lg:pt-48 lg:pb-60">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"></div>
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 rounded-full border border-indigo-500/20">
            Plateforme E-Learning Officielle
          </span>
          <h1 className="max-w-4xl mx-auto text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Maîtrisez les compétences de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">demain dès aujourd'hui</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Accédez à des formations certifiantes dispensées par des experts. 
            Apprenez à votre rythme et transformez votre carrière.
          </p>
          <button
            onClick={() => document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
          >
            Découvrir le catalogue
            <IconArrowDown />
          </button>
        </div>
      </section>

      {/* Statistiques / Confiance (Ajouté pour le pro) */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Apprenants actifs", value: "1,200+" },
            { label: "Taux de réussite", value: "94%" },
            { label: "Experts formateurs", value: "25+" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Catalogue de Formations */}
      <section id="formations" className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Nos Formations</h2>
            <p className="text-slate-500">Sélectionnez le programme qui correspond à vos objectifs.</p>
          </div>
          <div className="flex gap-2">
             <span className="h-1 w-12 bg-indigo-600 rounded-full"></span>
             <span className="h-1 w-4 bg-slate-300 rounded-full"></span>
          </div>
        </div>

        {courses.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 bg-transparent py-20">
            <div className="flex flex-col items-center">
              <IconBookOpen />
              <p className="mt-4 text-slate-500 font-medium text-lg">Aucune formation disponible pour le moment.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1 transition-all duration-300">
                {/* Badge Type */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    course.type === 'jour' 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  }`}>
                    {course.type === 'jour' ? 'Session Jour' : 'Session Soir'}
                  </span>
                </div>

                {/* Placeholder Image / Icon Container */}
                <div className="h-48 bg-slate-100 flex items-center justify-center border-b border-slate-100 group-hover:bg-indigo-50 transition-colors">
                  <div className="text-indigo-600 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path d="M12 14l9-5-9-5-9 5 9 5z" strokeWidth={1} />
                       <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeWidth={1} />
                    </svg>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center text-slate-500 text-sm">
                      <IconBookOpen />
                      <span className="font-semibold">{course.modules?.length || 0} Modules</span>
                    </div>
                    
                    <Link
                      to={`/course/${course.id}`}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors"
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 Votre Plateforme E-Learning. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;