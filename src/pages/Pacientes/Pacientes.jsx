// src/pages/Pacientes/Pacientes.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getPatients, deletePatient } from "@/services/pacientes";
import PacienteForm from "./PacienteForm";
import PacienteView from "./PacienteView";
import styles from "./Pacientes.module.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

// Material-UI
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Pacientes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const setSidebarState = useCallback(state => setSidebarCollapsed(state), []);

  async function load() {
    setLoading(true);
    try {
      const list = await getPatients();
      setData(list);
    } catch (err) {
      console.error(err);
      alert("Falha ao carregar pacientes: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const columns = [
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "sexo", headerName: "Sexo", width: 100 },
    { field: "cpf", headerName: "CPF", width: 150 },
    { field: "data_nascimento", headerName: "Nascimento", width: 120 },
    { field: "telefone", headerName: "Telefone", width: 150 },
    { field: "email", headerName: "E-mail", flex: 1 },
    { field: "logradouro", headerName: "Endereço", flex: 2 },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="Visualizar"
          onClick={() => setViewing(params.row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => setEditing(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Excluir"
          onClick={() => handleDelete(params.row)}
          showInMenu
        />,
      ],
    },
  ];

  async function handleDelete(row) {
    if (!window.confirm(`Deseja realmente excluir ${row.nome}?`)) return;
    try {
      await deletePatient(row.id);
      alert(`Paciente ${row.nome} excluído com sucesso!`);
      load();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  }

  return (
    <div className={styles.appContainer}>
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarState} />

      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ""}`}>
        <Header toggleSidebar={toggleSidebar} />

        <div className={styles.pageContent}>
          <header className={styles.header}>
            <h2>Pacientes</h2>
            <button onClick={() => setEditing({})} className={styles.btnPrimary}>
              Novo Paciente
            </button>
          </header>

          {loading ? (
            <p>Carregando pacientes...</p>
          ) : (
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={data}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          )}

          {editing && (
            <PacienteForm
              initial={editing}
              onClose={() => { setEditing(null); load(); }}
            />
          )}

          {viewing && (
            <PacienteView paciente={viewing} onClose={() => setViewing(null)} />
          )}
        </div>
      </div>
    </div>
  );
}
