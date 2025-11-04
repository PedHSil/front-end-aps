import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Cancel, Edit, Refresh } from "@mui/icons-material";
import dashboardService from "../../../services/dashboard";

export default function QuickPanel({ patientId = 1, medicoId = 1 }) {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState([]);
  const [consultasPaciente, setConsultasPaciente] = useState([]);
  const [consultasMedico, setConsultasMedico] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [error, setError] = useState(null);

  const [consultaStatuses, setConsultaStatuses] = useState({}); // Estado dos status individuais
  const [actionResult, setActionResult] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      setError(null);
      setActionResult(null);
      try {
        const todayDate = new Date().toISOString().split("T")[0];

        const [
          consultasHojeResp,
          consultasPacienteResp,
          consultasMedicoResp,
          historicoResp,
        ] = await Promise.all([
          dashboardService.listarConsultasPorData(todayDate).catch((e) => ({ error: e })),
          dashboardService.listarConsultasPorPaciente(patientId).catch((e) => ({ error: e })),
          dashboardService.listarConsultasPorMedico(medicoId).catch((e) => ({ error: e })),
          dashboardService.listarHistoricoPaciente(patientId).catch((e) => ({ error: e })),
        ]);

        if (!mounted) return;

        if (
          consultasHojeResp?.error ||
          consultasPacienteResp?.error ||
          consultasMedicoResp?.error ||
          historicoResp?.error
        ) {
          setError("Alguma(s) chamada(s) falharam — ver console para detalhes.");
          console.error("Erros:", {
            consultasHojeResp,
            consultasPacienteResp,
            consultasMedicoResp,
            historicoResp,
          });
        }

        setToday(consultasHojeResp?.data || []);
        setConsultasPaciente(consultasPacienteResp?.data || []);
        setConsultasMedico(consultasMedicoResp?.data || []);
        setHistorico(historicoResp?.data || []);

        // Inicializa os status
        const initialStatuses = {};
        [...(consultasHojeResp?.data || []), ...(consultasPacienteResp?.data || []), ...(consultasMedicoResp?.data || [])].forEach(
          (c) => {
            initialStatuses[c.id] = c.status || "AGENDADA";
          }
        );
        setConsultaStatuses(initialStatuses);
      } catch (err) {
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => (mounted = false);
  }, [patientId, medicoId]);

  // Atualiza status de uma consulta específica
  async function handleItemUpdate(id) {
    const statusValue = consultaStatuses[id];
    if (!statusValue) return;
    try {
      const resp = await dashboardService.atualizarConsulta(id, { status: statusValue });
      setActionResult({ success: true, mensagem: resp?.mensagem || "Status atualizado!" });
    } catch (err) {
      console.error("Erro atualizar:", err);
      setActionResult({ success: false, mensagem: err.message });
    }
  }

  // Renderiza consultas com Select para status
  function renderConsultas(lista, titulo) {
    if (!lista.length) return <Typography>Nenhuma consulta.</Typography>;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>{titulo}</Typography>
          <List dense>
            {lista.map((c) => {
              const pacienteNome =
                c.paciente?.nome ||
                c.paciente?.nomeCompleto ||
                c.pacienteNome ||
                c.nomePaciente ||
                "Paciente não informado";
              const medicoNome =
                c.medico?.nome ||
                c.medico?.nomeCompleto ||
                c.medicoNome ||
                c.nomeMedico ||
                "Médico não informado";

              const statusValue = consultaStatuses[c.id] || "AGENDADA";

              return (
                <React.Fragment key={c.id}>
                  <ListItem alignItems="flex-start" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <ListItemText
                      primary={`#${c.id} — ${pacienteNome}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Data: {c.dataConsulta || "-"} | Início: {c.horaInicio || "-"} | Fim: {c.horaFim || "-"}
                          </Typography>
                          <Typography variant="body2">
                            Médico: {medicoNome}
                          </Typography>
                          <Typography variant="body2">
                            Status atual: <b>{statusValue}</b>
                          </Typography>
                        </>
                      }
                    />
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Select
                        size="small"
                        value={statusValue}
                        onChange={(e) =>
                          setConsultaStatuses(prev => ({ ...prev, [c.id]: e.target.value }))
                        }
                      >
                        <MenuItem value="AGENDADA">Agendada</MenuItem>
                        <MenuItem value="REALIZADA">Realizada</MenuItem>
                        <MenuItem value="CANCELADA">Cancelada</MenuItem>
                      </Select>
                      <Button size="small" variant="contained" onClick={() => handleItemUpdate(c.id)}>
                        Atualizar
                      </Button>
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }

  function renderHistorico(lista) {
    if (!lista || !lista.length) return <Typography>Sem histórico disponível.</Typography>;

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Histórico do Paciente</Typography>
          <List dense>
            {lista.map((item, i) => {
              const c = item.consulta || item;
              return (
                <React.Fragment key={i}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`Data: ${c.dataConsulta || "—"} (${c.statusConsulta || "—"})`}
                      secondary={
                        <>
                          <Typography variant="body2">Hora: {c.horaInicio ? `${c.horaInicio} - ${c.horaFim}` : "—"}</Typography>
                          <Typography variant="body2">Médico: {c.nomeMedico || "—"}</Typography>
                          <Typography variant="body2">Anamnese: {c.anamnese || "—"}</Typography>
                          <Typography variant="body2">Diagnóstico: {c.diagnostico || "—"}</Typography>
                          <Typography variant="body2">Prescrição: {c.prescricao || "—"}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#fff", borderRadius: 3, boxShadow: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Painel Rápido</Typography>
          <Typography variant="body2" color="text.secondary">Resumo das consultas e histórico do paciente</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          Atualizar
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <CircularProgress />
          <Typography variant="body2" mt={1}>Carregando dados...</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "Consultas de Hoje", value: today.length },
              { label: `Paciente #${patientId}`, value: consultasPaciente.length },
              { label: `Médico #${medicoId}`, value: consultasMedico.length },
              { label: "Histórico", value: historico.length },
            ].map((stat, i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">{stat.label}</Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {actionResult && (
            <Alert severity={actionResult.success ? "success" : "error"} sx={{ mb: 2 }}>
              {actionResult.mensagem}
            </Alert>
          )}

          {renderConsultas(today, "Consultas de Hoje")}
          {renderConsultas(consultasPaciente, `Consultas do Paciente #${patientId}`)}
          {renderConsultas(consultasMedico, `Consultas do Médico #${medicoId}`)}
          {renderHistorico(historico)}
        </>
      )}
    </Box>
  );
}
