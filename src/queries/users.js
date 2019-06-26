import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query getUser {
    me {
      id
      name
      email
    }
  }
`;