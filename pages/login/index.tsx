import React, { useRef, useState, useEffect, CSSProperties } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import FadeLoader from 'react-spinners/FadeLoader';
import { getSession, signIn } from 'next-auth/react';

import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/userSlice';
import styles from './Login.module.css';

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

    if (type === 'login') {
      await signIn('credentials', {
        email: email,
        password: password,
      }).then((data) => {
        setLoading(false);
        if (data?.error) {
          setError('Your email or password are not valid');
          return;
        }
        axios
          .post('api/auth/login', reqBody)
          .then(({ data }) => {
            dispatch(
              setUser({
                name: data.user.email,
                _id: data.user._id,
              })
            );
          })
          .catch((error) => {
            console.log(error);
            setError(error.response.data.message);
          });
        setLoading(false);
        router.back();
      });
    } else {
      axios
        .post('api/auth/register', reqBody)
        .then(({ data }) => {
          dispatch(
            setUser({
              name: data.user.email,
              _id: data.user._id,
            })
          );
          signIn('credentials', {
            email: email,
            password: password,
          }).then(() => {
            setLoading(false);
          });
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.message);
          setLoading(false);
        });
    }
  };

  const signInWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    signIn('google', {});
  };

  useEffect(() => {
    if (error?.length > 0) {
      let timer = setTimeout(() => setError(''), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [error]);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/');
      }
    });
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ paddingBottom: '1px', paddingLeft: '3px' }}>
            Email
          </label>
          <input
            style={{ padding: '5px', marginBottom: '10px', width: '300px' }}
            type={'text'}
            ref={emailRef}
          ></input>
          <label style={{ paddingBottom: '1px', paddingLeft: '3px' }}>
            Password
          </label>
          <input
            style={{ padding: '5px', width: '300px' }}
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
      <p>or</p>
      <div onClick={(e) => signInWithGoogle(e)} className={styles.google_btn}>
        <div className={styles.google_icon_wrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="google"
            className={styles.google_icon}
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          />
        </div>
        <p className={styles.btn_text}>
          <b>Sign in with Google</b>
        </p>
      </div>
    </div>
  );
};

export default Login;
