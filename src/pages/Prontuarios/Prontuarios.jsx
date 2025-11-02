import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import styles from "./Prontuarios.module.css";

import ProntuarioForm from "./ProntuarioForm";
import ProntuarioEdit from "./ProntuarioEdit";

// Serviços
import {
  listarProntuarios,
  excluirProntuario,
  atualizarProntuario,
  criarProntuario,
} from "@/services/prontuarios";
import { listarConsultas } from "@/services/consulta";
import { getPatients } from "@/services/pacientes";
import { getMedicos } from "@/services/medicos";

// MUI
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Prontuarios() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prontuarios, setProntuarios] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [creating, setCreating] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((p) => !p), []);
  const setSidebarState = useCallback((s) => setSidebarCollapsed(s), []);

  // Carrega dados
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pronts, cons, pacs, meds] = await Promise.all([
        listarProntuarios(),
        listarConsultas(),
        getPatients(),
        getMedicos(),
      ]);

      setProntuarios(pronts || []);
      setConsultas(cons || []);
      setPacientes(pacs || []);
      setMedicos(meds || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Deletar prontuário
  const handleDelete = useCallback(
    async (row) => {
      if (!window.confirm("Deseja realmente excluir este prontuário?")) return;
      try {
        await excluirProntuario(row.id);
        alert("Prontuário excluído com sucesso!");
        await load();
      } catch (err) {
        alert("Erro ao excluir: " + (err.message || err));
      }
    },
    [load]
  );

  // Dados para a tabela, usando medicos e pacientes do estado
  const dataForTable = prontuarios.map((p) => {
    const consulta = consultas.find((c) => c.idConsulta === p.idConsulta);
    const paciente = pacientes.find((x) => x.idPaciente === consulta?.idPaciente);
    const medico = medicos.find((x) => x.idMedico === consulta?.idMedico);

    return {
      id: p.idProntuario,
      paciente: paciente?.nome ?? "—",
      medico: medico?.nome ?? "—",
      data_consulta: p.dataRegistro
        ? new Date(p.dataRegistro).toLocaleDateString("pt-BR")
        : consulta?.data
        ? new Date(consulta.data).toLocaleDateString("pt-BR")
        : "—",
      diagnostico: p.diagnostico ?? "—",
      prescricao: p.prescricao ?? "—",
      ...p,
    };
  });

  const columns = [
    { field: "paciente", headerName: "Paciente", flex: 1 },
    { field: "medico", headerName: "Médico", flex: 1 },
    { field: "data_consulta", headerName: "Data da Consulta", width: 180 },
    { field: "diagnostico", headerName: "Diagnóstico", flex: 1 },
    { field: "prescricao", headerName: "Prescrição", flex: 1 },
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
            <h2>Prontuários</h2>
            <button onClick={() => setCreating(true)} className={styles.btnPrimary}>
              Novo Prontuário
            </button>
          </header>

          {loading ? (
            <p>Carregando prontuários...</p>
          ) : (
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={dataForTable}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          )}

          {/* Edição */}
          {editing && (
            <ProntuarioEdit
              initialData={editing}
              onSave={async (updated) => {
                await atualizarProntuario(updated.idProntuario, updated);
                setEditing(null);
                await load();
              }}
              onCancel={() => setEditing(null)}
            />
          )}

          {/* Criação */}
          {creating && (
            <ProntuarioForm
              consultas={consultas}
              onSave={async (data) => {
                await criarProntuario(
                  data.idConsulta,
                  data.anamnese,
                  data.diagnostico,
                  data.prescricao
                );
                setCreating(false);
                await load();
              }}
              onCancel={() => setCreating(false)}
            />
          )}

          {/* Visualização */}
          {viewing && (
            <ProntuarioEdit
              initialData={viewing}
              readOnly
              onCancel={() => setViewing(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
