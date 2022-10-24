import React, { useRef, useState, useEffect, CSSProperties } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { FadeLoader } from 'react-spinners';
import axios from 'axios';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

interface Session {
  expires: string;
  user: {
    email: string;
    name: string;
  };
}

const Profile = (session: Session) => {
  //   const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     getSession().then((session) => {
  //       if (!session) {
  //         window.location.href = '/login';
  //       } else {
  //         setLoading(false);
  //       }
  //     });
  //   }, []);

  //   if (loading) {
  //     return (
  //       <h2
  //         style={{
  //           paddingTop: '40px',
  //         }}
  //       >
  //         Loading...
  //       </h2>
  //     );
  //   }

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const oldPasswordRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);
  const user = session?.user?.email;

  console.log(session);

  const changePasswordHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(true);

    const body = {
      oldPassword: oldPasswordRef.current?.value,
      newPassword: newPasswordRef.current?.value,
    };

    axios
      .put('api/auth/change-password', {
        body,
      })
      .then(() => {
        setSuccess(true);
        newPasswordRef.current!.value = '';
        oldPasswordRef.current!.value = '';
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
    setLoading(false);
  };

  useEffect(() => {
    if (error?.length > 0) {
      let timer = setTimeout(() => setError(''), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (success) {
      let timer = setTimeout(() => setSuccess(false), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [error, success]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          paddingTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h3>Welcome back {user}</h3>
        <p style={{ paddingTop: '8px' }}>Change your password</p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '2rem',
        }}
      >
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ paddingBottom: '5px' }}>Old Password</label>
          <input
            style={{ padding: '5px', width: '200px' }}
            type={'text'}
            ref={oldPasswordRef}
          ></input>
          <label style={{ paddingBottom: '5px' }}>New Password</label>
          <input
            style={{ padding: '5px', width: '200px' }}
            type={'text'}
            ref={newPasswordRef}
          ></input>
          {error?.length > 0 && (
            <label style={{ color: 'red', fontSize: 12 }}>{error}</label>
          )}
          <button
            style={{
              marginTop: '30px',
              width: '70%',
              alignSelf: 'center',
              backgroundColor: '#000',
              border: 'none',
              padding: 8,
            }}
            onClick={(e) => changePasswordHandler(e)}
          >
            <h3 style={{ color: '#fff' }}>Change Password</h3>
          </button>

          <FadeLoader
            color={'green'}
            loading={loading}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </form>
      </div>
      {success && (
        <h4
          style={{
            paddingTop: '20px',
            color: 'green',
          }}
        >
          Successfully changed password!
        </h4>
      )}
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
