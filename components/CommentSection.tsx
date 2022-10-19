import React from 'react';

import { Comment } from '../types';
import { useAppSelector } from '../store/hooks';

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection = ({ comments }: CommentSectionProps) => {
  const userID = useAppSelector((state) => state.rootReducer.user._id);

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
        ></input>
        <button
          style={{
            padding: '5px',
            width: '15%',
          }}
        >
          {' '}
          Submit{' '}
        </button>
      </form>
      <div
        style={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
        }}
      >
        {comments?.length > 0 &&
          comments.map((comment: Comment) => {
            return (
              <div
                style={{
                  border: '1px solid black',
                  padding: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                key={comment._id}
              >
                <div>{comment.content}</div>
                {userID === comment.userID && (
                  <div style={{ display: 'flex' }}>
                    <button
                      style={{
                        padding: '10px',
                        margin: '5px',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: '10px',
                        margin: '5px',
                        backgroundColor: 'rgb(219, 20, 83)',
                        border: 'none',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
