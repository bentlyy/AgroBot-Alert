import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MdEmail, MdLock } from 'react-icons/md';
import { AiOutlineSwapRight } from 'react-icons/ai';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', {
        LoginNombre: email,
        LoginContrasena: password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <motion.div
        className="authCard"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="logo">
          <h1>AgroBot Alert</h1>
          <p>Monitoreo agrícola inteligente</p>
        </div>
        <h3>Iniciar Sesión</h3>

        {error && <span className="showMessage error">{error}</span>}

        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label>Correo electrónico</label>
            <div className="inputWrap">
              <MdEmail className="icon" />
              <input
                type="email"
                placeholder="admin@agrobot.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="inputGroup">
            <label>Contraseña</label>
            <div className="inputWrap">
              <MdLock className="icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button
            className="authBtn"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
            <AiOutlineSwapRight className="icon" />
          </motion.button>
        </form>

        <div className="authLink">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>
        <div className="authLink" style={{ marginTop: 8 }}>
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
