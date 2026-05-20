import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MdEmail } from 'react-icons/md';
import { AiOutlineSwapRight } from 'react-icons/ai';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/solicitar-recuperacion', { email });
      setSuccess(res.data.mensaje || 'Correo enviado correctamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <motion.div className="authCard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="logo">
          <h1>AgroBot Alert</h1>
          <p>Recuperar contraseña</p>
        </div>
        <h3>Recuperación</h3>

        {error && <span className="showMessage error">{error}</span>}
        {success && <span className="showMessage success">{success}</span>}

        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label>Correo electrónico</label>
            <div className="inputWrap">
              <MdEmail className="icon" />
              <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <motion.button className="authBtn" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
            <AiOutlineSwapRight className="icon" />
          </motion.button>
        </form>

        <div className="authLink">
          <Link to="/">Volver al inicio de sesión</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RecuperarContrasena;
