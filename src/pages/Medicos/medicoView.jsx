// src/pages/Medicos/medicoView.jsx
import React from "react";
import styles from "./Medicos.module.css";

export default function MedicoView({ medico, onClose }) {
  return (
    <div className={styles.viewContainer}>
      <h2>Detalhes do Médico</h2>
      <p><strong>Nome:</strong> {medico.nome}</p>
      <p><strong>CRM:</strong> {medico.crm}</p>
      <p><strong>Especialidade:</strong> {medico.especialidade}</p>
      <p><strong>Data de Nascimento:</strong> {medico.data_nascimento}</p>
      <p><strong>Telefone:</strong> {medico.telefone}</p>
      <button onClick={onClose}>Voltar</button>
    </div>
  );
}
