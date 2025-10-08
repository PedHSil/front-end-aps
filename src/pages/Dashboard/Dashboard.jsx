import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Content from './components/Content'; // ← este sim é o certo
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
        {/*<div className={styles.pageContent}>
          <Content />  Aqui é onde você renderiza o CRUD de notas por aluno e matéria 
        </div>*/}
      </div>
    </div>
  );
}
