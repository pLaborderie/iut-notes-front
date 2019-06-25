import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import { Button } from 'antd';
import { Redirect } from 'react-router-dom';

function Logout() {
  const { token, setToken } = useContext(UserContext);

  function logout() {
    if (token) {
      setToken('');
    }
  }

  if (!token) {
    return <Redirect to="/" />
  }

  return (
    <>
      <h1>Voulez-vous vraiment vous déconnecter ?</h1>
      <Button type="danger" onClick={logout}>Se déconnecter</Button>
    </>
  )
}

export default Logout;