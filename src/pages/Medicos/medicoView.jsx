import React from "react";
import styles from "./Medicos.module.css";

export default function MedicoView({ medico, onClose }) {
  if (!medico) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Detalhes do Médico</h2>

        <div className={styles.detailGroup}>
          <div className={styles.detailItem}>
            <span className={styles.label}>ID</span>
            <span className={styles.value}>{medico.id || medico.id_medico || "—"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Nome</span>
            <span className={styles.value}>{medico.nome || "—"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>CRM</span>
            <span className={styles.value}>{medico.crm || "—"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Especialidade</span>
            <span className={styles.value}>{medico.especialidade?.nome || "—"}</span>
          </div>

          {medico.especialidade?.descricao && (
            <div className={styles.detailItemFull}>
              <span className={styles.label}>Descrição da Especialidade</span>
              <span className={styles.value}>{medico.especialidade.descricao}</span>
            </div>
          )}

          <div className={styles.detailItem}>
            <span className={styles.label}>Data de Nascimento</span>
            <span className={styles.value}>
              {medico.data_nascimento
                ? new Date(medico.data_nascimento).toLocaleDateString("pt-BR")
                : "—"}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Telefone</span>
            <span className={styles.value}>{medico.telefone || "—"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Status</span>
            <span
              className={`${styles.status} ${
                medico.ativo ? styles.active : styles.inactive
              }`}
            >
              {medico.ativo ? "Ativo" : "Inativo"}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
