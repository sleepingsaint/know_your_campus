import { gql } from '@apollo/client';

export const CREATE_ACCOUNT = gql`
    mutation CREATE_ACCOUNT($email: String!, $username: String!, $password1: String!, $password2: String!){
        register(email: $email, username: $username, password1: $password1, password2: $password2){
            success
            errors
            token
        }
    }
`

export const LOGIN = gql`
    mutation LOGIN($username: String!, $password: String!){
        tokenAuth(username: $username, password: $password){
            success
            errors
            token
            refreshToken
            user{
                id
                username
                avatar
                verified
            }
        }
    }
`

export const VERIFY_ACCOUNT = gql`
    mutation VERIFY_ACCOUNT($token: String!){
        verifyAccount(token: $token){
            success
            errors
        }
    }
`

export const RESEND_ACTIVATION_MAIL = gql`
    mutation RESEND_ACTIVATION_MAIL($email: String!){
        resendActivationEmail(email: $email){
            success
            errors
        }
    }
`

export const SEND_PASSWORD_RESET_MAIL = gql`
    mutation SEND_PASSWORD_RESET_MAIL($email: String!){
        sendPasswordResetEmail(email: $email){
            success
            errors
        }
    }
`

export const RESET_PASSWORD = gql`
    mutation RESET_PASSWORD($token: String!, $password1: String!, $password2: String!){
        passwordReset(token: $token, newPassword1: $password1, newPassword2: $password2){
            success
            errors
        }
    }
`

export const CREATE_REVIEW_COMMENT = gql`
    mutation CREATE_REVIEW_COMMENT($comment: String, $review_id: ID!){
        createComment(comment:$comment, reviewId: $review_id){
            comment{
                id
                comment
                user{
                    id
                    username
                    avatar
                }
                createdAt
                updatedAt
                objectId
            }
        }
    }
`