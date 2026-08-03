import { NavLink } from 'react-router-dom';
import { Map, MapPin, Mail, Phone } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/carte', label: 'Carte' },
  { to: '/signaler', label: 'Signaler' },
  { to: '/mes-signalements', label: 'Mes signalements' },
];

const legalLinks = [
  { label: 'Mentions légales', href: '#' },
  { label: 'Politique de confidentialité', href: '#' },
  { label: 'CGU', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">

      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'Goodly' }} className="font-bold text-lg text-slate-800 dark:text-white">Signaleo</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Plateforme citoyenne de signalement des problèmes urbains à Fianarantsoa.
          </p>
          <div className="flex items-center gap-3 pt-1">
            {/* GitHub */}
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#10B981]/20 flex items-center justify-center transition-colors group">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-400 group-hover:fill-[#10B981] transition-colors" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            {/* X */}
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#10B981]/20 flex items-center justify-center transition-colors group">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-400 group-hover:fill-[#10B981] transition-colors" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Navigation</h3>
          <ul className="space-y-2.5">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className="text-sm text-slate-400 hover:text-[#10B981] transition-colors">
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Légal */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Légal</h3>
          <ul className="space-y-2.5">
            {legalLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="text-sm text-slate-400 hover:text-[#10B981] transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="text-[#10B981] mt-0.5 shrink-0" />
              <span className="text-sm text-slate-400">Fianarantsoa, Madagascar</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="text-[#10B981] shrink-0" />
              <a href="mailto:contact@fianara.mg" className="text-sm text-slate-400 hover:text-[#10B981] transition-colors">
                contact@fianara.mg
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="text-[#10B981] shrink-0" />
              <span className="text-sm text-slate-400">+261 34 00 000 00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Signaleo. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs text-slate-500">Système opérationnel</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
