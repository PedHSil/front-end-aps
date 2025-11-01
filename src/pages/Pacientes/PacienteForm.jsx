import React, { useEffect, useState } from "react";
import { createPatient, updatePatient } from "@/services/pacientes";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

export default function PacienteForm({ initial = {}, onClose }) {
  const [form, setForm] = useState({
    nome: "",
    sexo: "",
    cpf: "",
    data_nascimento: "",
    telefone: "",
    email: "",
    logradouro: ""
  });

  useEffect(() => {
    if (initial && initial.id) {
      setForm({ ...initial });
    } else {
      setForm({
        nome: "",
        sexo: "",
        cpf: "",
        data_nascimento: "",
        telefone: "",
        email: "",
        logradouro: ""
      });
    }
  }, [initial]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (form.id) {
        const payload = {
          telefone: form.telefone,
          email: form.email,
          logradouro: form.logradouro
        };
        await updatePatient(form.id, payload);
      } else {
        await createPatient(form);
      }
      onClose();
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          {form.id ? "Editar Paciente" : "Novo Paciente"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nome"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            required
            fullWidth
          />
          <TextField
            select
            label="Sexo"
            value={form.sexo}
            onChange={e => setForm({ ...form, sexo: e.target.value })}
            required
            fullWidth
          >
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Feminino</MenuItem>
          </TextField>
          <TextField
            label="CPF"
            value={form.cpf}
            onChange={e => setForm({ ...form, cpf: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Data de Nascimento"
            type="date"
            value={form.data_nascimento}
            onChange={e => setForm({ ...form, data_nascimento: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
          <TextField
            label="Telefone"
            value={form.telefone}
            onChange={e => setForm({ ...form, telefone: e.target.value })}
            fullWidth
          />
          <TextField
            label="E-mail"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Logradouro"
            value={form.logradouro}
            onChange={e => setForm({ ...form, logradouro: e.target.value })}
            fullWidth
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancelar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
