import React, { useState } from 'react';
import styles from './detalhesMateria.module.css';

export default function DetalhesMateria({ materia, onVoltar }) {
  const [notas, setNotas] = useState({ ...materia.notas });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotas((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const media = ((notas.np1 + notas.np2) / 2).toFixed(1);

  return (
    <div className={styles.container}>
      <button className={styles.voltar} onClick={onVoltar}>← Voltar</button>
      <h2>{materia.nome}</h2>
      <p><strong>Professor:</strong> {materia.professor}</p>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>NP1</th>
            <th>NP2</th>
            <th>Reposição</th>
            <th>Exame</th>
            <th>Média</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="number" name="np1" value={notas.np1} onChange={handleChange} /></td>
            <td><input type="number" name="np2" value={notas.np2} onChange={handleChange} /></td>
            <td><input type="number" name="reposicao" value={notas.reposicao} onChange={handleChange} /></td>
            <td><input type="number" name="exame" value={notas.exame} onChange={handleChange} /></td>
            <td>{media}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
