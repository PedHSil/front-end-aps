import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Content from './components/Content'; // O conteúdo que muda conforme a navegação
import styles from './dashboard.module.css';
import MateriasAluno from './components/MateriasAluno'; // Importando o componente de matérias

export default function Dashboard() {
  // Estado para controlar se a sidebar está recolhida
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Função para alternar o estado da sidebar (usando useCallback para evitar recriações desnecessárias)
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prevState => !prevState);
  }, []);
  
  // Função para definir o estado da sidebar (também com useCallback)
  const setSidebarState = useCallback((state) => {
    setSidebarCollapsed(state);
  }, []);

  return (
      <div className={styles.appContainer}>
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          setIsCollapsed={setSidebarState} 
        />
        <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
          <div className={styles.pageContent}>
          <MateriasAluno />
          </div>
        </div>
      </div>
  );
}
