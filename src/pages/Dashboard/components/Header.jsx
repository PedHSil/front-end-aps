import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaCog, FaPowerOff, FaAngleDown } from 'react-icons/fa';
import styles from './header.module.css';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Fecha o dropdown quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>UNIP</div>
        <h1 className={styles.title}>Dashboard</h1>
      </div>
      
      <div className={styles.userSection} ref={dropdownRef}>
        <button className={styles.userButton} onClick={toggleDropdown}>
          <FaUserCircle className={styles.userIcon} />
          <span className={styles.userName}>Usuário</span>
          <FaAngleDown className={`${styles.dropdownIcon} ${dropdownOpen ? styles.rotated : ''}`} />
        </button>
        
        {dropdownOpen && (
          <div className={styles.dropdown}>
            <a href="/settings" className={styles.dropdownItem}>
              <FaCog /> Configurações
            </a>
            <a href="/logout" className={styles.dropdownItem}>
              <FaPowerOff /> Sair
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
