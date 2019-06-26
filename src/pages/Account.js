import React, { useContext } from 'react';
import { Skeleton, message } from 'antd';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';

import UserContext from '../context/UserContext';
import { GET_CURRENT_USER } from '../queries/users';

function Account() {
  const { token } = useContext(UserContext);

  if (!token) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <h1>Mon compte</h1>
      <Query query={GET_CURRENT_USER}>
        {({ loading, error, data }) => {
          if (loading) return <Skeleton active />;
          if (error) {
            message.error('Erreur lors de la récupération des données : ' + error.message);
            return 'Veuillez rafraîchir la page.'
          }
          return (
            <>
              <p>Nom : {data.me.name}</p>
              <p>Email : {data.me.email}</p>
              <p>TODO:</p>
              <ul>
                <li>Changer infos compte</li>
                <li>Voir ses notes</li>
                <li>Supprimer le compte et toutes ses données</li>
              </ul>
            </>
          )
        }}
      </Query>
    </>
  );
}

export default Account;