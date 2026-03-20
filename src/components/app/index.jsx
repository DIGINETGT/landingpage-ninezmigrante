// REACT
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

// PROVIDERS
import RouterProvider from "../../providers/router";
import { Box, ChakraProvider, Spinner } from "@chakra-ui/react";

// UTILS
import { theme } from "../../utils/theme";

// COMPONENTS
import Layout from "../layout";
import ApolloProvider from "../../providers/apollo";

const App = () => {
  return (
    <BrowserRouter>
      <ApolloProvider>
        <ChakraProvider theme={theme}>
          <Layout>
            <Suspense
              fallback={
                <Box minH="50vh" display="grid" placeItems="center">
                  <Spinner thickness="6px" size="xl" color="blue.400" />
                </Box>
              }
            >
              <RouterProvider />
            </Suspense>
          </Layout>
        </ChakraProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
