// src/pages/Medicos/MedicoForm.jsx
import React, { useState, useEffect } from "react";
import { addMedico, updateMedico } from "@/services/mockMedicos";
import styles from "./Medicos.module.css";

export default function MedicoForm({ onClose, medicoToEdit }) {
  const [formData, setFormData] = useState({
    nome: "",
    crm: "",
    especialidade: "",
    data_nascimento: "",
    telefone: "",
  });

  useEffect(() => {
    if (medicoToEdit) {
      setFormData(medicoToEdit);
    }
  }, [medicoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (medicoToEdit) {
      updateMedico(formData.id, formData); // atualiza médico existente
    } else {
      addMedico(formData); // cria novo médico
    }
    onClose();
  };

  return (
    <div className={styles.formContainer}>
      <h2>{medicoToEdit ? "Editar Médico" : "Novo Médico"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input name="nome" value={formData.nome} onChange={handleChange} required />

        <label>CRM:</label>
        <input name="crm" value={formData.crm} onChange={handleChange} required />

        <label>Especialidade:</label>
        <input
          name="especialidade"
          value={formData.especialidade}
          onChange={handleChange}
          required
        />

        <label>Data de Nascimento:</label>
        <input
          type="date"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
          required
        />

        <label>Telefone:</label>
        <input name="telefone" value={formData.telefone} onChange={handleChange} required />

        <div className={styles.buttons}>
          <button type="submit">{medicoToEdit ? "Atualizar" : "Salvar"}</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
