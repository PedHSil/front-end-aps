import React, { useState } from "react";

export default function ProntuarioEdit({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initialData });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.diagnostico) {
      if (!window.confirm("Salvar prontuário sem diagnóstico?")) return;
    }
    onSave(form);
  }

  return (
    <form onSubmit={submit} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Anamnese<br />
          <textarea name="anamnese" value={form.anamnese} onChange={handleChange} rows={4} />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Diagnóstico<br />
          <textarea name="diagnostico" value={form.diagnostico} onChange={handleChange} rows={3} />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Prescrição<br />
          <textarea name="prescricao" value={form.prescricao} onChange={handleChange} rows={3} />
        </label>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
