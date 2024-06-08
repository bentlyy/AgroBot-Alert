//Register.jsx
import React, { useState } from 'react';
import './Register.css';
import '../../App.scss';
import { Link } from 'react-router-dom';
import Axios from 'axios';

import video from '../../Assets/video.mp4';
import logo from '../../Assets/logo.png';

import { FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { MdMarkEmailRead } from 'react-icons/md';
import { HiBriefcase } from 'react-icons/hi';

const Register = () => {
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [rol, setRol] = useState('');
    const [error, setError] = useState('');
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [mostrarContraseña, setMostrarContraseña] = useState(false); // Nuevo estado

    const crearUsuario = (event) => {
        event.preventDefault(); // Prevent default form submission
        Axios.post('http://localhost:3000/api/auth/register', {
            Email: email,
            Nombre: nombre,
            Contraseña: contraseña,
            Rol: rol
        }).then(() => {
            setRegistroExitoso(true); // Registro exitoso
        }).catch((error) => {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Error al crear el usuario');
            }
            console.error('Error al crear el usuario:', error);
        });
    };

    return (
        <div className='registerPage flex'>
            <div className="container flex">
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>
                    <div className="textDiv">
                        <h2 className='title'>AgroBot Alert</h2>
                        <p className='customText'>¡ Soluciones Inteligentes para el Campo Moderno !</p>
                    </div>
                    <div className='footerDiv flex '>
                        <span className='text'>¡Accede ahora!</span>
                        <Link to={'/'}>
                            <button className='btn'>Iniciar Sesión</button>
                        </Link>
                    </div>
                </div>
                <div className='formDiv flex'>
                    <div className='headerDiv'>
                        <img src={logo} alt="Logo Image" />
                        <h3>Registrate</h3>
                    </div>

                    {registroExitoso ? (
                        <div className="successMessage">
                            <h4>Usuario creado con éxito</h4>
                            <p>Inicia sesión para entrar al sistema</p>
                           {/* <Link to={'/'}>
                                <button className='btn flex'>Iniciar Sesión</button>
                    </Link>*/}
                        </div>
                    ) : (
                        <form className="form grid" onSubmit={crearUsuario}>
                            {error && <span className='error'>{error}</span>}

                            <div className='inputDiv'>
                                <div className="input flex">
                                    <MdMarkEmailRead className='icon' />
                                    <input type="email" id='email' placeholder='Ingresa tu Email' onChange={(event) => setEmail(event.target.value)} required />
                                </div>
                            </div>

                            <div className='inputDiv'>
                                <div className="input flex">
                                    <FaUserShield className='icon' />
                                    <input type="text" id='nombre' placeholder='Ingresa tu Nombre' onChange={(event) => setNombre(event.target.value)} required />
                                </div>
                            </div>

                            <div className='inputDiv'>
                                <div className="input flex">
                                    <BsFillShieldLockFill className='icon' />
                                    <input type={mostrarContraseña ? 'text' : 'password'} id='contraseña' placeholder='Ingresa tu Contraseña' onChange={(event) => setContraseña(event.target.value)} required />
                                    <button type="button" className="togglePassword" onClick={() => setMostrarContraseña(!mostrarContraseña)}>
                                        {mostrarContraseña ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className='inputDiv'>
                                <div className="input flex">
                                    <HiBriefcase className='icon' />
                                    <input type="text" id='rol' placeholder='Ingresa tu Rol' onChange={(event) => setRol(event.target.value)} required />
                                </div>
                            </div>

                            <button type='submit' className='btn flex'>
                                <span>Registrarse</span>
                                <AiOutlineSwapRight className='icon' />
                            </button>

                            <span className='forgotPassword'>Olvidaste tu contraseña? <a href="/contraseñaPerdida">Click Aqui</a></span>
 
                           
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
