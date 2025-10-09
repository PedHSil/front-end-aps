import React, { useState } from "react";

export default function EspecialidadeForm({ initialData = null, onSave, onCancel }) {
  const [form, setForm] = useState(() => initialData ? { ...initialData } : {
    nome: "",
    descricao: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.nome) { alert("Nome é obrigatório"); return; }
    onSave(form);
  }

  return (
    <form onSubmit={submit} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Nome<br />
          <input name="nome" value={form.nome} onChange={handleChange} />
        </label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Descrição<br />
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3} />
        </label>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
