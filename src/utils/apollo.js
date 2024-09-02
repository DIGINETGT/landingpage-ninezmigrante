import { ApolloClient, InMemoryCache, ApolloCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_APP_BASENAME,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
  headers: {
    Authorization:
      'Bearer a6a73a15fe500c78d2d427cf9fffa1409f56314902c3a7deb6dc6fb776c2457834a747338163164817dab4cf3ae2ed538ef37133c87690d0a4a5d8846db3eee7cfa2e09b994b90af745cbfb4112008fb27cf3e2fcfa312f13b9538cd7c42d39e1c703c1bae8dcf1d5e19f37ad9e4f4bae596bf98d551fba6e2dde5c7ee1a4bea',
  },
});

export default apolloClient;
