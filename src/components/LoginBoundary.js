import React, { useContext } from 'react';
import Login from '../pages/Login';
import UserContext from '../context/UserContext';

function LoginBoundary({ children }) {
  const { token } = useContext(UserContext);
  const style = token ? null : { display: 'none' };
  return (
    <React.Fragment>
      <div style={style}>
        {children}
      </div>
      {!token && <Login />}
    </React.Fragment>
  );
}

export default LoginBoundary;