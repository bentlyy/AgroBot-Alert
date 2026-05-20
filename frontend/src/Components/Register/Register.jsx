import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MdEmail, MdLock, MdPerson, MdBadge } from 'react-icons/md';
import { AiOutlineSwapRight } from 'react-icons/ai';

const Register = () => {
  const [form, setForm] = useState({ email: '', nombre: '', password: '', rol: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/register', {
        Email: form.email,
        Nombre: form.nombre,
        Contrasena: form.password,
        Rol: form.rol || 'usuario',
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="authPage">
        <motion.div className="authCard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="logo"><h1>AgroBot Alert</h1><p>Registro exitoso</p></div>
          <div className="showMessage success">Usuario creado con éxito</div>
          <Link to="/"><button className="authBtn">Iniciar Sesión</button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="authPage">
      <motion.div className="authCard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="logo">
          <h1>AgroBot Alert</h1>
          <p>Crear nueva cuenta</p>
        </div>
        <h3>Registro</h3>

        {error && <span className="showMessage error">{error}</span>}

        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label>Correo electrónico</label>
            <div className="inputWrap">
              <MdEmail className="icon" />
              <input type="email" name="email" placeholder="correo@ejemplo.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="inputGroup">
            <label>Nombre</label>
            <div className="inputWrap">
              <MdPerson className="icon" />
              <input type="text" name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required />
            </div>
          </div>
          <div className="inputGroup">
            <label>Contraseña</label>
            <div className="inputWrap">
              <MdLock className="icon" />
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
          </div>
          <div className="inputGroup">
            <label>Rol</label>
            <div className="inputWrap">
              <MdBadge className="icon" />
              <input type="text" name="rol" placeholder="admin / usuario" value={form.rol} onChange={handleChange} />
            </div>
          </div>

          <motion.button className="authBtn" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {loading ? 'Registrando...' : 'Registrarse'}
            <AiOutlineSwapRight className="icon" />
          </motion.button>
        </form>

        <div className="authLink">
          ¿Ya tienes cuenta? <Link to="/">Inicia Sesión</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
