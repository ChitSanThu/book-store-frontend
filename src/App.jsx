import { useState } from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom';
import AuthMiddleware from './route/AuthMiddleware';
import Book from './pages/Book';
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import Category from './pages/Category';
import SaleRecord from './pages/SaleRecord';
import CustomerRecord from './pages/CustomerRecord';

function App() {
  const routes = [
    {
      path: '/books',
      element: <Book />
    },
    {
      path: '/categories',
      element: <Category />
    },
    {
      path: '/sales',
      element: <SaleRecord />
    },
    {
      path: '/customers',
      element: <CustomerRecord />
    }
  ]
  return (
    <div className='bg-secondary'>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthMiddleware>
              <Layout />
            </AuthMiddleware>
          }
        >
          <Route index element={<Dashboard />} />
          {routes && routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Route>
      </Routes>
    </div>

  )
}

export default App
