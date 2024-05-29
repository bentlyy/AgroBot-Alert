import React, { useState } from 'react';
 // Ajusta la ruta si es necesario
import '../../App.scss';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';


import logo from '../../Assets/logo.png';

const RecuperarContraseña = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigateTo = useNavigate();

    const enviarSolicitudRecuperacion = async (event) => {
        event.preventDefault();
        try {
            const response = await Axios.post('http://localhost:3000/api/auth/recuperar', {
                email
            });
            if (response.data.message) {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
            } else {
                setErrorMessage('Hubo un error enviando la solicitud');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Hubo un error enviando la solicitud');
            setSuccessMessage('');
            console.error('Hubo un error enviando la solicitud', error);
        }
    };

    return (
        <div className='recuperarPage flex'>
            <div className="container flex">
                <div className='formDiv flex'>
                    <div className='headerDiv'>
                        <img src={logo} alt="Logo" />
                        <h3>Recuperar Contraseña</h3>
                    </div>

                    <form className="form grid" onSubmit={enviarSolicitudRecuperacion}>
                        {errorMessage && <span className='showMessage error'>{errorMessage}</span>}
                        {successMessage && <span className='showMessage success'>{successMessage}</span>}

                        <div className='inputDiv'>
                            <label htmlFor="email">Correo Electrónico</label>
                            <div className="input flex">
                                <input type="email" id='email' placeholder='Ingresa tu correo' onChange={(event) => {
                                    setEmail(event.target.value);
                                }} />
                            </div>
                        </div>

                        <button type='submit' className='btn flex'>
                            <span>Enviar Solicitud</span>
                        </button>

                        <span className='backToLogin'>
                            <Link to={'/'}>Volver al inicio de sesión</Link>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RecuperarContraseña;
