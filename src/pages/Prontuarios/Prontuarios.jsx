import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DataTable from "@/components/DataTable/DataTable";
import ProntuarioEdit from "./ProntuarioEdit";

import { prontuarios as mockProntuarios } from "@/services/mockProntuarios";
import { getConsultas } from "@/services/mockConsultas";
import { getPatients } from "@/services/mockPatients";
import { getMedicos } from "@/services/mockMedicos";

import styles from "../Dashboard/dashboard.module.css";

export default function Prontuarios() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prontuarios, setProntuarios] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [selectedProntuario, setSelectedProntuario] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    try {
      setProntuarios(Array.isArray(mockProntuarios) ? [...mockProntuarios] : []);
      setConsultas(Array.isArray(getConsultas()) ? getConsultas() : []);
      setPacientes(Array.isArray(getPatients()) ? getPatients() : []);
      setMedicos(Array.isArray(getMedicos()) ? getMedicos() : []);
    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      setProntuarios([]);
      setConsultas([]);
      setPacientes([]);
      setMedicos([]);
    }
  }, []);

  // Controle da sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);
  const setSidebarState = useCallback((state) => {
    setSidebarCollapsed(state);
  }, []);

  // Editar
  const handleEdit = useCallback((row) => {
    if (!row) return;
    setSelectedProntuario(row);
    setIsEditing(true);
  }, []);

  // Deletar
  const handleDelete = useCallback((row) => {
    if (!row?.id_prontuario) return;
    if (window.confirm("Deseja realmente excluir este prontuário?")) {
      setProntuarios((prev) =>
        prev.filter((p) => p.id_prontuario !== row.id_prontuario)
      );
    }
  }, []);

  // Salvar edição
  const handleSave = useCallback((data) => {
    if (!data) return;
    setProntuarios((prev) =>
      prev.map((p) =>
        p.id_prontuario === data.id_prontuario ? data : p
      )
    );
    setIsEditing(false);
    setSelectedProntuario(null);
  }, []);

  // Cancelar
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setSelectedProntuario(null);
  }, []);

  // Monta dados para a tabela
  const dataForTable = (Array.isArray(prontuarios) ? prontuarios : []).map((p) => {
    const consulta = consultas.find((c) => c.id_consulta === p.id_consulta);
    const paciente = pacientes.find(
      (x) => x.id_paciente === consulta?.id_paciente
    );
    const medico = medicos.find(
      (x) => x.id_medico === consulta?.id_medico
    );

    return {
      ...p,
      paciente: paciente ? paciente.nome : "—",
      medico: medico ? medico.nome : "—",
      data_consulta: consulta ? consulta.data_consulta : "—",
    };
  });

  const columns = [
    { key: "id_prontuario", title: "ID" },
    { key: "paciente", title: "Paciente" },
    { key: "medico", title: "Médico" },
    { key: "data_consulta", title: "Data da Consulta" },
    { key: "diagnostico", title: "Diagnóstico" },
    { key: "prescricao", title: "Prescrição" },
    { key: "data_registro", title: "Data Registro" },
  ];

  return (
    <div className={styles.appContainer}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarState}
      />
      <div
        className={`${styles.mainContent} ${
          sidebarCollapsed ? styles.expanded : ""
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <div className={styles.pageContent}>
          <h1>Prontuários</h1>

          {!isEditing && (
            <>
              <DataTable
                data={dataForTable}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}

          {isEditing && selectedProntuario && (
            <div className={styles.formContainer}>
              <ProntuarioEdit
                initialData={selectedProntuario}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
