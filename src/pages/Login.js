import React, { useContext } from 'react';
import { Form, Icon, Button, Input, } from 'antd';
import { withApollo } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { LOGIN } from '../mutations/users';
import UserContext from '../context/UserContext';

const { Item } = Form;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

function Login({ form, client }) {
  const { token, setToken } = useContext(UserContext);
  const { getFieldDecorator } = form;
  function handleSubmit(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        console.error(err);
      } else {
        login(values);
      }
    });
  }

  async function login(user) {
    try {
      const { data } = await client.mutate({
        mutation: LOGIN,
        variables: user
      });
      localStorage.setItem('iut-notes-jwt', data.logIn);
      setToken(data.logIn);
    } catch (err) {
      console.error(err)
    }
  }

  if (token) {
    return <Redirect to="/" />
  }

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <h1>Se connecter</h1>
      <Item
        label="Email"
      >
        {getFieldDecorator('email', {
          rules: [{
            required: true,
            message: 'Veuillez saisir une adresse email.'
          }, {
            type: 'email',
            message: 'Veuillez saisir une adresse email valide.'
          }],
          validateTrigger: 'onBlur'
        })(
          <Input
            name="email"
            placeholder="Adresse email"
            prefix={<Icon type="mail" />}
          />
        )}
      </Item>
      <Item
        label="Mot de passe"
      >
        {getFieldDecorator('password', {
          rules: [{
            required: true,
            message: 'Veuillez saisir un mot de passe.'
          }, {
            min: 8,
            message: 'Le mot de passe doit faire au moins 8 caractères.'
          }],
          validateTrigger: 'onBlur'
        })(
          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            prefix={<Icon type="lock" />}
          />
        )}
      </Item>
      <Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Confirmer
        </Button>
      </Item>
    </Form>
  )
}

export default Form.create({ name: 'login' })(withApollo(Login));