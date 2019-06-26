import ApolloClient from 'apollo-boost';

const { protocol, hostname, port } = window.location;

const uri = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:4000/graphql'
  : `${protocol}//${hostname}:${port}/graphql`

export default new ApolloClient({
  uri,
  request: operation => {
    const token = localStorage.getItem('iut-notes-jwt');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  }
});
