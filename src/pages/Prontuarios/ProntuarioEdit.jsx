import React, { useState, useEffect } from "react";
import styles from "./Prontuarios.module.css";

export default function ProntuarioEdit({ initialData, onSave, onCancel, readOnly }) {
  const [form, setForm] = useState({
    anamnese: "",
    diagnostico: "",
    prescricao: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        anamnese: initialData.anamnese ?? "",
        diagnostico: initialData.diagnostico ?? "",
        prescricao: initialData.prescricao ?? "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.diagnostico && !window.confirm("Salvar prontuário sem diagnóstico?")) return;

    setError(null);
    setSubmitting(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err?.message || "Erro ao salvar prontuário");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{readOnly ? "Visualizar Prontuário" : "Editar Prontuário"}</h2>
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Anamnese
            <textarea
              name="anamnese"
              value={form.anamnese}
              onChange={handleChange}
              rows={4}
              disabled={readOnly || submitting}
            />
          </label>

          <label>
            Diagnóstico
            <textarea
              name="diagnostico"
              value={form.diagnostico}
              onChange={handleChange}
              rows={3}
              disabled={readOnly || submitting}
            />
          </label>

          <label>
            Prescrição
            <textarea
              name="prescricao"
              value={form.prescricao}
              onChange={handleChange}
              rows={3}
              disabled={readOnly || submitting}
            />
          </label>

          {!readOnly && (
            <div className={styles.actions}>
              <button type="submit" className={styles.save} disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => !submitting && onCancel()}
                disabled={submitting}
              >
                Cancelar
              </button>
            </div>
          )}

          {readOnly && (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancel}
                onClick={onCancel}
              >
                Fechar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
