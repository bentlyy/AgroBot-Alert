import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineSwapRight } from 'react-icons/ai';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    axios.get('/api/auth/me', { withCredentials: true })
      .then((res) => {
        if (!mounted) return;
        if (res.data?.authenticated) {
          localStorage.setItem('user', JSON.stringify(res.data.usuario));
          navigate('/dashboard', { replace: true });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setChecking(false);
      });
    return () => { mounted = false; };
  }, [navigate]);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = '/api/auth/login';
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
          <p>Monitoreo agricola inteligente</p>
        </div>
        <h3>Acceso AMG</h3>
        <p style={{ marginBottom: 16, color: '#52606d' }}>
          AgroBot usa el inicio de sesion central de AMGPlatform.
        </p>

        <motion.button
          className="authBtn"
          type="button"
          onClick={handleLogin}
          disabled={loading || checking}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {checking ? 'Verificando sesion...' : loading ? 'Redirigiendo...' : 'Ingresar con AMG'}
          <AiOutlineSwapRight className="icon" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
