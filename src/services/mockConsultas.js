// src/services/mockConsultas.js

export let consultas = [
  {
    id_consulta: 1,
    id_paciente: 1,
    id_medico: 2,
    data_consulta: "2025-10-10",
    hora_inicio: "09:00",
    hora_fim: "09:30",
    status: "Agendada"
  },
  {
    id_consulta: 2,
    id_paciente: 3,
    id_medico: 1,
    data_consulta: "2025-10-11",
    hora_inicio: "14:00",
    hora_fim: "14:30",
    status: "Concluída"
  },
  {
    id_consulta: 3,
    id_paciente: 2,
    id_medico: 3,
    data_consulta: "2025-10-09",
    hora_inicio: "10:30",
    hora_fim: "11:00",
    status: "Cancelada"
  },
  {
    id_consulta: 4,
    id_paciente: 4,
    id_medico: 5,
    data_consulta: "2025-10-12",
    hora_inicio: "16:00",
    hora_fim: "16:30",
    status: "Agendada"
  }
];

// Retorna todas as consultas
export function getConsultas() {
  return [...consultas]; // retorna uma cópia para evitar alterações diretas
}

// Deleta uma consulta pelo id_consulta
export function deleteConsulta(id) {
  consultas = consultas.filter(c => c.id_consulta !== id);
}

// Opcional: adicionar nova consulta
export function addConsulta(novaConsulta) {
  const nextId = consultas.length ? Math.max(...consultas.map(c => c.id_consulta)) + 1 : 1;
  consultas.push({ id_consulta: nextId, ...novaConsulta });
}

// Opcional: atualizar consulta existente
export function updateConsulta(updatedConsulta) {
  consultas = consultas.map(c =>
    c.id_consulta === updatedConsulta.id_consulta ? updatedConsulta : c
  );
}
