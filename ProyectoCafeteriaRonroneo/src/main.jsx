import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Home } from './components/Home/Home';
import { PageNotFound } from './components/Home/PageNotFound';
import { CatalogProductos } from "./components/Cafeteria/CatalogProductos.jsx";
import { CatalogCombos } from "./components/Cafeteria/CatalogCombos.jsx";
import { CatalogMenu } from "./components/Cafeteria/CatalogMenu.jsx";
import { CatalogPreparacion } from "./components/Cafeteria/CatalogPreparacion.jsx";
import { DetalleProductos } from './components/Cafeteria/DetalleProductos.jsx';
import { DetalleCombos } from './components/Cafeteria/DetalleCombos.jsx';
import { DetalleMenu } from './components/Cafeteria/DetalleMenu.jsx';
import { DetallePreparacion } from './components/Cafeteria/DetallePreparacion.jsx';
import { GestionProductos } from './components/Admin/GestionProductos.jsx';
import { GestionCombos } from './components/Admin/GestionCombos.jsx';
import { GestionMenus } from './components/Admin/GestionMenus.jsx';
import { GestionPreparacion } from './components/Admin/GestionPreparacion.jsx';
import { GestionUsuarios } from './components/Admin/GestionUsuarios.jsx';
import { Dashboard } from './components/Admin/Dashboard.jsx';
import { PedidoEstacion } from "./components/Cafeteria/PedidoEstacion";
import { Login } from "./components/Layout/Login";
import { Registrar } from "./components/Layout/Registrar";
import { HistorialPedidos } from "./components/Cafeteria/HistorialPedidos";
import { DetallePedido } from "./components/Cafeteria/DetallePedido";
import { RegistrarPedido } from "./components/Cafeteria/RegistrarPedido";
import { Cart } from "./components/Cafeteria/Cart";
import { CarritosPendientes } from "./components/Cafeteria/CarritosPendientes";

function RegistrarPedidoPersonal() {
  const userStr = localStorage.getItem('user');
  const usuario = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const esPersonal = usuario?.Rol === 'Encargado' || usuario?.Rol === 'Administrador';

  return esPersonal ? <RegistrarPedido /> : <Navigate to="/carrito" replace />;
}

function CarritosPendientesPersonal() {
  const userStr = localStorage.getItem('user');
  const usuario = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const esPersonal = usuario?.Rol === 'Encargado' || usuario?.Rol === 'Administrador';

  return esPersonal ? <CarritosPendientes /> : <Navigate to="/" replace />;
}

const rutas = createBrowserRouter( 
  [     { 
      element: <App />,       
      children: [ 
        { 
          path: '/', 
          element: <Home /> 
        },
        {
          path: '*',
          element: <PageNotFound />
        },
        {
          path: '/catalog-productos/',
          element: <CatalogProductos />,
        },
        {
          path: '/catalog-combos/',
          element: <CatalogCombos />,
        },
        {
          path: '/catalog-menu/',
          element: <CatalogMenu />,
        },
        {
          path: '/catalog-preparacion/',
          element: <CatalogPreparacion />,
        },
        {
          path: '/producto/:id',
          element: <DetalleProductos />,
        },
        {
          path: '/combo/:id',
          element: <DetalleCombos />,
        },
        {
          path: '/menu/:id',
          element: <DetalleMenu />,
        },
        {
          path: '/preparacion/:id',
          element: <DetallePreparacion />,
        },
        {
          path: '/admin/productos/',
          element: <GestionProductos />,
        },
        {
          path: '/admin/combos/',
          element: <GestionCombos />,
        },
        {
          path: '/admin/menus/',
          element: <GestionMenus />,
        },
        {
          path: '/admin/preparacion/',
          element: <GestionPreparacion />,
        },
        {
          path: '/admin/usuarios/',
          element: <GestionUsuarios />,
        },
        {
          path: '/dashboard',
          element: <Dashboard />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/create",
          element: <Registrar />,
        },
        ,{
          path: "/pedidos",
          element: <HistorialPedidos />,
        },
        {
          path: "/carrito",
          element: <Cart />,
        },
        {
          path: "/pedido/:id",
          element: <DetallePedido />,
        },
        {
          path: "/registrar-pedido",
          element: <RegistrarPedidoPersonal />,
        },
        {
          path: "/carritos-pendientes",
          element: <CarritosPendientesPersonal />,
        },
        {
          path: "/estacion",
          element: <PedidoEstacion />,
        },
        
      ], 
    }, 
  ], ); 
createRoot(document.getElementById('root')).render( 
  <StrictMode> 
      <RouterProvider router={rutas} /> 
  </StrictMode>, 
); 
