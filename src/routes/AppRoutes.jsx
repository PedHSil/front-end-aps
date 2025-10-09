import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Pacientes from "@/pages/Pacientes/Pacientes";
import Medicos from "@/pages/Medicos/Medicos";
import Consultas from '@/pages/Consultas/Consultas';
import Prontuarios from '@/pages/Prontuarios/Prontuarios';
import Especialidades from '@/pages/Especialidades/Especialidades';


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/medicos" element={<Medicos />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/prontuarios" element={<Prontuarios />} />
        <Route path="/especialidades" element={<Especialidades />} />
      </Routes>
    </BrowserRouter>
  );
}

