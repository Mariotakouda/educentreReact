import React from 'react';
import { Link } from 'react-router-dom';

// --- Icônes SVG ---
const IconFacebook = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
);

const IconTwitter = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Section 1: Brand & Bio */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight">EduCentre<span className="text-indigo-500">.</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Plateforme d'apprentissage en ligne dédiée à l'excellence académique et professionnelle. Formez-vous avec les meilleurs experts.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Accueil</Link></li>
              <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">Toutes les formations</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Espace membre</Link></li>
            </ul>
          </div>

          {/* Section 3: Legal / Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Aide & FAQ</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Section 4: Socials & Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Nous suivre</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <IconFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <IconTwitter />
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              Besoin d'aide ?<br/>
              <span className="text-slate-300 font-semibold">contact@EduCentre.com</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            &copy; 2026 E-Learning Platform. Propriété du service provider.
          </p>
          <div className="flex items-center space-x-6 text-xs font-bold text-slate-500">
             <span className="flex items-center gap-1">
               <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
               Système Opérationnel
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;