import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    let mounted = true;
    axios.get('/api/auth/me', { withCredentials: true })
      .then((res) => {
        if (!mounted) return;
        localStorage.setItem('user', JSON.stringify(res.data.usuario));
        setState({ loading: false, ok: !!res.data.authenticated });
      })
      .catch(() => {
        if (!mounted) return;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setState({ loading: false, ok: false });
      });
    return () => { mounted = false; };
  }, []);

  if (state.loading) return <div style={{ padding: 24 }}>Verificando sesion AMG...</div>;
  if (!state.ok) return <Navigate to="/" />;
  return <Component {...rest} />;
};

export default ProtectedRoute;
