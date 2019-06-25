import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import allRoutes, { routes, loggedInRoutes, loggedOutRoutes } from './router';
import Header from './components/Header';
import client from './apollo-client';
import UserContext from './context/UserContext';

const { Content } = Layout;

function App() {
  const [token, setToken] = useState('fetching...');
  // Check if token is in localstorage
  useEffect(() => {
    const jwt = localStorage.getItem('iut-notes-jwt') || '';
    setToken(jwt);
  }, []);

  function getNavRoutes() {
    return routes.concat(token ? loggedInRoutes : loggedOutRoutes);
  }

  return (
    <ApolloProvider client={client}>
      <UserContext.Provider value={{ token, setToken }}>
        <BrowserRouter>
          <Layout>
            <Header routes={getNavRoutes()} />
            <Content style={{ padding: '10px 50px', flexGrow: 1, minHeight: '100vh' }}>
              <Switch>
                {allRoutes.map(route => (
                  <Route key={`route-${route.path}`} {...route} />
                ))}
              </Switch>
            </Content>
          </Layout>
        </BrowserRouter>
      </UserContext.Provider>
    </ApolloProvider>
  );
}

export default App;
