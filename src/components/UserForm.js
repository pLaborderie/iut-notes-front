import React from 'react';
import { message, Form, Button, Icon } from 'antd';
import { withApollo } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';

import { GET_CURRENT_USER } from '../queries/users';
import { EDIT_USER } from '../mutations/users';

import FormInput from './FormInput';

function UserForm({ client, form, user }) {

  const [editUser, { loading: updateLoading }] = useMutation(EDIT_USER, {
    client,
    refetchQueries: [{ query: GET_CURRENT_USER }],
    onCompleted() {
      message.success('Informations modifiées.');
    }
  });

  function handleEditUser(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        message.error(err);
      } else {
        editUser({ variables: values });
      }
    })
  }
  return (
    <Form layout="vertical" onSubmit={handleEditUser}>
      <FormInput
        label="Nom"
        form={form}
        rules={[{ required: true, message: 'Veuillez saisir un nom.' }]}
        name="name"
        placeholder="Nom Prénom"
        defaultValue={user.name}
        prefix={<Icon type="user" />}
      />
      <FormInput
        label="Email"
        form={form}
        rules={[{ required: true, message: 'Veuillez saisir un email.' }]}
        name="email"
        placeholder="nom.prenom@gmail.com"
        defaultValue={user.email}
        prefix={<Icon type="mail" />}
      />
      <Button htmlType="submit" type="primary" loading={updateLoading}>Modifier</Button>
    </Form>
  )
}
export default Form.create({ name: 'user_form' })(withApollo(UserForm))