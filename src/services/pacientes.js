// src/services/pacientes.js
const BASE = "http://localhost:8080/api/pacientes";

async function parseJsonSafe(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (err) {
    // resposta não-JSON — loga para debug e lança erro explicativo
    console.error("parseJsonSafe: erro ao parsear JSON:", err, "-> resposta:", text);
    throw new Error(`Resposta inválida do servidor: ${text}`);
  }
}

function mapApiPatient(api) {
  if (!api) return null;
  return {
    id: api.id_paciente ?? api.id ?? null,
    nome: api.nome ?? "",
    cpf: api.cpf ?? "",
    sexo: api.sexo ?? "",
    data_nascimento: api.data_nascimento ?? "",
    telefone: api.telefone ?? "",
    email: api.email ?? "",
    logradouro: api.logradouro ?? ""
  };
}

async function handleResponse(res) {
  // Lança erro HTTP se status >= 400
  if (!res.ok) {
    const body = await parseJsonSafe(res).catch(() => null);
    const msg = body?.mensagem ?? body?.message ?? (body && JSON.stringify(body)) ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  const json = await parseJsonSafe(res).catch(() => null);
  return json;
}

export async function getPatients() {
  const res = await fetch(BASE, { method: "GET", headers: { "Accept": "application/json" } });
  const json = await handleResponse(res);
  // json pode ser {status, mensagem, data: [..]} ou já ser array
  const arr = Array.isArray(json?.data) ? json.data
            : Array.isArray(json) ? json
            : [];
  return arr.map(mapApiPatient);
}

export async function getPatientById(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "GET", headers: { "Accept": "application/json" } });
  const json = await handleResponse(res);
  // Possibilidades:
  // 1) {status,mensagem,data: { ... }}
  // 2) { id_paciente: ..., ... } (objeto direto)
  const api = json?.data ?? json;
  return mapApiPatient(api);
}

export async function createPatient(payload) {
  // payload deve seguir o formato que você mostrou:
  // { nome, sexo, cpf, data_nascimento, telefone, logradouro, email }
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  });
  const json = await handleResponse(res);
  // retorno novo estilo: {status, mensagem, data: { ... }}
  const api = json?.data ?? json;
  return mapApiPatient(api);
}

export async function updatePatient(id, payload) {
  // payload contém apenas os campos a atualizar (telefone, email, logradouro)
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  });
  const json = await handleResponse(res);
  // você informou que o retorno do PUT pode ser o objeto direto (sem wrapper)
  const api = json?.data ?? json;
  return mapApiPatient(api);
}

export async function deletePatient(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" }
  });
  const json = await handleResponse(res);
  // espera {status:"sucesso", mensagem:"...", data: null}
  if (json?.status && json.status !== "sucesso") {
    throw new Error(json.mensagem || "Erro ao excluir");
  }
  return true;
}

export async function getPacienteIdade(id) {
  const res = await fetch(`${BASE}/${id}/idade`, {
    method: "GET",
    headers: { "Accept": "application/json" }
  });
  const json = await handleResponse(res);
  // retorna { status: "...", mensagem: "...", data: 33 }
  const idade = json?.data ?? null;
  return idade;
}

export default {
  getPatientById,
};