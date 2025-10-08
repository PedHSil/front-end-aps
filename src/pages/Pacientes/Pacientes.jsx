// src/pages/Pacientes/Pacientes.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getPatients, deletePatient } from "@/services/mockPatients";
import DataTable from "@/components/DataTable/DataTable";
import PacienteForm from "./PacienteForm";
import PacienteView from "./PacienteView";
import styles from "./Pacientes.module.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function Pacientes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const setSidebarState = useCallback((state) => {
    setSidebarCollapsed(state);
  }, []);

  async function load() {
    setLoading(true);
    const list = await getPatients();
    setData(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const columns = [
    { key: "nome", title: "Nome" },
    { key: "cpf", title: "CPF" },
    { key: "data_nascimento", title: "Nascimento" },
    { key: "telefone", title: "Telefone" },
    { key: "email", title: "E-mail" },
  ];

  async function handleDelete(row) {
    if (!confirm(`Excluir ${row.nome}?`)) return;
    await deletePatient(row.id);
    await load();
  }

  return (
    <div className={styles.appContainer}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarState}
      />

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
      <p>Carregando...</p>
    ) : (
      <DataTable
        columns={columns}
        data={data}
        onEdit={(r) => setEditing(r)}
        onView={(r) => setViewing(r)}
        onDelete={handleDelete}
      />
    )}

    {editing !== null && (
      <PacienteForm
        initial={editing}
        onClose={() => {
          setEditing(null);
          load();
        }}
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
