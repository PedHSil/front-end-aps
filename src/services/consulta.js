// src/services/consulta.js
const BASE_URL = "http://localhost:8080/api/consultas";

/** helper request */
async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const defaultHeaders = { "Content-Type": "application/json" };
  const opts = {
    headers: { ...(options.headers || {}), ...defaultHeaders },
    ...options,
  };

  const resp = await fetch(url, opts);
  const text = await resp.text();
  let data = null;
  try {
  data = text ? JSON.parse(text) : null;
} catch {
  // não era JSON
  data = text;
}


  if (!resp.ok) {
    const msg = (data && (data.mensagem || data.error || data.message)) || resp.statusText || "Erro desconhecido";
    const err = new Error(msg);
    err.status = resp.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/** normalizador */
function normalizeBackendConsulta(item) {
  if (!item) return null;
  const stripSeconds = (timeStr) => {
    if (!timeStr) return "";
    const parts = String(timeStr).split(":");
    if (parts.length >= 2) return `${parts[0].padStart(2,"0")}:${parts[1].padStart(2,"0")}`;
    return String(timeStr);
  };

  return {
    id_consulta: item.id ?? item.id_consulta ?? item.idConsulta ?? null,
    paciente: item.nomePaciente || item.nome_paciente || item.paciente || "—",
    medico: item.nomeMedico || item.nome_medico || item.medico || "—",
    data_consulta: item.dataConsulta || item.data_consulta || item.data || null,
    hora_inicio: stripSeconds(item.horaInicio || item.hora_inicio || item.inicio),
    hora_fim: stripSeconds(item.horaFim || item.hora_fim || item.fim),
    status: item.status || "AGENDADA",
    __raw: item,
  };
}

/** listar */
export async function listarConsultas() {
  const resp = await request("");
  const arr = resp?.data ?? resp ?? [];
  return (Array.isArray(arr) ? arr : []).map(normalizeBackendConsulta);
}

/** buscar por id */
export async function buscarConsultaPorId(id) {
  const useId = id ?? (typeof id === "object" ? id.id : null);
  if (useId == null) throw new Error("id é obrigatório");
  const resp = await request(`/${encodeURIComponent(useId)}`);
  const item = resp?.data ?? resp ?? null;
  return normalizeBackendConsulta(item);
}

/**
 * Agendar nova consulta.
 * Aceita objetos com chaves variadas vindas do front:
 * { idPaciente, id_paciente, pacienteId, paciente_id, idMedico, id_medico, medicoId, data, date, horaInicio, hora_inicio, horaFim }
 */
export async function agendarConsulta(payloadInput = {}) {
  // permissivo: aceite várias formas de nomear os campos
  const idPaciente =
    payloadInput.idPaciente ??
    payloadInput.id_paciente ??
    payloadInput.pacienteId ??
    payloadInput.paciente_id ??
    payloadInput.paciente ??
    null;

  const idMedico =
    payloadInput.idMedico ??
    payloadInput.id_medico ??
    payloadInput.medicoId ??
    payloadInput.medico_id ??
    payloadInput.medico ??
    null;

  const data = payloadInput.data ?? payloadInput.date ?? null;
  const horaInicio = payloadInput.horaInicio ?? payloadInput.hora_inicio ?? payloadInput.inicio ?? null;
  const horaFim = payloadInput.horaFim ?? payloadInput.hora_fim ?? payloadInput.fim ?? null;

  // verificação mais robusta (checa null/undefined/string vazia)
  const isEmpty = (v) => v == null || (typeof v === "string" && v.trim() === "");
  if (isEmpty(idPaciente) || isEmpty(idMedico) || isEmpty(data)) {
    const got = { idPaciente, idMedico, data, horaInicio, horaFim };
    const err = new Error("idPaciente, idMedico e data são obrigatórios");
    err.details = { expected: ["idPaciente","idMedico","data"], got };
    throw err;
  }

  // construir payload para o backend (force number quando for número)
  const payload = {
    idPaciente: Number(idPaciente),
    idMedico: Number(idMedico),
    data,
    horaInicio,
    horaFim,
  };

  // log útil para debugging (remova em produção)
  // eslint-disable-next-line no-console
  console.debug("[consulta.service] agendar payload:", payload);

  const resp = await request("/agendar", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizeBackendConsulta(resp?.data ?? resp);
}

/**
 * Atualizar consulta. Aceita { id } ou { id_consulta } ou { id: ..., ...updates }
 */
export async function atualizarConsulta({ id, id_consulta, ...updates } = {}) {
  const useId = id ?? id_consulta ?? updates.id ?? updates.id_consulta;
  if (useId == null) throw new Error("id é obrigatório para atualizar");
  // remova id do corpo se existir
  const body = { ...updates };
  delete body.id;
  delete body.id_consulta;

  // log
  // eslint-disable-next-line no-console
  console.debug("[consulta.service] atualizar id:", useId, "body:", body);

  const resp = await request(`/${encodeURIComponent(useId)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return normalizeBackendConsulta(resp?.data ?? resp);
}

/** deletar */
export async function deletarConsulta(id) {
  if (!id) throw new Error("id é obrigatório para deletar");
  await request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
  return true;
}

/** export default */
export default {
  listarConsultas,
  buscarConsultaPorId,
  agendarConsulta,
  atualizarConsulta,
  deletarConsulta,
};
