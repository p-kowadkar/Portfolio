import { useState, useCallback } from 'react';
import IntroScreen from './components/Intro/IntroScreen';
import Desktop from './components/Desktop/Desktop';
import useWindowManager from './hooks/useWindowManager';

export default function App() {
  const [introComplete, setIntroComplete] = useState(
    () => sessionStorage.getItem('pk_intro_shown') === 'true'
  );
  const windowManager = useWindowManager();

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      {!introComplete && <IntroScreen onComplete={handleIntroComplete} />}
      {introComplete && <Desktop windowManager={windowManager} />}
    </>
  );
}
