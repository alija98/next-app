import React, { useState, useEffect } from 'react';

import { Comment } from '../types';
import { useAppSelector } from '../store/hooks';
import axios from 'axios';

interface CommentSectionProps {
  comments: Comment[];
  productMongoID: string | undefined;
  productCustomID: number | undefined;
}

const CommentSection = ({
  comments,
  productMongoID,
  productCustomID,
}: CommentSectionProps) => {
  const [commentsState, setCommentsState] = useState<Comment[]>(comments);
  const [commentInput, setCommentInput] = useState('');
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [error, setError] = useState('');

  const userID = useAppSelector((state) => state.rootReducer.user._id);
  console.log(comments);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComment) {
      try {
        await axios
          .put('http://localhost:3000/api/comments', {
            comment: commentInput,
            productMongoID,
            productCustomID,
            userID: userID,
            commentID: selectedComment,
          })
          .then((res) => setCommentsState(res.data.comments));
      } catch (error) {
        console.log('Comm error');
      }
    } else {
      try {
        await axios
          .post('http://localhost:3000/api/comments', {
            comment: commentInput,
            productMongoID,
            productCustomID,
            userID: userID,
          })
          .then((res) => setCommentsState(res.data.comments));
      } catch (error: any) {
        error.response.status === 401 &&
          setError('You need to log in to comment');
      }
    }
    setSelectedComment(null);
    setCommentInput('');
  };

  const deleteComment = async (e: React.FormEvent, commentID: string) => {
    e.preventDefault();
    try {
      await axios.delete('http://localhost:3000/api/comments', {
        data: {
          commentID: commentID,
          userID: userID,
        },
      });
      const temp = commentsState.filter(
        (comment: Comment) => comment._id !== commentID
      );
      setCommentsState(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error.length > 0) {
      let timer = setTimeout(() => setError(''), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [error]);

  return (
    <div style={{ padding: '5%' }}>
      <h2 style={{ padding: '10px' }}>Comments</h2>
      <form
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <input
          style={{
            width: '80%',
            padding: '5px',
            margin: '5px',
            border: 'none',
            borderBottom: '1px solid black',
          }}
          placeholder="Insert your comment"
          type={'text'}
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        ></input>
        <button
          style={{
            padding: '5px',
            width: '15%',
          }}
          onClick={(e) => handleComment(e)}
        >
          {selectedComment ? 'Edit' : 'Submit'}
        </button>
      </form>
      <p
        style={{
          color: 'red',
          fontSize: 12,
        }}
      >
        {error}
      </p>
      <div
        style={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
        }}
      >
        {commentsState?.length > 0 &&
          commentsState.map((comment: Comment) => {
            return (
              <div key={comment._id}>
                <div
                  style={{
                    display: 'flex',
                    paddingLeft: '7px',
                    marginTop: '15px',
                  }}
                >
                  <p style={{ fontSize: '14px', paddingRight: '5px' }}>
                    {new Date(comment.date).toLocaleDateString('eu')}
                  </p>
                  <p style={{ fontSize: '14px' }}>
                    {new Date(comment.date).toLocaleTimeString('eu', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div
                  style={{
                    border: '1px solid ',
                    borderColor:
                      selectedComment === comment._id ? 'blue' : 'black',
                    borderWidth:
                      selectedComment === comment._id ? '2px' : '1px',
                    padding: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <div>
                        {comment.commentCreator && (
                          <h4>{comment.commentCreator}</h4>
                        )}
                      </div>
                    </div>

                    {comment.content}
                  </div>
                  {userID === comment.userID && (
                    <div style={{ display: 'flex' }}>
                      <button
                        style={{
                          padding: '10px',
                          margin: '5px',
                          borderRadius: '5px',
                        }}
                        onClick={() => {
                          selectedComment
                            ? setCommentInput('')
                            : setCommentInput(comment.content);
                          selectedComment
                            ? setSelectedComment(null)
                            : setSelectedComment(comment._id);
                        }}
                      >
                        {selectedComment ? 'Cancel' : 'Edit'}
                      </button>
                      <button
                        style={{
                          padding: '10px',
                          margin: '5px',
                          backgroundColor: 'rgb(219, 20, 83)',
                          border: 'none',
                          borderRadius: '5px',
                        }}
                        onClick={(e) => deleteComment(e, comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
