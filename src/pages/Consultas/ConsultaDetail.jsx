import React from "react";
import styles from "./Consultas.module.css";

export default function ConsultaDetail({ consulta, onClose }) {
  if (!consulta) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Detalhes da Consulta</h2>

        <div className={styles.detailGroup}>
          <div className={styles.detailItemFull}>
            <span className={styles.label}>Paciente:</span>
            <span className={styles.value}>{consulta.paciente || consulta.pacienteId}</span>
          </div>

          <div className={styles.detailItemFull}>
            <span className={styles.label}>Médico:</span>
            <span className={styles.value}>{consulta.medico || consulta.medicoId}</span>
          </div>

          <div className={styles.detailItemFull}>
            <span className={styles.label}>Data:</span>
            <span className={styles.value}>
              {new Date(consulta.data_consulta).toLocaleString("pt-BR")}
            </span>
          </div>

          <div className={styles.detailItemFull}>
            <span className={styles.label}>Observações:</span>
            <span className={styles.value}>{consulta.observacoes || "Sem observações"}</span>
          </div>

          <div className={styles.detailItemFull}>
            <span className={styles.label}>Status:</span>
            <span
              className={`${styles.status} ${
                consulta.status === "realizada"
                  ? styles.realizada
                  : consulta.status === "cancelada"
                  ? styles.cancelada
                  : styles.agendada
              }`}
            >
              {consulta.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
