import React, { useState } from "react";

export default function ConsultaForm({ pacientes = [], medicos = [], initialData = null, onSave, onCancel }) {
  const [form, setForm] = useState(() => initialData ? { ...initialData } : {
    id_paciente: pacientes.length ? pacientes[0].id_paciente : null,
    id_medico: medicos.length ? medicos[0].id_medico : null,
    data_consulta: "",
    hora_inicio: "",
    hora_fim: "",
    status: "Agendada"
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    // validações mínimas
    if (!form.id_paciente || !form.id_medico || !form.data_consulta) {
      alert("Preencha paciente, médico e data.");
      return;
    }
    onSave(form);
  }

  return (
    <form onSubmit={submit} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Paciente<br />
          <select name="id_paciente" value={form.id_paciente || ""} onChange={handleChange}>
            {pacientes.map(p => <option key={p.id_paciente} value={p.id_paciente}>{p.nome}</option>)}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Médico<br />
          <select name="id_medico" value={form.id_medico || ""} onChange={handleChange}>
            {medicos.map(m => <option key={m.id_medico} value={m.id_medico}>{m.nome}</option>)}
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <label>Data<br />
          <input type="date" name="data_consulta" value={form.data_consulta} onChange={handleChange} />
        </label>
        <label>Início<br />
          <input type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} />
        </label>
        <label>Fim<br />
          <input type="time" name="hora_fim" value={form.hora_fim} onChange={handleChange} />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Status<br />
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Agendada</option>
            <option>Concluída</option>
            <option>Cancelada</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
