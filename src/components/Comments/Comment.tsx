import React, { useEffect, useState } from "react";
import {
	DELETE_REVIEW_COMMENT,
	UPDATE_REVIEW_COMMENT,
} from "../../GraphQL/Mutations";
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

interface CommentProps {
	comment: ReviewComment;
	new?: boolean;
	newComments?: Array<ReviewComment>;
	setNewComments?: Function;
}

export default function Comment(props: CommentProps) {
	const [showUpdate, setShowUpdate] = useState<Boolean>(false);
	const [cmnt, setCmnt] = useState<string>(props.comment.comment);

	const [deleteReviewComment, { loading: deletingComment }] = useMutation(
		DELETE_REVIEW_COMMENT,
		{
			onError: (err) => alert(err.message),
		}
	);

	const [updateComment, {data: updatedCommentData, loading: updatingComment}] = useMutation(UPDATE_REVIEW_COMMENT, {
		onError: (err) => alert(err.message)
	});
	
	useEffect(() => {
		let mounted = true;
		if(updatedCommentData && mounted){
			setShowUpdate(false);
		}
		return () => {
			mounted = false;
		}
	}, [updatedCommentData]);
	
	const handleUpdateComment = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if(cmnt && cmnt !== props.comment.comment){
			updateComment({
				variables: {
					comment_id: props.comment.id,
					comment: cmnt
				}, 
				update: cache => {
					cache.modify({
						fields: {
							reviewComments(cmts, {readField}) {}
						}
					})
				}
			})
		}
	}

	if (showUpdate) {
		if(updatingComment) return <p>Updating Comment...</p>
		return (
			<form onSubmit={handleUpdateComment}>
				<textarea
					name="update_comment"
					value={cmnt}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
						setCmnt(e.target.value)
					}
				/>
				<button type="submit">Update</button>
				<button type="button" onClick={() => setShowUpdate(false)}>Discard</button>
			</form>
		);
	}
	if (deletingComment) return <p>Deleting comment...</p>;
	return (
		<div>
			<p>
				{props.comment.user.username} - {props.comment.comment}{" "}
				<button onClick={() => setShowUpdate(true)}>update</button>
				<button
					onClick={() =>
						deleteReviewComment({
							variables: {
								commentId: props.comment.id,
							},
							update: (cache) => {
								if (!props.new) {
									cache.modify({
										fields: {
											reviewComments(comments, { readField }) {
												// updates the cache
											},
										},
									});
								} else if (props.setNewComments) {
									props.setNewComments(
										props.newComments?.filter(
											(comnt) => comnt.id !== props.comment.id
										)
									);
								}
							},
						})
					}
				>
					Delete
				</button>
			</p>
		</div>
	);
}
