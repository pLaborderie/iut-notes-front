import ApolloClient from 'apollo-boost';

const { protocol, hostname, port } = window.location;

const uri = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:4000/graphql'
  : protocol + '//' + hostname + ':' + port + '/graphql';

export default new ApolloClient({
  uri,
  request: operation => {
    const token = localStorage.getItem('iut-notes-jwt');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  },
  onError({ graphQLErrors, networkError }) {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        const err = message.split(': ')[1];
        if (extensions.code === '401' && err === 'TokenExpiredError') {
          // Todo: Log out user
          localStorage.removeItem('iut-notes-jwt');
          const event = document.createEvent('Event');
          event.initEvent('session-expired', true, true);
          window.dispatchEvent(event);
        }
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      });
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  },
});
