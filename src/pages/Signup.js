import React, { useContext } from 'react';
import { Form, Icon, Button, Input, message } from 'antd';
import { withApollo } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { CREATE_USER, LOGIN } from '../mutations/users';
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

function Signup({ form, client }) {
  const { getFieldDecorator } = form;
  const { token, setToken } = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();
    form.validateFields((err, { name, email, password }) => {
      if (!err) {
        // Do the thing
        createUser({
          name,
          email,
          password
        });
      } else {
        console.error(err);
        message.error('Erreur lors de la validation du formulaire.');
      }
    });
  }

  function createUser(user) {
    client.mutate({
      mutation: CREATE_USER,
      variables: user,
    }).then((val) => {
      // Log in user ?
      // Display success message
      const { email, password } = user;
      client.mutate({
        mutation: LOGIN,
        variables: { email, password }
      }).then(res => {
        localStorage.setItem('iut-notes-jwt', res.data.logIn);
        setToken(res.data.logIn);
      }).catch(err => {
        console.error(err);
        message.error('Erreur lors de la connexion au nouveau compte. Merci de réessayer.')
      });
    }).catch(err => {
      console.error(err);
      message.error('Erreur lors de la création du compte.')
    });
  }

  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  function validateRepeatPassword(rule, value, callback) {
    const password = form.getFieldValue('password');
    if (password === value) {
      // Good !
      callback([]);
    } else {
      callback(['Password don\'t match'])
    }
  }

  function isFormValid() {
    return Object.entries(form.getFieldsError()).every(err => err[1] === undefined);
  }

  if (token) {
    return <Redirect to="/" />
  }

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <h1>Créer un compte</h1>
      <Item
        label="Nom"
      >
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'Veuillez saisir un nom.' }],
          validateTrigger: 'onBlur'
        })(
          <Input name="name" placeholder="Nom" prefix={<Icon type="user" />} />
        )}
      </Item>
      <Item
        label="Email"
      >
        {getFieldDecorator('email', {
          rules: [{
            required: true,
            message: 'Veuillez saisir une adresse email.'
          }, {
            pattern: emailRegex,
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
      <Item
        label="Répétez le mot de passe"
      >
        {getFieldDecorator('repeatPassword', {
          rules: [{
            required: true,
            message: 'Veuillez confirmer le mot de passe.'
          }, {
            validator: validateRepeatPassword,
            message: 'Les mots de passes doivent être identiques.'
          }],
          validateTrigger: 'onBlur'
        })(
          <Input
            type="password"
            name="repeatPassword"
            placeholder="Mot de passe"
            prefix={<Icon type="lock" />}
          />
        )}
      </Item>
      <Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button type="primary" htmlType="submit" disabled={!isFormValid()}>
          Confirmer
        </Button>
      </Item>
    </Form>
  )
}

export default Form.create({ name: 'signup' })(withApollo(Signup));