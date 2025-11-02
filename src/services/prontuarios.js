// src/services/prontuarios.js

const BASE_URL = "http://localhost:8080/api/prontuarios";

/**
 * Lista todos os prontuários
 */
export async function listarProntuarios() {
  try {
    const response = await fetch(BASE_URL);
    const result = await response.json();
    if (!response.ok) throw new Error(result.mensagem || "Erro ao listar prontuários");
    return result.data;
  } catch (error) {
    console.error("listarProntuarios:", error);
    throw error;
  }
}

/**
 * Busca um prontuário pelo ID da consulta
 * @param {number} idConsulta 
 */
export async function buscarProntuarioPorConsulta(idConsulta) {
  try {
    const response = await fetch(`${BASE_URL}/consulta/${idConsulta}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.mensagem || "Erro ao buscar prontuário");
    return result.data;
  } catch (error) {
    console.error("buscarProntuarioPorConsulta:", error);
    throw error;
  }
}

/**
 * Cria um novo prontuário
 * @param {number} idConsulta 
 * @param {string} anamnese 
 * @param {string} diagnostico 
 * @param {string} prescricao 
 */
export async function criarProntuario(idConsulta, anamnese, diagnostico, prescricao) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idConsulta, anamnese, diagnostico, prescricao }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.mensagem || "Erro ao criar prontuário");
    return result.data;
  } catch (error) {
    console.error("criarProntuario:", error);
    throw error;
  }
}

/**
 * Atualiza um prontuário existente
 * @param {number} idProntuario 
 * @param {object} dados - { anamnese, diagnostico, prescricao }
 */
export async function atualizarProntuario(idProntuario, dados) {
  try {
    const response = await fetch(`${BASE_URL}/${idProntuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.mensagem || "Erro ao atualizar prontuário");
    return result.data;
  } catch (error) {
    console.error("atualizarProntuario:", error);
    throw error;
  }
}

/**
 * Exclui um prontuário
 * @param {number} idProntuario 
 */
export async function excluirProntuario(idProntuario) {
  try {
    const response = await fetch(`${BASE_URL}/${idProntuario}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.mensagem || "Erro ao excluir prontuário");
    return result.data;
  } catch (error) {
    console.error("excluirProntuario:", error);
    throw error;
  }
}

export default {
  listarProntuarios,
  buscarProntuarioPorConsulta,
  criarProntuario,
  atualizarProntuario,
  excluirProntuario,
};
