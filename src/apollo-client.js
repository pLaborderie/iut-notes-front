import ApolloClient from 'apollo-boost';

const token = localStorage.getItem('iut-notes-jwt');
const { protocol, hostname, port } = window.location;
const uri = `${protocol}//${hostname}:${port}/graphql`;
console.log(uri);
export default new ApolloClient({
  uri,
  headers: {
    authorization: token ? `Bearer ${token}` : ''
  },
});
