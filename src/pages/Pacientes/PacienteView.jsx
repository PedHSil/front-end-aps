// src/pages/Pacientes/PacienteView.jsx
import React from "react";
import styles from "./Pacientes.module.css";

export default function PacienteView({ paciente, onClose }) {
  if (!paciente) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Detalhes do Paciente</h3>
        <p><strong>Nome:</strong> {paciente.nome}</p>
        <p><strong>CPF:</strong> {paciente.cpf}</p>
        <p><strong>Data Nascimento:</strong> {paciente.data_nascimento}</p>
        <p><strong>Telefone:</strong> {paciente.telefone}</p>
        <p><strong>Email:</strong> {paciente.email}</p>
        <div style={{textAlign:"right"}}>
          <button onClick={onClose} className={styles.btn}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
