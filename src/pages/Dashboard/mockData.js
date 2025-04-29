export const mockAlunos = [
  { id: '1', nome: 'Escolha um aluno...' },
  { id: '2', nome: 'João Silva' },
  { id: '3', nome: 'Maria Oliveira' }
];

export const mockMateriasPorAluno = {
  '2': [
    {
      id: 'bio-2025',
      nome: 'Biologia',
      professor: 'Prof. Ana',
      notas: { np1: 8, np2: 7, reposicao: 0, exame: 6 }
    },
    {
      id: 'quim-2025',
      nome: 'Química',
      professor: 'Prof. Carlos',
      notas: { np1: 6, np2: 5, reposicao: 0, exame: 7 }
    }
  ],
  '3': [
    {
      id: 'bio-2025',
      nome: 'Biologia',
      professor: 'Prof. Ana',
      notas: { np1: 9, np2: 8, reposicao: 0, exame: 0 }
    },
    {
      id: 'quim-2025',
      nome: 'Química',
      professor: 'Prof. Carlos',
      notas: { np1: 6, np2: 5, reposicao: 0, exame: 7 }
    }
  ]
};

// Função para obter as notas de uma matéria
export const mockNotasPorMateria = (nomeMateria) => {
  const notas = [];
  Object.values(mockMateriasPorAluno).forEach((materias) => {
    materias.forEach((materia) => {
      if (materia.nome === nomeMateria) {
        notas.push(materia.notas);
      }
    });
  });
  return notas;
};
