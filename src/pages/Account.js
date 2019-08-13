import React, { useState, useContext } from 'react';
import { Skeleton, message, Divider, Row, Col, Button, Modal, Steps, Form, Input } from 'antd';
import { withApollo } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { GET_CURRENT_USER } from '../queries/users';
import { DELETE_USER } from '../mutations/users';
import LoginBoundary from '../components/LoginBoundary';
import UserForm from '../components/UserForm';
import UpdatePasswordForm from '../components/UpdatePasswordForm';
import UserContext from '../context/UserContext';

const { Step } = Steps;

function Account({ client }) {
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [password, setPassword] = useState('');
  const [delInput, setDelInput] = useState('');
  const [step, setStep] = useState(0);
  const { loading, error, data } = useQuery(GET_CURRENT_USER, { client });
  const { setToken } = useContext(UserContext);
  const [deleteUser] = useMutation(DELETE_USER, {
    client,
    ignoreResults: true,
    onCompleted() {
      message.success('Compte supprimé.');
      setToken(null);
      localStorage.removeItem('iut-notes-jwt');
      closeModal();
    },
    onError(error) {
      if (error.message === 'GraphQL Error: Wrong password') {
        message.error('Mot de passe erroné.');
      } else {
        message.error('Une erreur est survenue.');
      }
    }
  });

  function handleDeleteUser() {
    if (delInput === 'SUPPRIMER') {
      deleteUser({ variables: { password } });
    } else {
      message.error('Saisissez "SUPPRIMER" pour continuer.');
    }
  }

  function closeModal() {
    setDeleteUserModal(false);
    setPassword('');
    setDelInput('');
    setStep(0);
  }

  return (
    <LoginBoundary>
      <h1>Mon compte</h1>
      {(() => {
        if (loading) return <Skeleton active />;
        if (error) {
          message.error('Erreur lors de la récupération des données : ' + error.message);
          return 'Veuillez rafraîchir la page.'
        }
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Divider>Informations de l'utilisateur</Divider>
                <UserForm user={data.me} />
              </Col>
              <Col xs={24} md={12}>
                <Divider>DANGER</Divider>
                <UpdatePasswordForm />
                <Divider />
                <Button type="danger" onClick={() => setDeleteUserModal(true)}>Supprimer les données</Button>
              </Col>
            </Row>
          </>
        )
      })()}
      <Modal
        title="Supprimer le compte ?"
        visible={deleteUserModal}
        onOk={handleDeleteUser}
        okButtonProps={{ disabled: step < 1, type: 'danger' }}
        cancelButtonProps={{ type: 'primary' }}
        onCancel={closeModal}
        mask
        okText="Supprimer"
        cancelText="Annuler"
      >
        <Steps current={step}>
          <Step title="Identité" />
          <Step title="Confirmation" />
        </Steps>
        {step === 0 &&
          <>
            <h3>Confirmez votre identité en saisissant votre mot de passe.</h3>
            <Form.Item label="Mot de passe">
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <Button type="primary" onClick={() => setStep(1)}>Confirmer</Button>
            </Form.Item>
          </>
        }
        {step === 1 &&
          <>
            <h3>Afin de supprimer votre compte, saisissez SUPPRIMER dans le texte ci-dessous :</h3>
            <Input value={delInput} onChange={e => setDelInput(e.target.value)} />
          </>
        }
      </Modal>
    </LoginBoundary>
  );
}

export default withApollo(Account);