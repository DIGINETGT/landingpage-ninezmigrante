import {
  ApolloClient,
  InMemoryCache,
  from,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { setContext } from '@apollo/client/link/context';

const logLink = new ApolloLink((operation, forward) => {
  const t0 = performance.now();
  return forward(operation).map((result) => {
    const t1 = performance.now();
    return result;
  });
});

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_APP_BASENAME,
  useGETForQueries: true,
  fetchOptions: { mode: 'cors', credentials: 'omit' },
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `Bearer ${import.meta.env.VITE_API_URL_GRAPH_TOKEN}`,
  },
}));

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors?.length) {
    console.warn('GraphQL errors', {
      op: operation.operationName,
      graphQLErrors,
    });
  }
  if (networkError) console.warn('Network error', networkError);
});

const retryLink = new RetryLink({
  delay: { initial: 300, max: 1500, jitter: true },
  attempts: { max: 2, retryIf: (err) => !!err },
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        monthlyReports: {
          merge: (_existing, incoming) => incoming,
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: from([retryLink, errorLink, logLink, authLink, httpLink]),
  cache,
  queryDeduplication: true,
  defaultOptions: {
    query: { fetchPolicy: 'cache-first', nextFetchPolicy: 'cache-first' },
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  },
});

export default client;
