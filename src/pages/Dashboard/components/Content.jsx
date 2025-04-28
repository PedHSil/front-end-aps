import React from 'react';
import { Route, Routes } from 'react-router-dom';  // Substituindo Switch por Routes

export default function Content() {
  return (
    <main>
      <Routes>
        {/* Aqui você pode adicionar mais rotas internas */}
        <Route path="/" element={<div>Home</div>} />  {/* Exemplo de rota interna */}
      </Routes>
    </main>
  );
}
