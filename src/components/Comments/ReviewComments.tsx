import React, { useState, useEffect } from "react";
import { GET_REVIEW_COMMENTS } from "../../GraphQL/Queries";
import { CREATE_REVIEW_COMMENT } from "../../GraphQL/Mutations";

import { useQuery, useMutation } from "@apollo/client";

interface ReviewCommentEdge {
	cursor: string;
	node: ReviewComment;
}

interface ReviewComment {
	id: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
	user: {
		id: number;
		username: string;
		avatar: string;
	};
	objectId: number;
}

export default function ReviewComments(props: { review_id: number }) {
	const { data, loading, error, fetchMore } = useQuery(GET_REVIEW_COMMENTS, {
		variables: {
			first: 10,
			after: null,
			review_id: props.review_id,
		},
	});

	// comments created by the current user
	// will be displayed seperately just to show their comments
	const [newComments, setNewComments] = useState<Array<ReviewComment>>([]);

	
	const [
		createReviewComment,
		{data: newCommentData, loading: newCommentLoading, error: newCommentError },
	] = useMutation(CREATE_REVIEW_COMMENT);
	
	useEffect(() => {
		if(newCommentData && newCommentData.createComment){
			console.log(newCommentData);
			setNewComments([...newComments, newCommentData.createComment.comment]);
		}
	}, [newCommentData]);

	const [comment, setComment] = useState<string>("");
	const onCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
		setComment(e.target.value);

	const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createReviewComment({
			variables: {
				comment: comment,
				review_id: props.review_id,
			},
		});
		setComment("");
	};

	const loadMoreComments = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(data.reviewComments.pageInfo.endCursor);
		fetchMore({
			variables: {
				first: 10,
				after: data.reviewComments.pageInfo.endCursor,
				review_id: props.review_id,
			},
		});
	};

	if (loading) return <p>Loading Comments...</p>;
	if (error) return <p>Oops something went wrong try again</p>;

	return (
		<div>
			{data &&
				data.reviewComments.edges.map((n: ReviewCommentEdge, index: number) => (
					<div key={index}>
						<p>{n.node.user.username}</p>
						<p>{n.node.comment} - {n.cursor}</p>
					</div>
				))}
			{data &&
				data.reviewComments.pageInfo &&
				data.reviewComments.pageInfo.hasNextPage && (
					<button onClick={loadMoreComments}>Load More Comments</button>
				)}
			{newComments && <div>
					<hr />
					{newComments.map((c: ReviewComment, index: number) => <div key={index}>
						<p>{c.user.username}</p>
						<p>{c.comment}</p>
					</div>)}
				</div>}
			{newCommentLoading && <p>Adding comment...</p>}
			{newCommentError && <p>Oops something went wrong try again.</p>}
			{!newCommentLoading && !newCommentError && (
				<form onSubmit={handleAddComment}>
					<textarea
						name="comment"
						placeholder="leave a comment"
						value={comment}
						onChange={onCommentChange}
						required
					/>
					<button type="submit">Add Comment</button>
				</form>
			)}
		</div>
	);
}
