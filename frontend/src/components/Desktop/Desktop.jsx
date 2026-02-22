import { motion } from 'framer-motion';
import Dock from '../Dock/Dock';
import Window from '../Window/Window';
import AchievementsWidget from '../DesktopWidgets/AchievementsWidget';
import ProjectsApp from '../apps/Projects/ProjectsApp';
import ChatPKApp from '../apps/ChatPK/ChatPKApp';
import VideoCallApp from '../apps/VideoCall/VideoCallApp';
import MessagesApp from '../apps/Messages/MessagesApp';
import BrowserApp from '../apps/Browser/BrowserApp';

const appComponents = {
  projects: ProjectsApp,
  chat: ChatPKApp,
  videocall: VideoCallApp,
  messages: MessagesApp,
  browser: BrowserApp,
};

export default function Desktop({ windowManager }) {
  const { windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow } =
    windowManager;

  return (
    <motion.div
      className="desktop relative w-full h-full"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(229,9,20,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 80%, rgba(99,102,241,0.04) 0%, transparent 60%),
          var(--bg)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <AchievementsWidget />

      {/* Windows */}
      <div className="absolute inset-0" style={{ paddingBottom: '80px' }}>
        {windows.map((win) => {
          const AppComponent = appComponents[win.id];
          if (!AppComponent) return null;
          return (
            <Window
              key={win.id}
              {...win}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onFocus={focusWindow}
            >
              <AppComponent />
            </Window>
          );
        })}
      </div>

      <Dock onOpen={openWindow} windows={windows} />
    </motion.div>
  );
}
