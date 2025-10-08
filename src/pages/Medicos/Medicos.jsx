// src/pages/Medicos/Medicos.jsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DataTable from "@/components/DataTable/DataTable";
import MedicoForm from "./MedicoForm";
import MedicoView from "./medicoView";
import { getMedicos, deleteMedico } from "@/services/mockMedicos";
import styles from "../Dashboard/dashboard.module.css";

export default function Medicos() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [medicos, setMedicos] = useState([]);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setMedicos(getMedicos());
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const setSidebarState = useCallback((state) => {
    setSidebarCollapsed(state);
  }, []);

  const handleDelete = (id) => {
    deleteMedico(id);
    setMedicos(getMedicos());
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleView = (medico) => {
    setSelectedMedico(medico);
    setIsViewing(true);
  };

  const handleEdit = (medico) => {
    setSelectedMedico(medico);
    setIsEditing(true);
  };

  const handleFormClose = () => {
    setIsAdding(false);
    setIsEditing(false);
    setMedicos(getMedicos());
  };

  return (
    <div className={styles.appContainer}>
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarState} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className={styles.pageContent}>
          <h1>Médicos</h1>

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
                + Novo Médico
              </button>

              <DataTable
                data={medicos}
                columns={[
                  { key: "id", title: "ID" },
                  { key: "nome", title: "Nome" },
                  { key: "crm", title: "CRM" },
                  { key: "especialidade", title: "Especialidade" },
                  { key: "telefone", title: "Telefone" },
                ]}
                onView={handleView}
                onDelete={handleDelete}
                onEdit={handleEdit} // novo callback para editar
              />
            </>
          )}

          {isAdding && <MedicoForm onClose={handleFormClose} />}
          {isEditing && (
            <MedicoForm
              onClose={handleFormClose}
              medicoToEdit={selectedMedico} // passa o médico para editar
            />
          )}
          {isViewing && (
            <MedicoView medico={selectedMedico} onClose={() => setIsViewing(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
