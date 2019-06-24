import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { routes } from './router';
import Header from './components/Header';

const { Footer, Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header routes={routes} />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Content style={{ padding: '10px 50px', flexGrow: 1 }}>
            <Switch>
              {routes.map(route => (
                <Route key={`route-${route.path}`} {...route} />
              ))}
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', flexShrink: 1 }}>
            Paul Laborderie - 2019
          </Footer>
        </div>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
