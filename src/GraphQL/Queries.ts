import { gql } from '@apollo/client';

export const GET_REVIEWS = gql`
    query GET_REVIEWS($first: Int, $after: String){
        reviews(first: $first, after: $after){
            pageInfo{
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
            edges{
                cursor
                node{
                    id
                    review
                    tldr
                    createdAt
                    updatedAt
                    upvotes
                    downvotes
                }
            }
        }
    }
`

export const GET_REVIEW_COMMENTS = gql`
    query GET_REVIEW_COMMENTS($review_id: ID!, $first: Int, $after: String){
        reviewComments(reviewId: $review_id, first: $first, after: $after){
            pageInfo{
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
            edges{
                cursor
                node{
                    id
                    comment
                    createdAt
                    updatedAt
                    user{
                        id
                        username
                        avatar
                    }
                }
            }
        }
    }
`