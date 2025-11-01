import React, { useState, useEffect } from "react";
import { criarEspecialidade, atualizarEspecialidade } from "@/services/especialidades";
import styles from "./Especialidades.module.css";

export default function EspecialidadeForm({ especialidadeToEdit, onClose }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (especialidadeToEdit?.id) {
      setNome(especialidadeToEdit.nome || "");
      setDescricao(especialidadeToEdit.descricao || "");
    }
  }, [especialidadeToEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) return setError("Nome é obrigatório");

    try {
      if (especialidadeToEdit?.id) {
        await atualizarEspecialidade(especialidadeToEdit.id, { nome, descricao });
      } else {
        await criarEspecialidade({ nome, descricao });
      }
      onClose();
    } catch (err) {
      setError("Erro ao salvar especialidade");
      console.error(err);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{especialidadeToEdit?.id ? "Editar Especialidade" : "Nova Especialidade"}</h3>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Nome</label>
          <input value={nome} onChange={e => setNome(e.target.value)} />

          <label>Descrição</label>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} />

          <div className={styles.actions}>
            <button type="submit" className={styles.save}>
              Salvar
            </button>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
