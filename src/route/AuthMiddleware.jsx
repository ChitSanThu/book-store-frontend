import Cookies from 'js-cookie'
import React from 'react'
import { Navigate } from 'react-router-dom'

const AuthMiddleware = ({children}) => {
    if(Cookies.get('token')) return children
    else return <Navigate to="/login"/>
}

export default AuthMiddleware
