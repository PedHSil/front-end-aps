// src/pages/Pacientes/PacienteForm.jsx
import React, { useEffect, useState } from "react";
import { createPatient, updatePatient } from "@/services/mockPatients";
import styles from "./Pacientes.module.css";

export default function PacienteForm({ initial = {}, onClose }) {
  const [form, setForm] = useState({
    nome: "", cpf: "", data_nascimento: "", telefone: "", email: ""
  });

  useEffect(() => {
    if (initial && initial.id) setForm(initial);
    if (initial && !initial.id) setForm({ nome: "", cpf: "", data_nascimento: "", telefone: "", email: "" });
  }, [initial]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await updatePatient(form.id, form);
      } else {
        await createPatient(form);
      }
      onClose();
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{form.id ? "Editar Paciente" : "Novo Paciente"}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Nome
            <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
          </label>

          <label>CPF
            <input value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} required />
          </label>

          <label>Data Nasc
            <input type="date" value={form.data_nascimento} onChange={e => setForm({...form, data_nascimento: e.target.value})} />
          </label>

          <label>Telefone
            <input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} />
          </label>

          <label>E-mail
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </label>

          <div className={styles.actions}>
            <button type="submit" className={styles.save}>Salvar</button>
            <button type="button" onClick={onClose} className={styles.cancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
