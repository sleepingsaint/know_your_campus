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