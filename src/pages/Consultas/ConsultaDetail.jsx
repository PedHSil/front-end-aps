import React from "react";

export default function ConsultaDetail({ consulta, onClose, pacientes = [], medicos = [] }) {
  if (!consulta) return null;
  const paciente = pacientes.find(p => p.id_paciente === consulta.id_paciente);
  const medico = medicos.find(m => m.id_medico === consulta.id_medico);

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <h3>Detalhes da Consulta #{consulta.id_consulta}</h3>
      <p><strong>Paciente:</strong> {paciente ? paciente.nome : "—"}</p>
      <p><strong>Médico:</strong> {medico ? medico.nome : "—"}</p>
      <p><strong>Data:</strong> {consulta.data_consulta}</p>
      <p><strong>Horário:</strong> {consulta.hora_inicio} — {consulta.hora_fim}</p>
      <p><strong>Status:</strong> {consulta.status}</p>
      <div style={{ marginTop: 8 }}>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
