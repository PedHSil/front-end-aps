import React, { useState, useEffect } from 'react';
import TabelaNotas from './TabelaNotas';
import styles from './content.module.css';

export default function Content() {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [materiaSelecionada, setMateriaSelecionada] = useState(null);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);

  const idProfessor = 3; // Altere para 3 ou 4, conforme necessário

  // Buscar alunos do professor
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/professores/${idProfessor}/alunos`)
      .then(res => res.json())
      .then(data => setAlunos(data))
      .catch(err => console.error('Erro ao buscar alunos:', err))
      .finally(() => setLoading(false));
  }, [idProfessor]);

  // Buscar matérias com base no RA do aluno
  useEffect(() => {
    if (!alunoSelecionado) return;

    setLoading(true);
    fetch(`http://localhost:8080/api/alunos/${alunoSelecionado.ra}/materias`)
      .then(res => res.json())
      .then(data => setMaterias(data))
      .catch(err => console.error('Erro ao buscar matérias:', err))
      .finally(() => setLoading(false));
  }, [alunoSelecionado]);

  // Buscar notas com base no ID do aluno e ID da matéria
  useEffect(() => {
    if (!alunoSelecionado || !materiaSelecionada) return;

    setLoading(true);
    fetch(`http://localhost:8080/api/alunos/${alunoSelecionado.id}/materias/${materiaSelecionada.id}/notas`)
      .then(res => res.json())
      .then(data => setNotas(data))
      .catch(err => console.error('Erro ao buscar notas:', err))
      .finally(() => setLoading(false));
  }, [materiaSelecionada, alunoSelecionado]);

  const handleSelecionarAluno = (event) => {
    const alunoId = parseInt(event.target.value);
    const aluno = alunos.find(a => a.id === alunoId);
    setAlunoSelecionado(aluno);
    setMateriaSelecionada(null);
    setNotas([]);
  };

  const handleSelecionarMateria = (event) => {
    const materiaId = parseInt(event.target.value);
    const materia = materias.find(m => m.id === materiaId);
    setMateriaSelecionada(materia);
  };

  const handleVoltarParaMaterias = () => {
    setMateriaSelecionada(null);
    setNotas([]);
  };

  const handleVoltarParaAlunos = () => {
    setAlunoSelecionado(null);
    setMateriaSelecionada(null);
    setNotas([]);
  };

  return (
    <main className={styles.container}>
      {loading && <p>Carregando...</p>}

      {!alunoSelecionado ? (
        <>
          <h2>Selecione um Aluno</h2>
          <select className={styles.select} onChange={handleSelecionarAluno} defaultValue="">
            <option value="" disabled>Escolha um aluno...</option>
            {alunos.map((aluno) => (
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
          <button className={styles.voltarButton} onClick={handleVoltarParaAlunos}>← Voltar</button>
        </>
      ) : (
        <>
          <TabelaNotas 
            aluno={alunoSelecionado}
            materia={materiaSelecionada}
            notas={notas}
            onVoltar={handleVoltarParaMaterias}
          />
        </>
      )}
    </main>
  );
}
