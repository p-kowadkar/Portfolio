import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '../../../data/projects';

const badgeColors = {
  gold: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
  red: 'bg-red-600/20 text-red-400 border-red-500/30',
  gray: 'bg-gray-600/20 text-gray-400 border-gray-500/30',
  blue: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
};

export default function ProjectsApp() {
  const [selected, setSelected] = useState(projects[0].id);
  const project = projects.find((p) => p.id === selected);

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div
        className="w-[280px] shrink-0 border-r overflow-y-auto"
        style={{ borderColor: 'var(--border)' }}
      >
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className="w-full text-left px-4 py-3 transition-colors hover:bg-white/5 flex items-center gap-3"
            style={{
              borderLeft: p.id === selected ? '3px solid var(--accent)' : '3px solid transparent',
              background: p.id === selected ? 'var(--accent-dim)' : undefined,
            }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {p.name}
            </span>
          </button>
        ))}
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-6">
        {project && (
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl mb-2">{project.name}</h2>

            {project.badge && (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono border mb-3 ${
                  badgeColors[project.badgeColor] || ''
                }`}
              >
                {project.badge}
              </span>
            )}

            <p className="text-[15px] mb-4" style={{ color: 'var(--muted)' }}>
              {project.tagline}
            </p>

            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text)', opacity: 0.85 }}>
              {project.description}
            </p>

            {project.orchestration && (
              <div className="mb-5">
                <span
                  className="inline-block px-3 py-1.5 rounded-lg text-xs font-mono border"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  {project.orchestration}
                </span>
              </div>
            )}

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:brightness-110"
                  style={{ background: 'var(--surface2)', color: 'var(--text)' }}
                >
                  <Github size={16} />
                  GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:brightness-110"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
              {project.valueProp && (
                <a
                  href={project.valueProp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium underline"
                  style={{ color: 'var(--muted)' }}
                >
                  Value Proposition
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
