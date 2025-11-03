import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import dashboardService from "../../../services/dashboard";

export default function QuickPanel({ patientId = 1, medicoId = 1 }) {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState([]);
  const [consultasPaciente, setConsultasPaciente] = useState([]);
  const [consultasMedico, setConsultasMedico] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [error, setError] = useState(null);
  const [consultaStatuses, setConsultaStatuses] = useState({});
  const [actionResult, setActionResult] = useState(null);

  // Relatórios
  const [proximasConsultas, setProximasConsultas] = useState([]);
  const [proximasLoading, setProximasLoading] = useState(false);
  const [dataHorarios, setDataHorarios] = useState(new Date().toISOString().split("T")[0]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosLoading, setHorariosLoading] = useState(false);
  const [contagemEspecialidades, setContagemEspecialidades] = useState([]);
  const [contagemLoading, setContagemLoading] = useState(false);

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
          dashboardService.listarConsultasPorData(todayDate),
          dashboardService.listarConsultasPorPaciente(patientId),
          dashboardService.listarConsultasPorMedico(medicoId),
          dashboardService.listarHistoricoPaciente(patientId),
        ]);

        if (!mounted) return;

        setToday(consultasHojeResp?.data || []);
        setConsultasPaciente(consultasPacienteResp?.data || []);
        setConsultasMedico(consultasMedicoResp?.data || []);
        setHistorico(historicoResp?.data || []);

        const initialStatuses = {};
        [
          ...(consultasHojeResp?.data || []),
          ...(consultasPacienteResp?.data || []),
          ...(consultasMedicoResp?.data || []),
        ].forEach((c) => {
          if (c && c.id != null) initialStatuses[c.id] = c.status || "AGENDADA";
        });
        setConsultaStatuses(initialStatuses);
      } catch (err) {
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    carregarProximasConsultas();
    carregarContagemEspecialidades();
    carregarHorariosDisponiveis(dataHorarios);

    return () => (mounted = false);
  }, [patientId, medicoId]);

  // --- Relatórios ---
  async function carregarProximasConsultas() {
    setProximasLoading(true);
    try {
      const resp = await dashboardService.relatorioProximasConsultas(medicoId);
      setProximasConsultas(resp?.data || []);
    } catch (err) {
      console.error("Erro prox consultas:", err);
    } finally {
      setProximasLoading(false);
    }
  }

  async function carregarHorariosDisponiveis(dataYYYYMMDD = dataHorarios) {
    setHorariosLoading(true);
    try {
      const resp = await dashboardService.buscarHorariosDisponiveis(medicoId, dataYYYYMMDD);
      setHorariosDisponiveis(resp?.data || []);
    } catch (err) {
      console.error("Erro horários:", err);
    } finally {
      setHorariosLoading(false);
    }
  }

  async function carregarContagemEspecialidades() {
    setContagemLoading(true);
    try {
      const resp = await dashboardService.contarPacientesPorEspecialidade();
      setContagemEspecialidades(resp?.data || []);
    } catch (err) {
      console.error("Erro contagem especialidades:", err);
    } finally {
      setContagemLoading(false);
    }
  }

  async function handleItemUpdate(id) {
    const statusValue = consultaStatuses[id];
    if (!statusValue) return;
    try {
      const resp = await dashboardService.atualizarConsulta(id, { status: statusValue });
      setActionResult({ success: true, mensagem: resp?.mensagem || "Status atualizado!" });
    } catch (err) {
      setActionResult({ success: false, mensagem: err.message || String(err) });
    }
  }

  function renderConsultas(lista, titulo) {
    if (!lista.length) return <Typography>Sem {titulo.toLowerCase()}.</Typography>;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>{titulo}</Typography>
          <List dense>
            {lista.map((c) => {
              const pacienteNome =
                c.paciente?.nome || c.pacienteNome || "Paciente não informado";
              const medicoNome =
                c.medico?.nome || c.nomeMedico || "Médico não informado";
              const statusValue = consultaStatuses[c.id] || c.status || "AGENDADA";

              return (
                <React.Fragment key={c.id}>
                  <ListItem alignItems="flex-start" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <ListItemText
                      primary={`#${c.id} — ${pacienteNome}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Data: {c.dataConsulta || "-"} | Início: {c.horaInicio || "-"} | Fim: {c.horaFim || "-"}
                          </Typography>
                          <Typography variant="body2">Médico: {medicoNome}</Typography>
                          <Typography variant="body2">Status atual: <b>{statusValue}</b></Typography>
                        </Box>
                      }
                      secondaryTypographyProps={{ component: "div" }} // ✅ Evita <p> aninhado
                    />
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Select
                        size="small"
                        value={statusValue}
                        onChange={(e) =>
                          setConsultaStatuses((prev) => ({ ...prev, [c.id]: e.target.value }))
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
            {lista.map((c, i) => (
              <React.Fragment key={i}>
                <ListItem>
                  <ListItemText
                    primary={`Data: ${c.dataConsulta || "—"} (${c.statusConsulta || c.status || "—"})`}
                    secondary={
                      <Box>
                        <Typography variant="body2">Hora: {c.horaInicio ? `${c.horaInicio} - ${c.horaFim}` : "—"}</Typography>
                        <Typography variant="body2">Médico: {c.nomeMedico || "—"}</Typography>
                        <Typography variant="body2">Anamnese: {c.anamnese || "—"}</Typography>
                        <Typography variant="body2">Diagnóstico: {c.diagnostico || "—"}</Typography>
                        <Typography variant="body2">Prescrição: {c.prescricao || "—"}</Typography>
                      </Box>
                    }
                    secondaryTypographyProps={{ component: "div" }} // ✅ evita <p> dentro de <p>
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
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
          <Typography variant="body2" color="text.secondary">
            Resumo das consultas e histórico do paciente
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()} disabled={loading}>
          Atualizar
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
              <Grid key={i} item size={{ xs: 12, sm: 6, md: 3 }}> {/* ✅ Grid v2 */}
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

          {/* Relatórios */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Próximas Consultas do Médico</Typography>
              {proximasLoading ? (
                <CircularProgress size={24} />
              ) : proximasConsultas.length ? (
                <List dense>
                  {proximasConsultas.map((c) => (
                    <ListItem key={c.id}>
                      <ListItemText
                        primary={`${c.dataConsulta} ${c.horaInicio}-${c.horaFim} — ${c.nomePaciente}`}
                        secondary={<Typography component="div">Status: {c.status}</Typography>}
                        secondaryTypographyProps={{ component: "div" }} // ✅
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Sem próximas consultas.</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Horários Disponíveis</Typography>
              <TextField
                type="date"
                size="small"
                value={dataHorarios}
                onChange={(e) => {
                  setDataHorarios(e.target.value);
                  carregarHorariosDisponiveis(e.target.value);
                }}
                sx={{ mb: 2 }}
              />
              {horariosLoading ? (
                <CircularProgress size={24} />
              ) : horariosDisponiveis.length ? (
                <List dense>
                  {horariosDisponiveis.map((h, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`${h.horaInicio} - ${h.horaFim}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Nenhum horário disponível.</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Pacientes por Especialidade</Typography>
              {contagemLoading ? (
                <CircularProgress size={24} />
              ) : contagemEspecialidades.length ? (
                <List dense>
                  {contagemEspecialidades.map((e, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`${e.especialidade}: ${e.totalPacientes}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Nenhum dado disponível.</Typography>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
