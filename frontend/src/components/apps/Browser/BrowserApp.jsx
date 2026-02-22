import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { experience } from '../../../data/experience';
import { education } from '../../../data/education';

const tabs = [
  { id: 'experience', label: 'Experience', url: 'pk://experience' },
  { id: 'education', label: 'Education', url: 'pk://education' },
  { id: 'careerforge', label: 'CareerForge', url: 'forge-your-future.com' },
];

function ExperienceTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="font-serif text-2xl mb-6">Experience</h2>
      <div className="relative pl-6">
        {/* Timeline line */}
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ background: 'var(--accent)' }}
        />
        {experience.map((exp) => (
          <div key={exp.id} className="relative mb-6">
            {/* Dot */}
            <div
              className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2"
              style={{
                borderColor: 'var(--accent)',
                background: exp.current ? 'var(--accent)' : 'var(--bg)',
              }}
            />
            <button
              className="w-full text-left p-4 rounded-lg transition-colors hover:bg-white/5"
              style={{ background: expanded === exp.id ? 'var(--surface2)' : undefined }}
              onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="font-medium text-sm">{exp.role}</span>
                  <span className="text-sm ml-2" style={{ color: 'var(--muted)' }}>
                    @ {exp.company}
                  </span>
                  {exp.detail && (
                    <span className="text-xs ml-2" style={{ color: 'var(--subtle)' }}>
                      · {exp.detail}
                    </span>
                  )}
                </div>
                {exp.current && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={{ background: 'var(--accent)', color: 'white' }}>
                    CURRENT
                  </span>
                )}
              </div>
              <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                {exp.period}
              </p>

              {expanded === exp.id && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <ul className="space-y-2 mb-3">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="text-xs leading-relaxed flex gap-2" style={{ color: 'var(--text)', opacity: 0.85 }}>
                        <span style={{ color: 'var(--accent)' }}>▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono"
                        style={{ background: 'var(--surface)', color: 'var(--muted)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationTab() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="font-serif text-2xl mb-6">Education</h2>
      <div className="space-y-6">
        {education.map((edu, i) => (
          <div
            key={i}
            className="p-5 rounded-lg"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-serif text-lg mb-1">{edu.degree}</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {edu.institution} · {edu.location}
            </p>
            <p className="text-xs font-mono mt-1 mb-3" style={{ color: 'var(--subtle)' }}>
              {edu.period}
            </p>
            <ul className="space-y-1.5">
              {edu.highlights.map((h, j) => (
                <li key={j} className="text-xs flex gap-2" style={{ color: 'var(--text)', opacity: 0.85 }}>
                  <span style={{ color: 'var(--accent)' }}>▸</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CareerForgeTab() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
        Opening external link...
      </p>
      <a
        href="https://www.forge-your-future.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:brightness-110"
        style={{ background: 'var(--accent)' }}
      >
        Open CareerForge ↗
      </a>
      <a
        href="https://p-kowadkar.github.io/careerforge"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs underline"
        style={{ color: 'var(--muted)' }}
      >
        View Value Proposition
      </a>
    </div>
  );
}

export default function BrowserApp() {
  const [activeTab, setActiveTab] = useState('experience');
  const [history, setHistory] = useState(['experience']);
  const [historyIdx, setHistoryIdx] = useState(0);

  const currentTab = tabs.find((t) => t.id === activeTab);

  const goTo = (id) => {
    const newHistory = [...history.slice(0, historyIdx + 1), id];
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setActiveTab(id);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setActiveTab(history[historyIdx - 1]);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setActiveTab(history[historyIdx + 1]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* URL bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={goBack}
          disabled={historyIdx <= 0}
          className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={goForward}
          disabled={historyIdx >= history.length - 1}
          className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
        <div
          className="flex-1 px-3 py-1 rounded-md text-xs font-mono"
          style={{ background: 'var(--surface)', color: 'var(--muted)' }}
        >
          {currentTab?.url}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => goTo(tab.id)}
            className="px-4 py-2 text-xs font-mono transition-colors"
            style={{
              color: activeTab === tab.id ? 'var(--text)' : 'var(--muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'experience' && <ExperienceTab />}
        {activeTab === 'education' && <EducationTab />}
        {activeTab === 'careerforge' && <CareerForgeTab />}
      </div>
    </div>
  );
}
