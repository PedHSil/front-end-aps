import React, { useState, useEffect } from 'react';
import styles from './tabelaNotas.module.css';

export default function TabelaNotas({ aluno, materia, onVoltar }) {
  const [notaAtual, setNotaAtual] = useState({
    np1: '',
    np2: '',
    reposicao: '',
    exame: '',
    media: '',
    professor: '',
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const buscarNotas = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/alunos/${aluno.ra}/materias/${materia.id}/notas`)
      .then(res => res.json())
      .then(data => {
        setNotaAtual({
          np1: data.np1 ?? '',
          np2: data.np2 ?? '',
          reposicao: data.rep ?? '',
          exame: data.exame ?? '',
          media: data.media ?? '',
          professor: data.professor ?? '',
        });
      })
      .catch(err => console.error('Erro ao buscar notas:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (aluno && materia) {
      buscarNotas();
    }
  }, [aluno, materia]);

  const handleChangeNota = (campo, valor) => {
    setNotaAtual(prev => ({ ...prev, [campo]: Number(valor) }));
  };

  const handleSalvar = () => {
    const np1 = Number(notaAtual.np1);
    const np2 = Number(notaAtual.np2);
    const mediaCalculada = (np1 + np2) / 2;

    const payload = {
      idAluno: aluno.id,
      idMateria: materia.id,
      np1,
      np2,
      rep: Number(notaAtual.reposicao),
      exame: Number(notaAtual.exame),
      media: parseFloat(mediaCalculada.toFixed(2)),
    };

    console.log('Enviando payload para o backend:', payload);

    setSalvando(true);
    fetch('http://localhost:8080/api/notas/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}`);
        }
        return res.text(); // Usa text porque o backend não retorna JSON
      })
      .then((text) => {
        console.log('Resposta do backend:', text);
        alert('Notas salvas com sucesso!');
        buscarNotas(); // Recarrega dados
      })
      .catch(err => {
        console.error('Erro ao salvar notas:', err);
        alert('Erro ao salvar notas: ' + err.message);
      })
      .finally(() => setSalvando(false));
  };

  return (
    <div className={styles.container}>
      <button className={styles.voltarButton} onClick={onVoltar}>← Voltar</button>
      <h2 className={styles.title}>{materia.nome} - Notas de {aluno.nome}</h2>

      {loading ? (
        <p>Carregando notas...</p>
      ) : (
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>NP1</th>
              <th>NP2</th>
              <th>Reposição</th>
              <th>Exame</th>
              <th>Média</th>
              <th>Professor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr key={materia.id}>
              <td>
                <input
                  className={styles.inputNota}
                  type="number"
                  value={notaAtual.np1}
                  onChange={(e) => handleChangeNota('np1', e.target.value)}
                />
              </td>
              <td>
                <input
                  className={styles.inputNota}
                  type="number"
                  value={notaAtual.np2}
                  onChange={(e) => handleChangeNota('np2', e.target.value)}
                />
              </td>
              <td>
                <input
                  className={styles.inputNota}
                  type="number"
                  value={notaAtual.reposicao}
                  onChange={(e) => handleChangeNota('reposicao', e.target.value)}
                />
              </td>
              <td>
                <input
                  className={styles.inputNota}
                  type="number"
                  value={notaAtual.exame}
                  onChange={(e) => handleChangeNota('exame', e.target.value)}
                />
              </td>
              <td>{((notaAtual.np1 + notaAtual.np2) / 2).toFixed(2)}</td>
              <td>{notaAtual.professor || '-'}</td>
              <td>
                <button
                  className={styles.saveButton}
                  onClick={handleSalvar}
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
