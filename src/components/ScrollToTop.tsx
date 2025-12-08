import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Força o scroll para o topo absoluto
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 'instant' evita a animação que pode bugar em alguns navegadores
    });
  }, [pathname]);

  return null;
}