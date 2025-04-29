import React, { useState } from 'react';
import { mockAlunos, mockMateriasPorAluno } from '../mockData';
import DetalhesMateria from './DetalhesMateria';

export default function MateriasAluno() {
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [materiaSelecionada, setMateriaSelecionada] = useState(null);

  const handleSelecionarAluno = (alunoId) => {
    setAlunoSelecionado(alunoId);
    setMateriaSelecionada(null);
  };

  const handleSelecionarMateria = (materiaId) => {
    const materia = mockMateriasPorAluno[alunoSelecionado].find(m => m.id === materiaId);
    setMateriaSelecionada(materia);
  };

  const handleVoltar = () => {
    setMateriaSelecionada(null);
  };

  if (!alunoSelecionado) {
    return (
      <div>
        <h2>Selecione um aluno</h2>
        <ul>
          {mockAlunos.map((aluno) => (
            <li key={aluno.id} onClick={() => handleSelecionarAluno(aluno.id)}>
              {aluno.nome}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (materiaSelecionada) {
    return (
      <DetalhesMateria
        materia={materiaSelecionada}
        onVoltar={handleVoltar}
      />
    );
  }

  return (
    <div>
      <h2>Matérias do aluno</h2>
      <ul>
        {mockMateriasPorAluno[alunoSelecionado]?.map((materia) => (
          <li key={materia.id} onClick={() => handleSelecionarMateria(materia.id)}>
            {materia.nome} ({materia.professor})
          </li>
        ))}
      </ul>
      <button onClick={() => setAlunoSelecionado(null)}>← Voltar para alunos</button>
    </div>
  );
}
