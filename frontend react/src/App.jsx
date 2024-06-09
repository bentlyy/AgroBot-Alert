import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import RecuperarContraseña from './Components/Cextraviada/RecuperarContraseña';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/dashboard/*' element={<ProtectedRoute element={Dashboard} />} />
                <Route path="/recuperar" element={<RecuperarContraseña />} />
            </Routes>
        </Router>
    );
};

export default App;
