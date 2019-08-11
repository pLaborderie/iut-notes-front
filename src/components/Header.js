import React, { useState, useContext } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import MobileContext from '../context/MobileContext';

const Sider = styled(Layout.Sider)`
  @media (max-width: 992px) {
    position: absolute !important;
    min-height: 100vh !important;
    z-index: 3;
  }
`;

const Title = styled.h3`
  height: 32px;
  color: #FFF;
  margin: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Navbar = styled.nav`
  background: #FFF;
  padding: 0;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  margin-bottom: 48px;
  height: 48px;
`;

const Trigger = styled(Icon)`
  font-size: 24px;
  cursor: pointer;
`

function Header({ location, routes }) {
  const [collapsed, setCollapsed] = useState(true);
  const { mobileMode, setMobileMode } = useContext(MobileContext);

  return (
    <>
      {mobileMode && (
        <Navbar>
          <h3 style={{ margin: 0, padding: 0 }}>
            IUT Notes
          </h3>
          <Trigger
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Navbar>
      )}
      <Sider
        breakpoint="lg"
        collapsible
        collapsed={collapsed}
        collapsedWidth={mobileMode ? '0' : '80'}
        onBreakpoint={setMobileMode}
        trigger={mobileMode ? null :
          <Trigger
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => setCollapsed(!collapsed)}
          />
        }
      >
        <Title>
          {collapsed ? null : 'IUT Notes'}
        </Title>
        <Menu
          theme="dark"
          mode="inline"
          style={{ lineHeight: '64px' }}
        >
          {routes.map((route) => (
            <Menu.Item
              key={route.path}
              className={location.pathname === route.path ? 'ant-menu-item-selected' : ''}
            >
              <NavLink to={route.path}>
                {route.icon && <Icon type={route.icon} />}
                <span>{route.name}</span>
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </>
  )
}

export default withRouter(Header);