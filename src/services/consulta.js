// src/services/consulta.js
const BASE_URL = "http://localhost:8080/api/consultas";

/**
 * Pequeno helper para fetch com tratamento padrão.
 * Lança erro em caso de status não-2xx e retorna JSON decodificado.
 */
async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const defaultHeaders = { "Content-Type": "application/json" };
  const opts = {
    headers: { ...(options.headers || {}), ...defaultHeaders },
    ...options,
  };

  const resp = await fetch(url, opts);
  const text = await resp.text();
  // tenta parsear JSON, caso não tenha body ainda retorna null
  const data = text ? JSON.parse(text) : null;

  if (!resp.ok) {
    const msg = data?.mensagem || data?.error || resp.statusText || "Erro desconhecido";
    const err = new Error(msg);
    err.status = resp.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/**
 * Normaliza um item de consulta vindo do backend para o shape usado no front.
 * Ajuste conforme seu front (nomes, ids, formatos).
 */
function normalizeBackendConsulta(item) {
  if (!item) return null;
  // remove segundos das horas se existirem e padroniza chaves
  const stripSeconds = (timeStr) => {
    if (!timeStr) return "";
    // aceita "HH:MM:SS" ou "HH:MM"
    const parts = timeStr.split(":");
    if (parts.length >= 2) return `${parts[0].padStart(2,"0")}:${parts[1].padStart(2,"0")}`;
    return timeStr;
  };

  return {
    id_consulta: item.id,
    paciente: item.nomePaciente || item.nome_paciente || "—",
    medico: item.nomeMedico || item.nome_medico || "—",
    data_consulta: item.dataConsulta || item.data_consulta,
    hora_inicio: stripSeconds(item.horaInicio || item.hora_inicio),
    hora_fim: stripSeconds(item.horaFim || item.hora_fim),
    status: item.status || "AGENDADA",
    __raw: item,
  };
}

/**
 * Lista todas as consultas (GET /api/consultas).
 * Retorna array de consultas normalizadas.
 */
export async function listarConsultas() {
  const resp = await request("");
  // aqui assumimos resposta: { status, mensagem, data: [ ... ] }
  const arr = resp?.data ?? [];
  return arr.map(normalizeBackendConsulta);
}

/**
 * Buscar consulta por id (GET /api/consultas/{id})
 * Retorna objeto normalizado (ou null se não encontrado).
 */
export async function buscarConsultaPorId(id) {
  if (id == null) throw new Error("id é obrigatório");
  const resp = await request(`/${encodeURIComponent(id)}`);
  const item = resp?.data ?? null;
  return normalizeBackendConsulta(item);
}

/**
 * Agendar nova consulta (POST /api/consultas/agendar)
 * Recebe um objeto com { idPaciente, idMedico, data, horaInicio, horaFim }
 * Retorna a consulta criada (normalizada).
 */
export async function agendarConsulta({ idPaciente, idMedico, data, horaInicio, horaFim }) {
  if (!idPaciente || !idMedico || !data) throw new Error("idPaciente, idMedico e data são obrigatórios");
  const payload = {
    idPaciente: Number(idPaciente),
    idMedico: Number(idMedico),
    data,
    horaInicio, // backend aceita "HH:MM"
    horaFim,
  };
  const resp = await request("/agendar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeBackendConsulta(resp?.data);
}

/**
 * Atualizar / editar consulta (PUT /api/consultas/{id})
 * -> Assumimos endpoint PUT; adapte se for PATCH ou outro.
 * Recebe objeto contendo pelo menos id e campos a atualizar.
 */
export async function atualizarConsulta({ id, ...updates }) {
  if (!id) throw new Error("id é obrigatório para atualizar");
  // mapeie nomes se backend esperar campos diferentes
  const payload = { ...updates };
  const resp = await request(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalizeBackendConsulta(resp?.data);
}

/**
 * Deletar consulta (DELETE /api/consultas/{id})
 */
export async function deletarConsulta(id) {
  if (!id) throw new Error("id é obrigatório para deletar");
  await request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
  // retorno opcional: sucesso booleano
  return true;
}

/**
 * Export default para conveniência.
 */
export default {
  listarConsultas,
  buscarConsultaPorId,
  agendarConsulta,
  atualizarConsulta,
  deletarConsulta,
};
