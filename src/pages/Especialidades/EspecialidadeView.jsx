// src/pages/Especialidades/EspecialidadeView.jsx
import React from "react";
import styles from "./Especialidades.module.css";

export default function EspecialidadeView({ especialidade, onClose }) {
  if (!especialidade) return null;

  return (
    <div className={styles.viewContainer}>
      <h2>Detalhes da Especialidade</h2>

      <div className={styles.detailGroup}>
        <p><strong>ID:</strong> {especialidade.id_especialidade}</p>
        <p><strong>Nome:</strong> {especialidade.nome}</p>
        <p><strong>Descrição:</strong> {especialidade.descricao}</p>
      </div>

      <button onClick={onClose} className={styles.btnClose}>
        Fechar
      </button>
    </div>
  );
}
