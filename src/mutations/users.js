import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      email
      password
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    logIn(email: $email, password: $password)
  }
`;
