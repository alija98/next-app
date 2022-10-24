import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { Comment } from '../../types';
import { useAppSelector } from '../../store/hooks';
import axios from 'axios';
import styles from './CommentSection.module.css';

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

  const getCommentTimeDiff = (commentDate: Date) => {
    const daysDiff = dayjs().diff(commentDate, 'd');
    const hoursDiff = dayjs().diff(commentDate, 'h');
    const minutesDiff = dayjs().diff(commentDate, 'm');

    if (daysDiff > 0) {
      return <p className={styles.time}>{daysDiff} day</p>;
    }
    if (hoursDiff > 0) {
      return <p className={styles.time}>{hoursDiff} hour</p>;
    }
    if (minutesDiff > 0) {
      return <p className={styles.time}>{minutesDiff} minute</p>;
    }
    return <p className={styles.time}>{'less than minute'}</p>;
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
                ></div>
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {comment.commentCreator && (
                          <h4>{comment.commentCreator}</h4>
                        )}
                        {getCommentTimeDiff(comment?.date)}
                      </div>
                    </div>

                    <p style={{ paddingTop: '8px' }}>{comment.content}</p>
                  </div>
                  {userID === comment.userID && (
                    <div style={{ display: 'flex' }}>
                      <button
                        style={{
                          padding: '10px',
                          margin: '5px',
                          borderRadius: '5px',
                          border: 'none',
                          width: '80px',
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
                          width: '80px',
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
