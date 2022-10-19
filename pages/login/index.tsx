import React, { useRef, useState, useEffect, CSSProperties } from 'react';
import styles from './Login.module.css';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { setUser } from '../../store/userSlice';
import { useAppDispatch } from '../../store/hooks';
import axios from 'axios';
import FadeLoader from 'react-spinners/FadeLoader';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

const Login: NextPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const registerOrSignIn = async (
    type = 'register' || 'login',
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    const reqBody = {
      email: email || '',
      password: password || '',
    };
    axios
      .post(`api/${type}`, reqBody)
      .then(({ data }) => {
        dispatch(
          setUser({
            isLogged: true,
            name: data.user.email,
            _id: data.user._id,
          })
        );
        setLoading(false);
        router.replace('/products');
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
      });
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
    <div className={styles.container}>
      <form style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ paddingBottom: '5px' }}>Email</label>
        <input
          style={{ padding: '5px', width: '200px' }}
          type={'text'}
          ref={emailRef}
        ></input>
        <label style={{ paddingBottom: '5px' }}>Password</label>
        <input
          style={{ padding: '5px', width: '200px' }}
          type={'text'}
          ref={passwordRef}
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
          onClick={(e) => registerOrSignIn('login', e)}
        >
          <h3 style={{ color: '#fff' }}>Login</h3>
        </button>
        <button
          style={{
            marginTop: '15px',
            width: '70%',
            alignSelf: 'center',
            backgroundColor: '#000',
            border: 'none',
            padding: 8,
          }}
          onClick={(e) => registerOrSignIn('register', e)}
        >
          <h3 style={{ color: '#fff' }}>Register</h3>
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
  );
};

export default Login;
