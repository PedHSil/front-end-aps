import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DataTable from "@/components/DataTable/DataTable";
import ConsultaForm from "./ConsultaForm";
import ConsultaDetail from "./ConsultaDetail";

import { getConsultas, deleteConsulta, addConsulta, updateConsulta } from "@/services/mockConsultas";
import { getPatients } from "@/services/mockPatients";
import { getMedicos } from "@/services/mockMedicos";

import styles from "../Dashboard/dashboard.module.css";

export default function Consultas() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      setConsultas(Array.isArray(getConsultas()) ? getConsultas() : []);
      setPacientes(Array.isArray(getPatients()) ? getPatients() : []);
      setMedicos(Array.isArray(getMedicos()) ? getMedicos() : []);
    } catch (err) {
      console.error("Erro ao carregar dados iniciais de Consultas:", err);
      setConsultas([]);
      setPacientes([]);
      setMedicos([]);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const setSidebarState = useCallback((state) => {
    setSidebarCollapsed(state);
  }, []);

  // handler robusto: aceita id numérico ou objeto linha
  const handleDelete = useCallback((payload) => {
    try {
      const id = (typeof payload === "number")
        ? payload
        : (payload && (payload.id_consulta || payload.id || payload.__raw?.id_consulta));
      if (!id) return;
      if (window.confirm("Deseja realmente excluir esta consulta?")) {
        deleteConsulta(Number(id));
        setConsultas(getConsultas());
      }
    } catch (err) {
      console.error("Erro ao deletar consulta:", err);
    }
  }, []);

  const handleAdd = () => setIsAdding(true);

  const handleView = useCallback((row) => {
    // row pode ser a linha já formatada ou o objeto original
    const consulta = (row && row.__raw) ? row.__raw : row;
    setSelectedConsulta(consulta || null);
    setIsViewing(true);
  }, []);

  const handleEdit = useCallback((row) => {
    const consulta = (row && row.__raw) ? row.__raw : row;
    setSelectedConsulta(consulta || null);
    setIsEditing(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsAdding(false);
    setIsEditing(false);
    setConsultas(getConsultas());
  }, []);

  const handleSave = useCallback((data) => {
    try {
      if (data.id_consulta) updateConsulta(data);
      else addConsulta(data);
      setConsultas(getConsultas());
      setIsAdding(false);
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar consulta:", err);
    }
  }, []);

  // prepara dados para a tabela (evita uso direto de lookup no render do DataTable)
  const dataForTable = consultas.map(c => ({
    id_consulta: c.id_consulta,
    paciente: pacientes.find(p => p.id_paciente === c.id_paciente)?.nome || "—",
    medico: medicos.find(m => m.id_medico === c.id_medico)?.nome || "—",
    data_consulta: c.data_consulta,
    hora_inicio: c.hora_inicio,
    hora_fim: c.hora_fim,
    status: c.status,
    __raw: c, // deixa o objeto original disponível
  }));

  const columns = [
    { key: "id_consulta", title: "ID" },
    { key: "paciente", title: "Paciente" },
    { key: "medico", title: "Médico" },
    { key: "data_consulta", title: "Data" },
    { key: "hora_inicio", title: "Início" },
    { key: "hora_fim", title: "Fim" },
    { key: "status", title: "Status" },
  ];

  return (
    <div className={styles.appContainer}>
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarState} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className={styles.pageContent}>
          <h1>Consultas</h1>

          {!isAdding && !isViewing && !isEditing && (
            <>
              <button
                style={{
                  backgroundColor: "#2b7cff",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  cursor: "pointer",
                }}
                onClick={handleAdd}
              >
                + Nova Consulta
              </button>

              <DataTable
                data={dataForTable}
                columns={columns}
                onView={(row) => handleView(row)}
                onEdit={(row) => handleEdit(row)}
                onDelete={(row) => handleDelete(row)}
              />
            </>
          )}

          {isAdding && (
            <div className={styles.formContainer}>
              <ConsultaForm
                pacientes={pacientes}
                medicos={medicos}
                onSave={handleSave}
                onCancel={handleFormClose}
              />
            </div>
          )}

          {isEditing && (
            <div className={styles.formContainer}>
              <ConsultaForm
                pacientes={pacientes}
                medicos={medicos}
                initialData={selectedConsulta}
                onSave={handleSave}
                onCancel={handleFormClose}
              />
            </div>
          )}

          {isViewing && (
            <div className={styles.viewContainer}>
              <ConsultaDetail
                consulta={selectedConsulta}
                pacientes={pacientes}
                medicos={medicos}
                onClose={() => setIsViewing(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
