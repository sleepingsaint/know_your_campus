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
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import LogIn from "./components/Auth/LogIn";
import Logout from "./components/Auth/Logout";
import VerifyAccount from "./components/Auth/VerifyAccount";
import ResendActivationMail from "./components/Auth/ResendActivationMail";
import SendPasswordResetMail from "./components/Auth/SendPasswordResetMail";
import ResetPassword from "./components/Auth/ResetPassword";

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ))
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
        <Router>
          <Route path="/register" component={CreateAccount} />
          <Route path="/login" component={LogIn} />
          <Route path="/logout" component={Logout} />
          <Route path="/activate/:token" component={VerifyAccount} />
          <Route path="/resend-activation-email" component={ResendActivationMail} />
          <Route path="/send-password-reset-email" component={SendPasswordResetMail} />
          <Route path="/password-reset/:token" component={ResetPassword} />
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
