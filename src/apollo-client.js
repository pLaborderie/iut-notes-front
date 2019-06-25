import ApolloClient from 'apollo-boost';

const token = localStorage.getItem('iut-notes-jwt');

export default new ApolloClient({
  uri: process.env.NODE_ENV !== 'production'
    ? 'http://localhost:4000/graphql'
    : '/',
  headers: {
    authorization: token ? `Bearer ${token}` : ''
  },
});
