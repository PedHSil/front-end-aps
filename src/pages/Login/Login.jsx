import { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import styles from './login.module.css'; // Importando o CSS Module

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // Aqui futuramente irá a chamada da API
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1 className={styles.loginTitle}>Login</h1>
        <Input 
          label="Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <Input 
          label="Senha" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <Button type="submit" className="w-full mt-4">
          Entrar
        </Button>
      </form>
    </div>
  );
}
