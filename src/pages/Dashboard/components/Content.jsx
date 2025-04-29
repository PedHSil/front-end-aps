import React, { useState } from 'react';
import { mockAlunos, mockMateriasPorAluno, mockNotasPorMateria } from "../mockData";
import TabelaNotas from './TabelaNotas';
import styles from './content.module.css';

export default function Content() {
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [materiaSelecionada, setMateriaSelecionada] = useState(null);

  const handleSelecionarAluno = (event) => {
    const alunoId = event.target.value;
    const aluno = mockAlunos.find(aluno => aluno.id === alunoId);
    setAlunoSelecionado(aluno);
    setMateriaSelecionada(null);  // Limpar a seleção de matéria ao selecionar aluno
  };

  const handleSelecionarMateria = (event) => {
    const materiaId = event.target.value;
    const materia = mockMateriasPorAluno[alunoSelecionado.id].find(materia => materia.id === materiaId);
    setMateriaSelecionada(materia);  // Seleciona a matéria desejada sem afetar o aluno
  };

  const handleVoltar = () => {
    setMateriaSelecionada(null);  // Volta para a seleção de matéria
  };

  const materias = alunoSelecionado ? mockMateriasPorAluno[alunoSelecionado.id] : [];

  return (
    <main className={styles.container}>
      {!alunoSelecionado ? (
        <>
          <h2>Selecione um Aluno</h2>
          <select className={styles.select} onChange={handleSelecionarAluno} defaultValue="">
            <option value="" disabled>Escolha um aluno...</option>
            {mockAlunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
          </select>
        </>
      ) : !materiaSelecionada ? (
        <>
          <h2>Matérias de {alunoSelecionado.nome}</h2>
          <select className={styles.select} onChange={handleSelecionarMateria} defaultValue="">
            <option value="" disabled>Escolha uma matéria...</option>
            {materias.map((materia) => (
              <option key={materia.id} value={materia.id}>
                {materia.nome}
              </option>
            ))}
          </select>
          <button className={styles.voltarButton} onClick={() => setAlunoSelecionado(null)}>← Voltar</button>
        </>
      ) : (
        <>
          <TabelaNotas 
            aluno={alunoSelecionado} 
            materia={materiaSelecionada} 
            notas={mockNotasPorMateria(alunoSelecionado.id, materiaSelecionada.nome)} 
            onVoltar={handleVoltar} 
          />
        </>
      )}
    </main>
  );
}
