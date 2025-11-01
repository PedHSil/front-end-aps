import React, { useEffect, useState, useCallback } from "react";
import { listarEspecialidades, excluirEspecialidade } from "@/services/especialidades";
import EspecialidadeForm from "./EspecialidadeForm";
import EspecialidadeView from "./EspecialidadeView";
import styles from "./Especialidades.module.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

// Material UI
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Especialidades() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const setSidebarState = useCallback(state => setSidebarCollapsed(state), []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listarEspecialidades();
      const rows = (list || []).map(r => ({ id: r.id_especialidade, ...r }));
      setData(rows);
    } catch (err) {
      console.error(err);
      alert("Falha ao carregar especialidades: " + (err.message || err));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(row) {
    if (!window.confirm(`Deseja realmente excluir a especialidade ${row.nome}?`)) return;
    try {
      await excluirEspecialidade(row.id);
      alert(`Especialidade ${row.nome} excluída com sucesso!`);
      await load();
    } catch (err) {
      alert("Erro ao excluir: " + (err.message || err));
    }
  }

  const columns = [
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "descricao", headerName: "Descrição", flex: 1 },
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
            <h2>Especialidades</h2>
            <button onClick={() => setEditing({})} className={styles.btnPrimary}>
              Nova Especialidade
            </button>
          </header>

          {loading ? (
            <p>Carregando especialidades...</p>
          ) : (
            <div style={{ width: "100%" }}>
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  getRowId={(row) => row.id_especialidade} // <-- aqui
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableSelectionOnClick
                  autoHeight
                />

              </div>
            </div>
          )}

          {/* Modal do form */}
          {editing && (
            <EspecialidadeForm
              especialidadeToEdit={editing}
              onClose={async () => {
                setEditing(null);
                await load();
              }}
            />
          )}

          {viewing && (
            <EspecialidadeView
              especialidade={viewing}
              onClose={() => setViewing(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
