import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from "@apollo/client/utilities";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwt_decode, { JwtPayload } from "jwt-decode";

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import CreateAccount from "./components/Auth/CreateAccount";
import LogIn from "./components/Auth/LogIn";
import Logout from "./components/Auth/Logout";
import VerifyAccount from "./components/Auth/VerifyAccount";
import ResendActivationMail from "./components/Auth/ResendActivationMail";
import SendPasswordResetMail from "./components/Auth/SendPasswordResetMail";
import ResetPassword from "./components/Auth/ResetPassword";
import Reviews from "./components/Reviews/ListReviews";

interface RefreshTokenResponseType{
  data: {
    refreshToken: {
      success: boolean;
      errors: any;
      token: string;
      refreshToken: string;
      refreshExpiresIn: number;
      payload: {
        username: string;
        exp: number;
        origIat: number;
      }
    }
  }
}

const refreshTokenLink = new TokenRefreshLink<RefreshTokenResponseType>({
  accessTokenField: 'token',
  isTokenValidOrUndefined: () => {
    let token = localStorage.getItem("token");
    if(!token) return true;
    if(token){
      let decoded_token: JwtPayload = jwt_decode(token);
      if(decoded_token && decoded_token.exp && decoded_token.exp * 1000 > Date.now()){
        return true;
      }
    }

    return false;
  },
  fetchAccessToken: async () => {
    let refreshToken = localStorage.getItem("refreshToken")
    let resp = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: `mutation {
          refreshToken(
            refreshToken: "${refreshToken}"
          ) {
            success,
            errors,
            payload,
            token,
            refreshToken
          }
        }` 
      }),
    });
    return resp.json();
  },
  handleFetch:(token) => {},
  handleResponse: (operation, accessToken) => (response: RefreshTokenResponseType) => {
    if(response.data && response.data.refreshToken.success){
      let data = response.data.refreshToken;

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    }    
  },
  handleError: (err: any) => {
    console.log('[error] ', err);
  }
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(message);
    });
  }

  if (networkError) {
    console.log(`Network Error ${networkError}`);
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem("refreshToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'x-refresh-token': refreshToken
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          reviews: relayStylePagination(),
          comments: relayStylePagination()
        }
      }
    }
  }),
  link: from([
    // @ts-ignore
    refreshTokenLink,
    errorLink,
    authLink.concat(new HttpLink({ uri: "http://localhost:8000/graphql" })),
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
          <Route path="/reviews" component={Reviews} />
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
