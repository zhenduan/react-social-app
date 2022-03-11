import React, { useEffect, useState } from "react";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { Avatar, Button, TextField } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EditIcon from "@material-ui/icons/Edit";
import firebase from "firebase/app";

import { db } from "../firebase";
function Post({ post, username, userId, authorId }) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [editCommentInput, setEditCommentInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAuther, setIsAuther] = useState(false);
  const [editCommentId, setEditCommentId] = useState("");

  useEffect(() => {
    db.collection("posts")
      .doc(post.id)
      .collection("comments")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            comment: doc.data().comment,
            uid: doc.data().uid,
          }))
        );
      });
  }, [post.id, username]);

  const handleSubmit = () => {
    if (commentInput.trim().length > 0) {
      db.collection("posts").doc(post.id).collection("comments").add({
        username: username,
        comment: commentInput,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: userId,
      });
      setCommentInput("");
    } else {
      alert("please input something.");
    }
  };

  // edit comment
  const handleEditComment = (commentId) => {
    console.log(123);
    setIsEditing(true);
    comments.map((comment) => {
      if (userId === comment.uid) {
        var editComment = comments.find((comment) => comment.id === commentId);
        console.log(editComment);
        setEditCommentInput(editComment.comment);
        setEditCommentId(commentId);
      }
    });
  };

  const handleSaveEditComment = (commentId) => {
    comments.map((comment) => {
      db.collection("posts")
        .doc(post.id)
        .collection("comments")
        .doc(commentId)
        .set(
          {
            comment: editCommentInput,
          },
          { merge: true }
        );
    });
    setEditCommentInput("");
    setIsEditing(false);
  };

  const handleDeletePost = () => {
    db.collection("posts").doc(post.id).delete();
  };
  return (
    <>
      <div className="post__container">
        <div className="post__header">
          <div className="post__postHeaderLeft">
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://img.favpng.com/25/13/19/samsung-galaxy-a8-a8-user-login-telephone-avatar-png-favpng-dqKEPfX7hPbc6SMVUCteANKwj.jpg"
              />
            </ListItemAvatar>
            <p>{post.username}</p>
          </div>
          <div className="post__postHeaderRight"></div>
          {authorId === userId && (
            <DeleteForeverOutlinedIcon
              className="post__deletePostIcon"
              onClick={handleDeletePost}
            />
          )}
        </div>
        <div className="post__imageContainer">
          <img src={post.imageUrl} alt="" />
        </div>
        <div className="post__caption">
          <p>
            <strong>{post.username} </strong>
            {post.caption}
          </p>
        </div>
        {!isEditing && (
          <div className="post__commentInputContainer">
            <TextField
              label="Leave a comment"
              onChange={(e) => setCommentInput(e.target.value)}
              value={commentInput}
            />

            <Button
              color="primary"
              // disabled={commentInput.trim().length == 0}
              className="post__leaveCommentBtn"
              onClick={handleSubmit}
            >
              Comment
            </Button>
          </div>
        )}

        <div className="post__editCommentInputContainer">
          {isEditing && (
            <div className="post__editCommentInputRow">
              <TextField
                className="post__editCommentInput"
                label="Edit Comment"
                variant="outlined"
                onChange={(e) => setEditCommentInput(e.target.value)}
                value={editCommentInput}
              />
              <div className="post__editCommentIconRow">
                <CheckBoxOutlinedIcon
                  className="post__saveEditIcon"
                  onClick={() => handleSaveEditComment(editCommentId)}
                />
                <ClearIcon
                  className="post__cancelEditIcon"
                  onClick={() => setIsEditing(false)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="post__commentsListContainer">
          {comments.map((comment) => {
            return (
              <div key={comment.id} class="post__singleCommentContainer">
                <div className="post__singleCommentDetailContainer">
                  <p>
                    <span class="post__commentUserName">
                      {comment.username}
                    </span>{" "}
                    : {comment.comment}
                  </p>
                  {userId === comment.uid && (
                    <div>
                      <DeleteForeverIcon
                        className="post__deleteIcon"
                        onClick={() => {
                          db.collection("posts")
                            .doc(post.id)
                            .collection("comments")
                            .doc(comment.id)
                            .delete();
                        }}
                      />

                      <EditIcon
                        className="post__editIcon"
                        onClick={() => handleEditComment(comment.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Post;
