// src/services/medicos.js
const API_BASE = "http://localhost:8080/api/medicos";

/**
 * Normaliza o objeto médico vindo da API para um formato útil na UI.
 * Mantém o objeto original em `especialidade` e adiciona atalhos.
 */
function normalizeMedico(apiMedico) {
  if (!apiMedico) return null;

  const especialidadeObj = apiMedico.especialidade || null;
  return {
    id: apiMedico.id_medico,
    nome: apiMedico.nome,
    crm: apiMedico.crm,
    // mantém o objeto original (útil para formulários de edição)
    especialidade: especialidadeObj,
    // atalhos úteis
    especialidadeId: especialidadeObj ? especialidadeObj.id_especialidade : null,
    especialidadeNome: especialidadeObj ? especialidadeObj.nome : "",
    data_nascimento: apiMedico.data_nascimento,
    telefone: apiMedico.telefone,
    ativo: apiMedico.ativo,
    // preserva payload original caso queiras
    __raw: apiMedico,
  };
}

/**
 * Faz fetch e valida a resposta padrão da API (status, mensagem, data).
 * Lança erro com mensagem adequada caso algo falhe.
 */
async function fetchAndValidate(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    // tenta extrair mensagem do body
    let text = await res.text().catch(() => "");
    try {
      const json = JSON.parse(text || "{}");
      throw new Error(json.mensagem || json.message || `HTTP ${res.status}`);
    } catch {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }
  }

  const json = await res.json().catch(() => null);
  if (!json) throw new Error("Resposta inválida da API");
  if (json.status && json.status !== "sucesso") {
    throw new Error(json.mensagem || "Erro retornado pela API");
  }
  return json;
}

/**
 * Listar médicos (GET /api/medicos)
 * Retorna array de médicos normalizados.
 */
export async function getMedicos() {
  try {
    const json = await fetchAndValidate(API_BASE, { method: "GET" });
    const data = json.data || [];
    return data.map(normalizeMedico);
  } catch (err) {
    console.error("getMedicos error:", err);
    // Re-throw para o componente decidir (ou podes retornar [] se preferir)
    throw err;
  }
}

/**
 * Buscar médico por id (GET /api/medicos/{id})
 * Retorna médico normalizado.
 */
export async function buscarMedicoPorId(id) {
  if (!id && id !== 0) throw new Error("ID é obrigatório para buscar médico");
  try {
    const json = await fetchAndValidate(`${API_BASE}/${id}`, { method: "GET" });
    return normalizeMedico(json.data);
  } catch (err) {
    console.error("buscarMedicoPorId error:", err);
    throw err;
  }
}

/**
 * Criar médico (POST /api/medicos)
 * Espera um objeto `dados` no formato que a API aceita.
 *
 * Exemplos de payload aceito pela API (conforme seu exemplo):
 * {
 *   nome: "Dr. Ana...",
 *   crm: "CRM998877",
 *   especialidade: { id_especialidade: 3 },
 *   data_nascimento: "1988-07-22",
 *   telefone: "11999998888",
 *   ativo: true
 * }
 *
 * Retorna o médico criado (normalizado).
 */
export async function criarMedico(dados) {
  try {
    const json = await fetchAndValidate(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    return normalizeMedico(json.data);
  } catch (err) {
    console.error("criarMedico error:", err);
    throw err;
  }
}

/**
 * Atualizar médico (PUT /api/medicos/{id})
 * `dados` deve ser semelhante ao payload de criar.
 * Retorna o médico atualizado (normalizado).
 */
export async function atualizarMedico(id, dados) {
  if (!id && id !== 0) throw new Error("ID é obrigatório para atualizar médico");
  try {
    const json = await fetchAndValidate(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    return normalizeMedico(json.data);
  } catch (err) {
    console.error("atualizarMedico error:", err);
    throw err;
  }
}

/**
 * Excluir médico (DELETE /api/medicos/{id})
 * A API pode retornar erro caso existam consultas agendadas.
 * Retorna true em sucesso (ou null conforme payload da API).
 */
export async function excluirMedico(id) {
  if (!id && id !== 0) throw new Error("ID é obrigatório para excluir médico");
  try {
    const json = await fetchAndValidate(`${API_BASE}/${id}`, { method: "DELETE" });
    // API devolve { status, mensagem, data: null } no sucesso. Retornamos a mensagem e data.
    return { mensagem: json.mensagem, data: json.data };
  } catch (err) {
    console.error("excluirMedico error:", err);
    throw err;
  }
}

/**
 * ALIASES para compatibilidade com importações existentes no projeto.
 * Alguns componentes podem ainda importar: getMedicos, addMedico, updateMedico, deleteMedico
 */
export const addMedico = criarMedico;
export const updateMedico = atualizarMedico;
export const deleteMedico = excluirMedico;
