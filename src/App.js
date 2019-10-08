import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { Skeleton, message } from 'antd';
import cx from 'classnames';

import allRoutes, { routes, loggedInRoutes, loggedOutRoutes, adminRoutes } from './router';
import Header from './components/Header';
import client from './apollo-client';
import UserContext from './context/UserContext';
import MobileContext from './context/MobileContext';
import Error404 from './pages/Errors/404';
import ErrorBoundary from './components/ErrorBoundary';
import NoteDetails from './pages/Notes/NoteDetails';
import EditNote from './pages/Notes/EditNote';
import { makeStyles } from '@material-ui/styles';
import { GET_CURRENT_USER } from './queries/users';

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
  const { loading: loadingUser, error, data } = useQuery(GET_CURRENT_USER, { client });
  // Check if token is in localstorage
  useEffect(() => {
    const jwt = localStorage.getItem('iut-notes-jwt') || '';
    setToken(jwt);
    setLoading(false);
    window.addEventListener('session-expired', () => {
      localStorage.removeItem('iut-notes-jwt');
      setToken(null);
      message.info('Session expirée, veuillez vous reconnecter.');
    });
  }, []);

  function getNavRoutes() {
    let navRoutes = routes;
    if (token) {
      navRoutes = [...navRoutes, ...loggedInRoutes];
    } else {
      navRoutes = [...navRoutes, ...loggedOutRoutes];
    }
    if (!loadingUser && !error && data.me.roles) {
      if (data.me.roles.includes('admin')) {
        navRoutes = [...navRoutes, ...adminRoutes];
      }
    }
    return navRoutes;
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
                      <Route path="/notes/edit/:id" component={EditNote} />
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
