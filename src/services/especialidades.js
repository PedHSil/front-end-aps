const API_URL = "http://localhost:8080/api/especialidades";

// Buscar todas as especialidades (GET)
export async function listarEspecialidades() {
  try {
    const response = await fetch("http://localhost:8080/api/especialidades");
    if (!response.ok) throw new Error("Erro ao buscar especialidades");
    const data = await response.json();
    return data.data || []; // ✅ Corrigido para acessar o array dentro de "data"
  } catch (error) {
    console.error("Erro em listarEspecialidades:", error);
    return [];
  }
}


// Buscar uma especialidade por ID (GET /{id})
export async function buscarEspecialidadePorId(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar especialidade");
    const data = await response.json();
    return data.data; // retorna apenas o objeto dentro de "data"
  } catch (error) {
    console.error("Erro em buscarEspecialidadePorId:", error);
    return null;
  }
}

// Criar uma nova especialidade (POST)
export async function criarEspecialidade(dados) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao criar especialidade");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro em criarEspecialidade:", error);
    return null;
  }
}

// Atualizar especialidade existente (PUT /{id})
export async function atualizarEspecialidade(id, dados) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao atualizar especialidade");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro em atualizarEspecialidade:", error);
    return null;
  }
}

// Excluir uma especialidade (DELETE /{id})
export async function excluirEspecialidade(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao excluir especialidade");
    const data = await response.json();
    return data.status === "sucesso";
  } catch (error) {
    console.error("Erro em excluirEspecialidade:", error);
    return false;
  }
}
