import {gql} from '@apollo/client';

export const CREATE_ACCOUNT = gql`
    mutation CREATE_ACCOUNT($email: String!, $username: String!, $password1: String!, $password2: String!){
        register(email: $email, username: $username, password1: $password1, password2: $password2){
            success
            errors
            token
        }
    }
`