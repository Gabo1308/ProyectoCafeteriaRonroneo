import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'; 
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
import { Login } from "./components/Layout/Login";
import { Registrar } from "./components/Layout/Registrar";
import { Cart } from "./components/Cafeteria/Cart";

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
          path: "/login",
          element: <Login />,
        },
        {
          path: "/create",
          element: <Registrar />,
        },
        {
          path: "/carrito",
          element: <Cart />,
        },
      ], 
    }, 
  ], ); 
createRoot(document.getElementById('root')).render( 
  <StrictMode> 
      <RouterProvider router={rutas} /> 
  </StrictMode>, 
); 
