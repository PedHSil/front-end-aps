import React, { useState, useEffect } from "react";
import styles from "./Prontuarios.module.css";
import { listarConsultas } from "@/services/consulta"; // importar o service correto

export default function ProntuarioForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    idConsulta: "",
    anamnese: "",
    diagnostico: "",
    prescricao: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [consultas, setConsultas] = useState([]);

  // carregar consultas ao montar o form
  useEffect(() => {
    async function fetchConsultas() {
      try {
        const data = await listarConsultas();
        setConsultas(data);
      } catch (err) {
        console.error("Erro ao listar consultas:", err);
        setError("Não foi possível carregar consultas.");
      }
    }
    fetchConsultas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idConsulta || !formData.anamnese) {
      setError("Consulta e Anamnese são obrigatórios");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err?.message || "Erro ao salvar prontuário");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Novo Prontuário</h2>
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Consulta
            <select
              name="idConsulta"
              value={formData.idConsulta}
              onChange={handleChange}
              required
              disabled={submitting || consultas.length === 0}
            >
              <option value="">Selecione</option>
              {consultas.map((c) => (
                <option key={c.id_consulta} value={c.id_consulta}>
                  {c.id_consulta} {/* Mostra apenas o ID da consulta */}
                </option>
              ))}
            </select>
          </label>

          <label>
            Anamnese
            <textarea
              name="anamnese"
              value={formData.anamnese}
              onChange={handleChange}
              rows={4}
              required
              disabled={submitting}
            />
          </label>

          <label>
            Diagnóstico
            <textarea
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              rows={3}
              disabled={submitting}
            />
          </label>

          <label>
            Prescrição
            <textarea
              name="prescricao"
              value={formData.prescricao}
              onChange={handleChange}
              rows={3}
              disabled={submitting}
            />
          </label>

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
        </form>
      </div>
    </div>
  );
}
