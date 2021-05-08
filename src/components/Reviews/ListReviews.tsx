import React from "react";
import { useQuery } from "@apollo/client";
import {GET_REVIEWS} from '../../GraphQL/Queries';
import ReviewComments from '../Comments/ReviewComments';

// interface PageInfo{
//     startCursor: String;
//     endCursor: String;
//     hasNextPage: Boolean;
//     hasPrevPage: Boolean;
// }

interface ReviewNode{
    cursor: String;
    node: Review;
}

interface Review{
    cursor: String;
    id: number;
    tldr: string;
    review: string;
    upvotes: number;
    downvotes: number;
    upvoted: boolean;
    downvoted: boolean;
}

export default function Reviews() {

    const {data, loading, error, fetchMore} = useQuery(GET_REVIEWS, {
        variables: {
            first: 1,
            after: undefined
        },
        notifyOnNetworkStatusChange: true
    });

    const loadMoreReviews = (e: React.MouseEvent<HTMLButtonElement>) => {
        fetchMore({
            variables: {
                first: 10,
                after: data.reviews.pageInfo.endCursor,
            }
        });
    }

    if(loading) return <p>Loading Screen...</p>;
    
    if(error) {
        if(error.message === "Unauthenticated"){
            return <p>Refreshing Token...</p>
        }
        return <p>Error</p>
    }

  return <div>
      {data && data.reviews.edges && data.reviews.edges.map((n: ReviewNode, index: number) => <div data-cursor={n.cursor} key={index}>
          <h4>{n.node.tldr}</h4>
          <p>{n.node.review} - {n.cursor}</p>
          <p><span>Upvotes: {n.node.upvotes}</span> <span>Downvotes: {n.node.downvotes}</span></p>
        <ReviewComments review_id={n.node.id} />
      </div>)}
      {data && data.reviews.pageInfo && data.reviews.pageInfo.hasNextPage && <button onClick={loadMoreReviews}>Load More Reviews</button>}
  </div>;
}
