import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Skeleton } from 'antd';
import cx from 'classnames';

import allRoutes, { routes, loggedInRoutes, loggedOutRoutes } from './router';
import Header from './components/Header';
import client from './apollo-client';
import UserContext from './context/UserContext';
import MobileContext from './context/MobileContext';
import Error404 from './pages/Errors/404';
import ErrorBoundary from './components/ErrorBoundary';
import NoteDetails from './pages/Notes/NoteDetails';
import { makeStyles } from '@material-ui/styles';

const { Content } = Layout;

const useStyles = makeStyles({
  container: {
    flexGrow: 1,
    minHeight: '100vh',
    padding: '10px 50px',
    '@media screen and (max-width: 600px)': {
      padding: '10px 10px',
    },
  },
  extraPadding: {
    paddingTop: 58,
  },
});

function App() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileMode, setMobileMode] = useState(false);
  const classes = useStyles();
  // Check if token is in localstorage
  useEffect(() => {
    const jwt = localStorage.getItem('iut-notes-jwt') || '';
    setToken(jwt);
    setLoading(false);
  }, []);

  function getNavRoutes() {
    return routes.concat(token ? loggedInRoutes : loggedOutRoutes);
  }

  const containerClass = cx({
    [classes.container]: true,
    [classes.extraPadding]: mobileMode,
  });
  return (
    <ApolloProvider client={client}>
      <UserContext.Provider value={{ token, setToken }}>
        <MobileContext.Provider value={{ mobileMode, setMobileMode }}>
          <BrowserRouter>
            <Layout>
              <Header routes={getNavRoutes()} />
              <Content className={containerClass}>
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
        </MobileContext.Provider>
      </UserContext.Provider>
    </ApolloProvider>
  );
}

export default App;
