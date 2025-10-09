import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage';
import './index.css';

const Root = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/terminos" element={<TermsPage darkMode={darkMode} />} />
        <Route path="/privacidad" element={<PrivacyPage darkMode={darkMode} />} />
        <Route path="/normas-comunidad" element={<CommunityGuidelinesPage darkMode={darkMode} />} />
      </Routes>
    </BrowserRouter>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
);