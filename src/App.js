import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Skeleton } from 'antd';

import allRoutes, { routes, loggedInRoutes, loggedOutRoutes } from './router';
import Header from './components/Header';
import client from './apollo-client';
import UserContext from './context/UserContext';
import Error404 from './pages/Errors/404';
import ErrorBoundary from './components/ErrorBoundary';
import NoteDetails from './pages/Notes/NoteDetails';

const { Content } = Layout;

function App() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  // Check if token is in localstorage
  useEffect(() => {
    const jwt = localStorage.getItem('iut-notes-jwt') || '';
    setToken(jwt);
    setLoading(false);
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
              <ErrorBoundary>
                {loading
                  ? <Skeleton active />
                  : <Switch>
                    {allRoutes.map(route => (
                      <Route key={`route-${route.path}`} {...route} />
                    ))}
                    <Route path="/notes/:id" component={NoteDetails} />
                    <Route component={Error404} />
                  </Switch>
                }
              </ErrorBoundary>
            </Content>
          </Layout>
        </BrowserRouter>
      </UserContext.Provider>
    </ApolloProvider>
  );
}

export default App;
