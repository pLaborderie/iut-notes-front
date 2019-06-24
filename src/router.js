import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from './pages/Login';

export const routes = [
  { name: 'Accueil', path: '/', exact: true, component: Home },
  { name: 'Se connecter', path: '/login', component: Login },
];

function Router({ children }) {
  return (
    <BrowserRouter>
      {children}
      <Switch>
        {routes.map(route => (
          <Route {...route} />
        ))}
      </Switch>
    </BrowserRouter>
  )
}

export default Router;