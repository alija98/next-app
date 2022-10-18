import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const ErrorPage = () => {
  const router = useRouter();
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '200px',
          alignItems: 'center',
        }}
      >
        <h1>This page does not exists</h1>

        <div style={{ marginTop: '15px' }}>
          <Image height={200} width={200} alt="avatar" src={'/sad.gif'} />
        </div>

        <button
          onClick={() => router.back()}
          style={{ width: '40%', padding: '10px', marginTop: '20px' }}
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
