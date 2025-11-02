import React, { useState, useEffect } from "react";
import { agendarConsulta, atualizarConsulta } from "@/services/consulta";
import styles from "./Consultas.module.css";


export default function ConsultaForm({ onClose, consultaToEdit }) {
  const [formData, setFormData] = useState({
    pacienteId: "",
    medicoId: "",
    data_consulta: "",
    observacoes: "",
    status: "agendada",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (consultaToEdit) {
      setFormData({
        pacienteId: consultaToEdit.pacienteId ?? "",
        medicoId: consultaToEdit.medicoId ?? "",
        data_consulta: consultaToEdit.data_consulta ?? "",
        observacoes: consultaToEdit.observacoes ?? "",
        status: consultaToEdit.status ?? "agendada",
      });
    }
  }, [consultaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (consultaToEdit && consultaToEdit.id) {
        await atualizarConsulta(consultaToEdit.id, formData);
      } else {
        await agendarConsulta(formData);
      }
      onClose();
    } catch (err) {
      console.error("Erro ao salvar consulta:", err);
      setError(err?.message || "Erro ao salvar consulta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{consultaToEdit ? "Editar Consulta" : "Nova Consulta"}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>ID do Paciente</label>
          <input
            name="pacienteId"
            value={formData.pacienteId}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ex: 1"
          />

          <label>ID do Médico</label>
          <input
            name="medicoId"
            value={formData.medicoId}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ex: 2"
          />

          <label>Data da Consulta</label>
          <input
            type="datetime-local"
            name="data_consulta"
            value={formData.data_consulta}
            onChange={handleChange}
            required
            disabled={submitting}
          />

          <label>Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Digite observações..."
          />

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="agendada">Agendada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <div className={styles.actions}>
            <button type="submit" className={styles.save} disabled={submitting}>
              {submitting
                ? consultaToEdit
                  ? "Atualizando..."
                  : "Salvando..."
                : consultaToEdit
                ? "Atualizar"
                : "Salvar"}
            </button>

            <button
              type="button"
              className={styles.cancel}
              onClick={() => !submitting && onClose()}
              disabled={submitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
