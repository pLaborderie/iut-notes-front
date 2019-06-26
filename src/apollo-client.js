import ApolloClient from 'apollo-boost';

const token = localStorage.getItem('iut-notes-jwt');
const { protocol, hostname, port } = window.location;
const uri = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:4000/graphql'
  : `${protocol}//${hostname}:${port}/graphql`
export default new ApolloClient({
  uri,
  headers: {
    authorization: token ? `Bearer ${token}` : ''
  },
});
