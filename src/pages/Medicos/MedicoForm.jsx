import React, { useState, useEffect } from "react";
import { addMedico, updateMedico } from "@/services/medicos";
import styles from "./Medicos.module.css";

export default function MedicoForm({ onClose, medicoToEdit }) {
  const [formData, setFormData] = useState({
    nome: "",
    crm: "",
    especialidadeId: "",
    data_nascimento: "",
    telefone: "",
    ativo: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (medicoToEdit) {
      const especialidadeId =
        medicoToEdit.especialidadeId ??
        medicoToEdit.especialidade?.id_especialidade ??
        medicoToEdit.especialidade?.id ??
        "";

      setFormData({
        nome: medicoToEdit.nome ?? "",
        crm: medicoToEdit.crm ?? "",
        especialidadeId,
        data_nascimento: medicoToEdit.data_nascimento ?? "",
        telefone: medicoToEdit.telefone ?? "",
        ativo: typeof medicoToEdit.ativo === "boolean" ? medicoToEdit.ativo : true,
      });
    }
  }, [medicoToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.nome || !formData.crm || !formData.especialidadeId) {
      setError("Por favor, preencha Nome, CRM e Especialidade (ID).");
      return;
    }

    const payload = {
      nome: formData.nome,
      crm: formData.crm,
      especialidade: { id_especialidade: Number(formData.especialidadeId) },
      data_nascimento: formData.data_nascimento || null,
      telefone: formData.telefone || null,
      ativo: !!formData.ativo,
    };

    setSubmitting(true);
    try {
      if (medicoToEdit && medicoToEdit.id) {
        await updateMedico(medicoToEdit.id, payload);
      } else {
        await addMedico(payload);
      }
      onClose();
    } catch (err) {
      console.error("Erro ao salvar médico:", err);
      setError(err?.message || "Erro ao salvar médico");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{medicoToEdit ? "Editar Médico" : "Novo Médico"}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Nome</label>
          <input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ex: Dr. João Silva"
          />

          <label>CRM</label>
          <input
            name="crm"
            value={formData.crm}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ex: 123456-SP"
          />

          <label>Especialidade (ID)</label>
          <input
            name="especialidadeId"
            value={formData.especialidadeId}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Ex: 2"
          />

          <label>Data de Nascimento</label>
          <input
            type="date"
            name="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleChange}
            disabled={submitting}
          />

          <label>Telefone</label>
          <input
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            disabled={submitting}
            placeholder="(11) 99999-9999"
          />

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="ativo"
              checked={!!formData.ativo}
              onChange={handleChange}
              disabled={submitting}
            />
            Médico ativo
          </label>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.save}
              disabled={submitting}
            >
              {submitting
                ? medicoToEdit
                  ? "Atualizando..."
                  : "Salvando..."
                : medicoToEdit
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
