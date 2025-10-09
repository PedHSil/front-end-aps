import React, { useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import styles from "./Especialidades.module.css";

export default function Especialidades() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(s => !s), []);
  const setSidebarState = useCallback((s) => setSidebarCollapsed(s), []);

  return (
    <div className={styles.appContainer}>
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarState} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className={styles.pageContent}>
          <h2>Especialidades — Componente de teste</h2>
          <p>Se você está vendo isto, o import da rota funciona corretamente.</p>
        </div>
      </div>
    </div>
  );
}
