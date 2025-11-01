// src/pages/Medicos/Medicos.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getMedicos, deleteMedico } from "@/services/medicos";
import MedicoForm from "./MedicoForm";
import MedicoView from "./MedicoView";
import styles from "./Medicos.module.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

// Material UI
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Medicos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // objeto do médico sendo editado OR {} para novo
  const [viewing, setViewing] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const setSidebarState = useCallback(state => setSidebarCollapsed(state), []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getMedicos();
      // garante que cada row tem `id` para o DataGrid
      const rows = (list || []).map((r) => ({ id: r.id ?? r.id_medico, ...r }));
      setData(rows);
    } catch (err) {
      console.error(err);
      alert("Falha ao carregar médicos: " + (err.message || err));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(row) {
    if (!window.confirm(`Deseja realmente excluir o médico ${row.nome}?`)) return;
    try {
      await deleteMedico(row.id);
      alert(`Médico ${row.nome} excluído com sucesso!`);
      await load();
    } catch (err) {
      alert("Erro ao excluir: " + (err.message || err));
    }
  }

  const columns = [
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "crm", headerName: "CRM", width: 150 },
    { field: "especialidadeNome", headerName: "Especialidade", flex: 1 },
    { field: "telefone", headerName: "Telefone", width: 150 },
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

  return (
    <div className={styles.appContainer}>
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarState} />

      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ""}`}>
        <Header toggleSidebar={toggleSidebar} />

        <div className={styles.pageContent}>
          <header className={styles.header}>
            <h2>Médicos</h2>
            {/* Para criar novo, passamos um objecto vazio — o MedicoForm trata ausência de id como create */}
            <button onClick={() => setEditing({})} className={styles.btnPrimary}>
              Novo Médico
            </button>
          </header>

          {loading ? (
            <p>Carregando médicos...</p>
          ) : (
            <div style={{ width: "100%" }}>
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
            </div>
          )}

          {/* PASSAGEM CORRIGIDA: medicoToEdit (nome esperado pelo MedicoForm) */}
          {editing && (
            <MedicoForm
              medicoToEdit={editing}
              onClose={async () => {
                setEditing(null);
                await load();
              }}
            />
          )}

          {viewing && (
            <MedicoView medico={viewing} onClose={() => setViewing(null)} />
          )}
        </div>
      </div>
    </div>
  );
}
