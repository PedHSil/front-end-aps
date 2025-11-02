// src/pages/Consultas/Consultas.jsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ConsultaForm from "./ConsultaForm";
import ConsultaDetail from "./ConsultaDetail";

import {
  listarConsultas,
  buscarConsultaPorId,
  agendarConsulta,
  atualizarConsulta,
  deletarConsulta,
} from "@/services/consulta";

import { getPatients } from "@/services/pacientes";
import { getMedicos } from "@/services/medicos";

import styles from "./Consultas.module.css";

// Material UI
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // objeto a editar ({} para novo)
  const [viewing, setViewing] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const setSidebarState = useCallback(state => setSidebarCollapsed(state), []);

  // helper que aceita função async ou sync
  async function callMaybeAsync(fn, ...args) {
    if (!fn) return [];
    try {
      const result = fn(...args);
      const resolved = result && typeof result.then === "function" ? await result : result;
      if (resolved && typeof resolved === "object" && Array.isArray(resolved.data)) return resolved.data;
      return resolved ?? [];
    } catch (err) {
      console.error("Erro callMaybeAsync:", err);
      return [];
    }
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cList, pList, mList] = await Promise.all([
        callMaybeAsync(listarConsultas),
        callMaybeAsync(getPatients),
        callMaybeAsync(getMedicos),
      ]);

      const consultasCompletas = (cList || []).map((c) => {
        const raw = c.__raw || c;
        const idPaciente = raw?.idPaciente ?? raw?.id_paciente ?? raw?.paciente_id;
        const idMedico = raw?.idMedico ?? raw?.id_medico ?? raw?.medico_id;

        const pacienteNome = (pList.find(p => (p.id_paciente ?? p.id) === idPaciente)?.nome) || c.paciente || "—";
        const medicoNome = (mList.find(m => (m.id_medico ?? m.id) === idMedico)?.nome) || c.medico || "—";

        return {
          id: c.id_consulta ?? c.id ?? raw?.id,
          paciente: pacienteNome,
          medico: medicoNome,
          data_consulta: c.data_consulta ?? c.data ?? raw?.data,
          hora_inicio: c.hora_inicio ?? c.horaInicio ?? raw?.hora_inicio,
          hora_fim: c.hora_fim ?? c.horaFim ?? raw?.hora_fim,
          status: c.status ?? raw?.status ?? "AGENDADA",
          __raw: raw,
        };
      });

      setConsultas(consultasCompletas);
      setPacientes(pList || []);
      setMedicos(mList || []);
    } catch (err) {
      console.error("Erro ao carregar consultas:", err);
      setConsultas([]);
      setPacientes([]);
      setMedicos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row) {
    if (!window.confirm(`Deseja realmente excluir esta consulta?`)) return;
    try {
      // row pode ser DataGrid row (tem id) ou objeto original em __raw
      const id = row.id ?? row.id_consulta ?? row.__raw?.id ?? row.__raw?.id_consulta;
      await deletarConsulta(Number(id));
      alert("Consulta excluída com sucesso!");
      await load();
    } catch (err) {
      console.error("Erro ao excluir consulta:", err);
      alert("Erro ao excluir consulta: " + (err.message || err));
    }
  }

  // Usa buscarConsultaPorId quando recebido apenas id (evita perder campos do backend)
  const handleView = useCallback(async (paramsRow) => {
    try {
      const raw = paramsRow?.__raw ?? paramsRow;
      const id = raw?.id ?? raw?.id_consulta;
      if (id && buscarConsultaPorId) {
        // buscarConsultaPorId pode retornar Promise ou valor direto
        const full = await buscarConsultaPorId(Number(id));
        setViewing(full ?? raw);
      } else {
        setViewing(raw ?? null);
      }
    } catch (err) {
      console.error("Erro ao buscar detalhe da consulta:", err);
      alert("Não foi possível carregar os detalhes da consulta.");
    }
  }, []);

  const handleEdit = useCallback(async (paramsRow) => {
    try {
      const raw = paramsRow?.__raw ?? paramsRow;
      const id = raw?.id ?? raw?.id_consulta;
      if (id && buscarConsultaPorId) {
        const full = await buscarConsultaPorId(Number(id));
        setEditing(full ?? { ...raw });
      } else {
        setEditing(raw ?? {});
      }
    } catch (err) {
      console.error("Erro ao preparar edição da consulta:", err);
      alert("Não foi possível abrir o editor da consulta.");
    }
  }, []);

  async function handleSave(data) {
    try {
      if (data.id || data.id_consulta) {
        await atualizarConsulta({
          id: Number(data.id || data.id_consulta),
          idPaciente: Number(data.idPaciente ?? data.id_paciente),
          idMedico: Number(data.idMedico ?? data.id_medico),
          data: data.data_consulta ?? data.data,
          horaInicio: data.hora_inicio ?? data.horaInicio,
          horaFim: data.hora_fim ?? data.horaFim,
          status: data.status,
        });
      } else {
        await agendarConsulta({
          idPaciente: Number(data.idPaciente ?? data.id_paciente),
          idMedico: Number(data.idMedico ?? data.id_medico),
          data: data.data_consulta ?? data.data,
          horaInicio: data.hora_inicio ?? data.horaInicio,
          horaFim: data.hora_fim ?? data.horaFim,
        });
      }
      alert("Consulta salva com sucesso!");
      setEditing(null);
      await load();
    } catch (err) {
      console.error("Erro ao salvar consulta:", err);
      alert("Erro ao salvar consulta: " + (err.message || err));
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "paciente", headerName: "Paciente", flex: 1 },
    { field: "medico", headerName: "Médico", flex: 1 },
    { field: "data_consulta", headerName: "Data", width: 140 },
    { field: "hora_inicio", headerName: "Início", width: 120 },
    { field: "hora_fim", headerName: "Fim", width: 120 },
    { field: "status", headerName: "Status", width: 140 },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="Visualizar"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleEdit(params.row)}
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
            <h2>Consultas</h2>
            <button onClick={() => setEditing({})} className={styles.btnPrimary}>
              <AddIcon style={{ marginRight: 6 }} /> Nova Consulta
            </button>
          </header>

          {loading ? (
            <p>Carregando consultas...</p>
          ) : (
            <div style={{ width: "100%" }}>
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={consultas}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableSelectionOnClick
                  autoHeight
                />
              </div>
            </div>
          )}

          {editing && (
            <ConsultaForm
              consultaToEdit={editing}
              pacientes={pacientes}
              medicos={medicos}
              onClose={async () => {
                setEditing(null);
                await load();
              }}
              onSave={handleSave}
            />
          )}

          {viewing && (
            <ConsultaDetail
              consulta={viewing}
              pacientes={pacientes}
              medicos={medicos}
              onClose={() => setViewing(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
