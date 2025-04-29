import React, { useState } from 'react';
import { mockMateriasPorRA, mockDetalhesMateria } from '../mackData';

export default function MateriasAluno() {
  const [ra, setRa] = useState('');
  const [materias, setMaterias] = useState([]);
  const [materiaSelecionada, setMateriaSelecionada] = useState(null);

  const buscarMaterias = () => {
    const resultado = mockMateriasPorRA[ra];
    if (resultado) {
      setMaterias(resultado);
      setMateriaSelecionada(null);
    } else {
      setMaterias([]);
      setMateriaSelecionada(null);
    }
  };

  const mostrarDetalhes = (idMateria) => {
    const detalhes = mockDetalhesMateria[idMateria];
    setMateriaSelecionada(detalhes);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Consultar Matérias por RA</h2>
      <input
        type="text"
        placeholder="Digite o RA do aluno"
        value={ra}
        onChange={e => setRa(e.target.value)}
        style={{ marginRight: '1rem', padding: '0.5rem' }}
      />
      <button onClick={buscarMaterias}>Buscar</button>

      {materias.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Matérias encontradas:</h3>
          <ul>
            {materias.map((materia) => (
              <li key={materia.id} onClick={() => mostrarDetalhes(materia.id)} style={{ cursor: 'pointer' }}>
                {materia.nome}
              </li>
            ))}
          </ul>
        </div>
      )}

      {materiaSelecionada && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Detalhes da Matéria</h3>
          <p><strong>Professor:</strong> {materiaSelecionada.professor}</p>
          <p><strong>Média:</strong> {materiaSelecionada.media}</p>
          <p><strong>Notas:</strong> {materiaSelecionada.notas.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
