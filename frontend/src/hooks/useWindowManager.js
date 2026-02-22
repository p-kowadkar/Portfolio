import { useState, useCallback } from 'react';

const initialWindows = [
  {
    id: 'projects',
    title: 'Projects',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    defaultPosition: { x: 80, y: 60 },
    defaultSize: { width: 1000, height: 650 },
  },
  {
    id: 'chat',
    title: 'ChatPK',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    defaultPosition: { x: 150, y: 80 },
    defaultSize: { width: 420, height: 600 },
  },
  {
    id: 'videocall',
    title: 'Video Call',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    defaultPosition: { x: 200, y: 100 },
    defaultSize: { width: 600, height: 500 },
  },
  {
    id: 'messages',
    title: 'Messages',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    defaultPosition: { x: 250, y: 80 },
    defaultSize: { width: 500, height: 550 },
  },
  {
    id: 'browser',
    title: 'Browser',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    defaultPosition: { x: 120, y: 50 },
    defaultSize: { width: 1100, height: 700 },
  },
];

export default function useWindowManager() {
  const [windows, setWindows] = useState(initialWindows);
  const [topZ, setTopZ] = useState(11);

  const openWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false } : w
      )
    );
    focusWindow(id);
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isOpen: false, isMinimized: false, isMaximized: false }
          : w
      )
    );
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  }, []);

  const focusWindow = useCallback(
    (id) => {
      setTopZ((z) => {
        const newZ = z + 1;
        setWindows((prev) =>
          prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
        );
        return newZ;
      });
    },
    []
  );

  return { windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow };
}
