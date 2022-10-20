import React from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser } from '../store/userSlice';
import router from 'next/router';

interface NavbarLayoutProps {
  children: React.ReactNode;
}

const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  const { isLogged } = useAppSelector((state) => state.rootReducer.user);

  const dispatch = useAppDispatch();

  const signOutHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      setUser({
        isLogged: false,
        name: '',
        _id: '',
      })
    );
    router.replace('/');
  };

  return (
    <>
      <nav>
        <div
          style={{
            width: '100%',
            left: 0,
            top: 0,
            backgroundColor: '#000',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-evenly',
            margin: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }}
          ></div>
          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Link href={'/'}>
              <a>
                <h1
                  style={{
                    color: '#fff',
                    paddingRight: '50px',
                    textAlign: 'center',
                    paddingLeft: '25px',
                  }}
                >
                  App Name
                </h1>
              </a>
            </Link>
          </div>

          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            {isLogged ? (
              <button
                style={{ backgroundColor: '#000', border: 'none' }}
                onClick={signOutHandler}
              >
                <a>
                  <h3
                    style={{
                      color: '#fff',
                      paddingRight: '50px',
                      fontSize: 22,
                    }}
                  >
                    Log Out
                  </h3>
                </a>
              </button>
            ) : (
              <Link href={'/login'}>
                <a>
                  <h3 style={{ color: '#fff', paddingRight: '50px' }}>
                    Log In
                  </h3>
                </a>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </>
  );
};

export default NavbarLayout;
