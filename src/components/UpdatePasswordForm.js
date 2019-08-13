import React from 'react';
import { message, Form, Button } from 'antd';
import { withApollo } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';

import { UPDATE_PASSWORD } from '../mutations/users';

import FormInput from './FormInput';

function UpdatePasswordForm({ client, form }) {

  const [updatePassword, { loading }] = useMutation(UPDATE_PASSWORD, {
    client,
    onCompleted() {
      message.success('Mot de passe modifiée.');
      form.resetFields();
    },
    onError(error) {
      if (error.message === 'GraphQL error: Wrong password') {
        message.error('Mot de passe erroné.');
      } else {
        message.error('Une erreur est survenue.');
      }
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    form.validateFields((err, { oldPassword, newPassword }) => {
      if (err) {
        message.error(err);
      } else {
        updatePassword({ variables: { oldPassword, newPassword } });
      }
    })
  }
  function validateRepeatPassword(rule, value, callback) {
    const password = form.getFieldValue('newPassword');
    if (password === value) {
      // Good !
      callback([]);
    } else {
      callback(['Password don\'t match'])
    }
  }
  return (
    <Form layout="vertical" onSubmit={handleSubmit}>
      <FormInput
        label="Mot de passe actuel"
        form={form}
        rules={[{
          required: true,
          message: 'Veuillez saisir le mot de passe actuel.'
        }, {
          min: 8,
          message: 'Le mot de passe doit faire au moins 8 caractères.'
        }]}
        name="oldPassword"
        type="password"
      />
      <FormInput
        label="Nouveau mot de passe"
        form={form}
        rules={[{
          required: true,
          message: 'Veuillez saisir un nouveau mot de passe.'
        }, {
          min: 8,
          message: 'Le mot de passe doit faire au moins 8 caractères.'
        }]}
        name="newPassword"
        type="password"
      />
      <FormInput
        label="Répéter le nouveau mot de passe"
        form={form}
        rules={[{
          required: true,
          message: 'Veuillez saisir répéter le nouveau mot de passe.'
        }, {
          validator: validateRepeatPassword,
          message: 'Les mots de passes doivent être identiques.'
        }]}
        name="repeatNewPassword"
        type="password"
      />
      <Button htmlType="submit" type="danger" loading={loading}>Modifier</Button>
    </Form>
  )
}
export default Form.create({ name: 'update_password_form' })(withApollo(UpdatePasswordForm))