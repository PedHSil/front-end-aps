import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCog } from 'react-icons/fa'; // Importando ícones
import styles from './sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li><Link to="/dashboard" className={styles.link}><FaHome /> Início</Link></li>
        <li><Link to="/dashboard/profile" className={styles.link}><FaUser /> Perfil</Link></li>
        <li><Link to="/dashboard/settings" className={styles.link}><FaCog /> Configurações</Link></li>
      </ul>
    </div>
  );
}
