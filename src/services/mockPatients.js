// src/services/mockPatients.js
let patients = [
  { id: 1, nome: "João Silva", cpf: "123.456.789-00", data_nascimento: "1990-05-10", telefone: "1199999-0000", email: "joao@example.com" },
  { id: 2, nome: "Maria Souza", cpf: "987.654.321-00", data_nascimento: "1985-03-22", telefone: "1198888-1111", email: "maria@example.com" },
];

const timeout = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function getPatients() {
  await timeout();
  return [...patients]; // retorna cópia
}

export async function getPatient(id) {
  await timeout();
  return patients.find(p => p.id === Number(id)) ?? null;
}

export async function createPatient(data) {
  await timeout();
  const id = Math.max(0, ...patients.map(p => p.id)) + 1;
  const newPatient = { id, ...data };
  patients.push(newPatient);
  return newPatient;
}

export async function updatePatient(id, data) {
  await timeout();
  const idx = patients.findIndex(p => p.id === Number(id));
  if (idx === -1) throw new Error("Paciente não encontrado");
  patients[idx] = { ...patients[idx], ...data };
  return patients[idx];
}

export async function deletePatient(id) {
  await timeout();
  patients = patients.filter(p => p.id !== Number(id));
  return true;
}
