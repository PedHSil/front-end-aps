import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Usando react-router-dom para navegação
import { Input } from '@/components/Input'; // Certifique-se de ter o componente Input configurado corretamente
import { Button } from '@/components/Button'; // Presumindo que o Button seja um componente personalizado
import styles from './login.module.css'; // Importando o CSS Module

// Importando o Snackbar do MUI
import { Snackbar, Alert } from '@mui/material';

export default function Login() {
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para controlar a visibilidade do Snackbar
  const navigate = useNavigate(); // Usando o hook do react-router-dom para navegação

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identificador,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro no login');
      }

      // Verifica se a resposta contém um identificador válido
      if (data && data.identificador === identificador) {
        console.log('Login bem-sucedido:', data);
        navigate('/dashboard'); // Redirecionando para a página de dashboard após o login bem-sucedido
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (err) {
      setErro(err.message); // Exibe a mensagem de erro se o login falhar
      setOpenSnackbar(true); // Abre o Snackbar quando ocorre um erro
    }
  };

  // Função para fechar o Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1 className={styles.loginTitle}>Login</h1>

        <Input 
          label="Identificador" 
          type="text" 
          value={identificador} 
          onChange={(e) => setIdentificador(e.target.value)}
          required 
        />
        <Input 
          label="Senha" 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)}
          required 
        />

        <Button type="submit" className="w-full mt-4">
          Entrar
        </Button>
      </form>

      {/* Snackbar para exibir a mensagem de erro */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Duração de exibição do Snackbar (6 segundos)
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {erro} {/* Exibe o erro vindo do estado */}
        </Alert>
      </Snackbar>
    </div>
  );
}
