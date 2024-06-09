import React, { useState, useEffect } from 'react';
import './Login.css';
import '../../App.scss';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

import video from '../../Assets/video.mp4';
import logo from '../../Assets/logo.png';

import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';

const Login = () => {
    const [loginNombre, setLoginNombre] = useState('');
    const [loginContraseña, setLoginContraseña] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigateTo('/dashboard');
        }
    }, [navigateTo]);

    const loginUsuario = async (event) => {
        event.preventDefault();
        try {
            const response = await Axios.post('http://localhost:3000/api/auth/login', {
                LoginNombre: loginNombre,
                LoginContraseña: loginContraseña
            });

            if (response.data.message) {
                setErrorMessage(response.data.message);
                setSuccessMessage('');
            } else {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('usuario', response.data.nombre);

                setSuccessMessage('Inicio de sesión exitoso, redirigiendo al dashboard...');
                setErrorMessage('');
                setTimeout(() => {
                    navigateTo('/dashboard');
                }, 500);
            }
        } catch (error) {
            setErrorMessage('Hubo un error iniciando sesión');
            setSuccessMessage('');
            console.error('Hubo un error iniciando sesión', error);
        }
    };

    return (
        <div className='loginPage flex'>
            <div className="container flex">
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>
                    <div className="textDiv">
                        <h2 className='title'>AgroBot Alert</h2>
                        <p className='customText'>¡Soluciones Inteligentes para el Campo Moderno!</p>
                    </div>
                    <div className='footerDiv flex'>
                        <span className='text'>¿No tienes una cuenta?</span>
                        <Link to={'/register'}>
                            <button className='btn'>Regístrate</button>
                        </Link>
                    </div>
                </div>

                <div className='formDiv flex'>
                    <div className='headerDiv'>
                        <img src={logo} alt="Logo" />
                        <h3>¡Bienvenido de nuevo!</h3>
                    </div>

                    <form className="form grid" onSubmit={loginUsuario}>
                        {errorMessage && <span className='showMessage error'>{errorMessage}</span>}
                        {successMessage && <span className='showMessage success'>{successMessage}</span>}

                        <div className='inputDiv'>
                            <label htmlFor="nombre">Nombre</label>
                            <div className="input flex">
                                <FaUserShield className='icon' />
                                <input type="text" id='nombre' placeholder='Ingresa el nombre' onChange={(event) => {
                                    setLoginNombre(event.target.value);
                                }} />
                            </div>
                        </div>

                        <div className='inputDiv'>
                            <label htmlFor="contraseña">Contraseña</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon' />
                                <input type="password" id='contraseña' placeholder='Ingresa la contraseña' onChange={(event) => {
                                    setLoginContraseña(event.target.value);
                                }} />
                            </div>
                        </div>

                        <button type='submit' className='btn flex'>
                            <span>Iniciar Sesión</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>

                        <span className='forgotPassword'>
                            ¿Olvidaste tu contraseña? <a href="/recuperar">Haz clic aquí</a>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
