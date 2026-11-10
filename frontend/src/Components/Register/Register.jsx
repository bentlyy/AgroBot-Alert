import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineSwapRight } from 'react-icons/ai';

const Register = () => {
  return (
    <div className="authPage">
      <motion.div className="authCard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="logo">
          <h1>AgroBot Alert</h1>
          <p>Acceso centralizado</p>
        </div>
        <h3>Registro</h3>
        <p style={{ marginBottom: 16, color: '#52606d' }}>
          Las cuentas se crean y administran en AMGPlatform.
        </p>
        <motion.button
          className="authBtn"
          type="button"
          onClick={() => { window.location.href = '/api/auth/login'; }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar con AMG
          <AiOutlineSwapRight className="icon" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Register;
