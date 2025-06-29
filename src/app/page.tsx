'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // Oculta a tela de splash após 3 segundos
      router.push('/login'); // Redireciona para o dashboard
    }, 4000);

    return () => clearTimeout(timer); // Limpa o timer caso o componente seja desmontado
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600 text-white">
      {show && (
        <div className="text-center">
          <p className="text-lg mt-2 animate-fade-in delay-500">
            Preparando tudo para você...
          </p>
        </div>
      )}
    </div>
  );
}
