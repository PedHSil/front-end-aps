import React from "react";
import { Modal, Box, Typography, Divider, Button } from "@mui/material";

export default function PacienteView({ paciente, onClose }) {
  if (!paciente) return null;

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" mb={2}>Detalhes do Paciente</Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography><strong>Nome:</strong> {paciente.nome}</Typography>
        <Typography><strong>Sexo:</strong> {paciente.sexo}</Typography>
        <Typography><strong>CPF:</strong> {paciente.cpf}</Typography>
        <Typography><strong>Data Nascimento:</strong> {paciente.data_nascimento}</Typography>
        <Typography><strong>Telefone:</strong> {paciente.telefone}</Typography>
        <Typography><strong>Email:</strong> {paciente.email}</Typography>
        <Typography><strong>Logradouro:</strong> {paciente.logradouro}</Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={onClose}>
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
