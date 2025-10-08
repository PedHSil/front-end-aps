let medicos = [
  {
    id: 1,
    nome: "Dra. Ana Souza",
    crm: "12345-SP",
    especialidade: "Cardiologia",
    data_nascimento: "1980-03-15",
    telefone: "(11) 99999-1111",
  },
  {
    id: 2,
    nome: "Dr. Pedro Oliveira",
    crm: "67890-SP",
    especialidade: "Dermatologia",
    data_nascimento: "1978-09-22",
    telefone: "(11) 98888-2222",
  },
];

export function getMedicos() {
  return [...medicos]; // <- importante retornar uma cópia
}

export function addMedico(medico) {
  medico.id = medicos.length ? medicos[medicos.length - 1].id + 1 : 1;
  medicos.push(medico);
}

export function updateMedico(updatedMedico) {
  medicos = medicos.map((m) => (m.id === updatedMedico.id ? updatedMedico : m));
}

export function deleteMedico(id) {
  medicos = medicos.filter((m) => m.id !== id);
}
