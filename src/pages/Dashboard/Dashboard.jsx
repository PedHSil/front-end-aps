import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Content from './components/Content'; // O conteúdo que muda conforme a navegação

import styles from './dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <Content />
      </div>
    </div>
  );
}
