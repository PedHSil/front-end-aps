import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaGraduationCap, FaCalendarAlt, FaBook } from 'react-icons/fa';
import styles from './sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.brandContainer}>
        <div className={styles.brand}>UNIP</div>
      </div>
      
      <nav className={styles.navigation}>
        <Link to="/dashboard" className={`${styles.navItem} ${styles.active}`}>
          <FaHome className={styles.navIcon} />
          <span>Início</span>
        </Link>
        
        <Link to="/dashboard/profile" className={styles.navItem}>
          <FaUser className={styles.navIcon} />
          <span>Perfil</span>
        </Link>

        <Link to="/dashboard/courses" className={styles.navItem}>
          <FaGraduationCap className={styles.navIcon} />
          <span>Cursos</span>
        </Link>
        
        <Link to="/dashboard/schedule" className={styles.navItem}>
          <FaCalendarAlt className={styles.navIcon} />
          <span>Agenda</span>
        </Link>
        
        <Link to="/dashboard/materials" className={styles.navItem}>
          <FaBook className={styles.navIcon} />
          <span>Materiais</span>
        </Link>
      </nav>
      
      <div className={styles.footerInfo}>
        <div className={styles.universityLogo}>UNIP</div>
        <div className={styles.copyright}>© 2025 UNIP</div>
      </div>
    </div>
  );
}