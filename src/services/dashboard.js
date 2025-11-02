// src/services/dashboard.service.js
// Service para integrar endpoints de consultas / pacientes usados no dashboard
// Exporta funções nomeadas e um export default com todas elas (evita erros de import)

const BASE_URL = "http://localhost:8080/api";

async function handleResponse(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text || '{}');
    if (!response.ok) throw { status: response.status, body: json };
    return json; // { status, mensagem, data }
  } catch (err) {
    // se não for JSON
    if (err instanceof SyntaxError) {
      if (!response.ok) throw { status: response.status, body: text };
      return text;
    }
    throw err;
  }
}

/**
 * Retorna o histórico do paciente (consultas + prontuários)
 * GET /pacientes/{id}/historico
 */
export async function listarHistoricoPaciente(idPaciente) {
  const res = await fetch(`${BASE_URL}/pacientes/${idPaciente}/historico`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(res);
}

/**
 * Atualiza campos da consulta (pode enviar somente os campos que quer alterar)
 * PUT /consultas/{id}
 * body: { dataConsulta?, horaInicio?, horaFim?, status? }
 */
export async function atualizarConsulta(id, dados) {
  const res = await fetch(`${BASE_URL}/consultas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

/**
 * Cancela uma consulta (altera status para CANCELADA)
 * PUT /consultas/{id}/cancelar
 */
export async function cancelarConsulta(id) {
  const res = await fetch(`${BASE_URL}/consultas/${id}/cancelar`, {
    method: 'PUT',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(res);
}

/**
 * Lista consultas de um paciente
 * GET /consultas/paciente/{id}
 */
export async function listarConsultasPorPaciente(idPaciente) {
  const res = await fetch(`${BASE_URL}/consultas/paciente/${idPaciente}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(res);
}

/**
 * Lista consultas de um médico
 * GET /consultas/medico/{id}
 */
export async function listarConsultasPorMedico(idMedico) {
  const res = await fetch(`${BASE_URL}/consultas/medico/${idMedico}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(res);
}

/**
 * Lista consultas por data (formato: YYYY-MM-DD)
 * GET /consultas/data/{data}
 */
export async function listarConsultasPorData(dataYYYYMMDD) {
  const res = await fetch(`${BASE_URL}/consultas/data/${dataYYYYMMDD}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(res);
}

// Export default com todas as funções para facilitar imports
export default {
  listarHistoricoPaciente,
  atualizarConsulta,
  cancelarConsulta,
  listarConsultasPorPaciente,
  listarConsultasPorMedico,
  listarConsultasPorData,
};
