import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';

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

function Header({ location, routes }) {
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Title>
        IUT Notes
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
  )
}

export default withRouter(Header);