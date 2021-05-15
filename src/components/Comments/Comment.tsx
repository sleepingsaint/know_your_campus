import React from "react";
import { DELETE_REVIEW_COMMENT } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

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

interface CommentProps{
	comment: ReviewComment;
	new?: boolean;
	newComments?: Array<ReviewComment>;
	setNewComments?: Function;
}

export default function Comment(props: CommentProps) {
	const [deleteReviewComment, { loading }] = useMutation(
		DELETE_REVIEW_COMMENT, {
            onError: (err) => alert(err.message) 
        }
	);

	if (loading) return <p>Deleting comment...</p>;
	return (
		<div>
			<p>
				{props.comment.user.username} - {props.comment.comment}{" "}
				<button
					onClick={() =>
						deleteReviewComment({
							variables: {
								commentId: props.comment.id,
							},
                            update: cache => {
								if(!props.new){
									cache.modify({
										fields: {
											reviewComments(comments, {readField}){
												// updates the cache
											}
										}
									})
								}else if(props.setNewComments){
									props.setNewComments(props.newComments?.filter(comnt => comnt.id !== props.comment.id));
								}
                            }
						})
					}
				>
					Delete
				</button>
			</p>
		</div>
	);
}
