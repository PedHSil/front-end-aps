import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DataTable from "@/components/DataTable/DataTable";
import EspecialidadeForm from "./EspecialidadeForm";
import { especialidades as mockEspecialidades } from "@/services/mockEspecialidades";
import styles from "../Dashboard/dashboard.module.css";

export default function Especialidades() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Carregar especialidades iniciais
  useEffect(() => {
    try {
      setEspecialidades(Array.isArray(mockEspecialidades) ? [...mockEspecialidades] : []);
    } catch (err) {
      console.error("Erro ao carregar especialidades:", err);
      setEspecialidades([]);
    }
  }, []);

  // Controle da sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);
  const setSidebarState = useCallback((state) => {
    setSidebarCollapsed(state);
  }, []);

  // Adicionar
  const handleAdd = useCallback(() => {
    setIsAdding(true);
  }, []);

  // Editar
  const handleEdit = useCallback((row) => {
    if (!row) return;
    setSelectedEspecialidade(row);
    setIsEditing(true);
  }, []);

  // Deletar
  const handleDelete = useCallback((row) => {
    if (!row?.id_especialidade) return;
    if (window.confirm("Deseja realmente excluir esta especialidade?")) {
      setEspecialidades((prev) =>
        prev.filter((e) => e.id_especialidade !== row.id_especialidade)
      );
    }
  }, []);

  // Salvar nova ou edição
  const handleSave = useCallback((data) => {
    if (!data) return;
    setEspecialidades((prev) => {
      if (data.id_especialidade) {
        // edição
        return prev.map((e) =>
          e.id_especialidade === data.id_especialidade ? data : e
        );
      } else {
        // nova especialidade
        const nextId = prev.length
          ? Math.max(...prev.map((e) => e.id_especialidade)) + 1
          : 1;
        return [...prev, { ...data, id_especialidade: nextId }];
      }
    });
    setIsAdding(false);
    setIsEditing(false);
    setSelectedEspecialidade(null);
  }, []);

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedEspecialidade(null);
  }, []);

  // Colunas da tabela
  const columns = [
    { key: "id_especialidade", title: "ID" },
    { key: "nome", title: "Nome" },
    { key: "descricao", title: "Descrição" },
  ];

  return (
    <div className={styles.appContainer}>
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarState} />
      <div
        className={`${styles.mainContent} ${
          sidebarCollapsed ? styles.expanded : ""
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <div className={styles.pageContent}>
          <h1>Especialidades</h1>

          {/* LISTAGEM */}
          {!isAdding && !isEditing && (
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
                + Nova Especialidade
              </button>

              <DataTable
                data={especialidades}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}

          {/* FORMULÁRIO */}
          {(isAdding || isEditing) && (
            <div className={styles.formContainer}>
              <EspecialidadeForm
                initialData={isEditing ? selectedEspecialidade : null}
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
