import React, { useState } from 'react';
import styles from './tabelaNotas.module.css';

export default function TabelaNotas({ aluno, materia, onVoltar }) {
  const [notaAtual, setNotaAtual] = useState(materia.notas);  // Agora pegamos as notas diretamente da matéria

  const handleChangeNota = (campo, valor) => {
    setNotaAtual(prev => ({ ...prev, [campo]: Number(valor) }));
  };

  return (
    <div className={styles.container}>
      <button className={styles.voltarButton} onClick={onVoltar}>← Voltar</button>
      <h2 className={styles.title}>{materia.nome} - Notas de {aluno.nome}</h2>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>NP1</th>
            <th>NP2</th>
            <th>Reposição</th>
            <th>Exame</th>
            <th>Média</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr key={aluno.id}>
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
            <td>{((notaAtual.np1 + notaAtual.np2) / 2).toFixed(1)}</td>
            <td>
              <button className={styles.deleteButton}>Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
