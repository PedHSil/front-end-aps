// src/components/DataTable/DataTable.jsx
import React from "react";
import styles from "./DataTable.module.css";

export default function DataTable({ columns, data = [], onEdit, onDelete, onView }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.title}</th>
          ))}
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length + 1} style={{ textAlign: "center" }}>
              Nenhum registro encontrado
            </td>
          </tr>
        )}
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col.key}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
            <td>
              {onView && (
                <button onClick={() => onView(row)} className={styles.btn}>
                  Ver
                </button>
              )}
              {onEdit && (
                <button onClick={() => onEdit(row)} className={styles.btn}>
                  Editar
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(row)} className={styles.btnDanger}>
                  Excluir
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
