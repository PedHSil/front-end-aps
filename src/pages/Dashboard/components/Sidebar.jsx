import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaGraduationCap, FaCalendarAlt, FaBook } from 'react-icons/fa';
import styles from './sidebar.module.css';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  // Handler para expandir o sidebar em hover quando estiver recolhido
  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  // Handler para recolher o sidebar quando o mouse sair (opcional)
  const handleMouseLeave = () => {
    // Você pode remover esta função se preferir que a sidebar continue expandida
    // até o usuário clicar novamente no botão de toggle
    if (!isCollapsed) {
      setIsCollapsed(true);
    }
  };

  return (
    <div 
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.brandContainer}>
        <div className={styles.brand}>
          {!isCollapsed && "UNIP"}
        </div>
      </div>
      
      <nav className={styles.navigation}>
        <Link to="/dashboard" className={`${styles.navItem} ${styles.active}`}>
          <FaHome className={styles.navIcon} />
          {!isCollapsed && <span>Início</span>}
        </Link>
        
        <Link to="/dashboard/profile" className={styles.navItem}>
          <FaUser className={styles.navIcon} />
          {!isCollapsed && <span>Perfil</span>}
        </Link>

        <Link to="/dashboard/courses" className={styles.navItem}>
          <FaGraduationCap className={styles.navIcon} />
          {!isCollapsed && <span>Cursos</span>}
        </Link>
        
        <Link to="/dashboard/schedule" className={styles.navItem}>
          <FaCalendarAlt className={styles.navIcon} />
          {!isCollapsed && <span>Agenda</span>}
        </Link>
        
        <Link to="/dashboard/materials" className={styles.navItem}>
          <FaBook className={styles.navIcon} />
          {!isCollapsed && <span>Materiais</span>}
        </Link>
      </nav>
      
      {!isCollapsed && (
        <div className={styles.footerInfo}>
          <div className={styles.universityLogo}>UNIP</div>
          <div className={styles.copyright}>© 2025 UNIP</div>
        </div>
      )}
    </div>
  );
}
