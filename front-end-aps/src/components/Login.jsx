import React from 'react';
import './login.css';

function Login() {
  return (
    <div className="container">
      <div className="heading">Sign In</div>
      <form action="" className="form">
        <input
          required
          className="login-button1"
          type="email"
          name="email"
          id="email"
          placeholder="E-mail"
        />
        <input
          required
          className="login-button1"
          type="password"
          name="password"
          id="password"
          placeholder="Senha"
        />
        <span className="forgot-password">
          <a href="#">Esqueceu a Senha?</a>
        </span>
        <input
          className="login-button"
          type="submit"
          value="Sign In"
        />
      </form>
    </div>
  );
}

export default Login;
