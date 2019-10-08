import React from 'react';
import { Skeleton, message, Card, Row, Col } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { withApollo } from 'react-apollo';

import LoginBoundary from '../components/LoginBoundary';
import { GET_CURRENT_USER } from '../queries/users';
import CategoryForm from '../components/CategoryForm';

function Administration({ client }) {
  const { loading, error, data } = useQuery(GET_CURRENT_USER, { client });

  if (loading) {
    return <Skeleton active />;
  }
  if (error) {
    message.error('Erreur lors de la récupération des données : ' + error.message);
    return 'Veuillez rafraîchir la page.'
  }
  if (!data.me.roles.includes('admin')) {
    return 'Non autorisé à accéder à cette page.';
  }

  return (
    <LoginBoundary>
      <h1>Administration</h1>
      <Row type="flex" justify="start">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card title="Ajout de catégorie" style={{ width: '100%' }}>
            <CategoryForm />
          </Card>
        </Col>
      </Row>
    </LoginBoundary>
  )
}

export default withApollo(Administration);
