import React from "react";
import CreateAccount from "./components/Auth/CreateAccount";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    // use this for token expiration and 
    // get fresh token using refresh token
    // for (let err of graphQLErrors) {
    //   if(!err || !err.extensions) continue;
    //   switch (err.extensions.code) {
    //     // Apollo Server sets code to UNAUTHENTICATED
    //     // when an AuthenticationError is thrown in a resolver
    //     case 'UNAUTHENTICATED':

    //       // Modify the operation context with a new token
    //       const oldHeaders = operation.getContext().headers;
    //       operation.setContext({
    //         headers: {
    //           ...oldHeaders,
    //           authorization: "",
    //         },
    //       });
    //       // Retry the request, returning the new observable
    //       return forward(operation);      }
    // }
  }

  if (networkError) {
    console.log(`Network Error ${networkError}`);
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    errorLink,
    new HttpLink({ uri: "http://localhost:8000/graphql" }),
  ]),
});

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <CreateAccount />
      </ApolloProvider>
    </div>
  );
}

export default App;
