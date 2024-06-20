import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://ninezmigrante-api-kg336.ondigitalocean.app/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "Bearer f109b1829245cd323f35f76a9e9dd8408459e681b55eeb1a7614d90eaefe97ebae2fb517fdf42921c4aa93df3508adc769fdb279ffd764802ed3dbad86ba76fd55b0723339cd6c4613d7cfe7fa2cbfcc7818ced643bf27b041a480a9b6e3ce1eb4411ba70069f3ea243ef23a008b1a44411d9caaf814c6e52d8c806425c66127",
  },
});

export default apolloClient;
