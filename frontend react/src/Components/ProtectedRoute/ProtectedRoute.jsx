import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" />;
    }
    return React.cloneElement(element, rest);
};

export default ProtectedRoute;
