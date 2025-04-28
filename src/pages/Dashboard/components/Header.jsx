import React from 'react';
import { FaPowerOff } from 'react-icons/fa'; // Ícone para sair
import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.userSection}>
        <span className={styles.welcomeText}>Bem-vindo, Usuário</span>
        <button className={styles.logoutButton}>
          <FaPowerOff /> Sair
        </button>
      </div>
    </header>
  );
}
