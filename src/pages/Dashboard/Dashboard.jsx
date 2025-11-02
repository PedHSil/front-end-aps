// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Content from './components/Content'; // ← este sim é o certo
import QuickPanel from './components/QuickPanel'; // <-- novo
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prevState => !prevState);
  }, []);

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

        {/* aqui inserimos o QuickPanel que consome todo o dashboard.service.js */}
        <div style={{ padding: "0 2rem", marginTop: 12 }}>
          <QuickPanel patientId={1} medicoId={1} />
        </div>

        {/*<div className={styles.pageContent}>
          <Content />  Aqui é onde você renderiza o CRUD de notas por aluno e matéria 
        </div>*/}
      </div>
    </div>
  );
}
