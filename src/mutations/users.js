import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      email
      password
    }
  }
`;

export const EDIT_USER = gql`
  mutation editUser($name: String!, $email: String!) {
    editUser(name: $name, email: $email)
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($password: String!) {
    deleteUser(password: $password)
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation editPassword($oldPassword: String!, $newPassword: String!) {
    editPassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    logIn(email: $email, password: $password)
  }
`;
