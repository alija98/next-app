import React from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser } from '../store/userSlice';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

interface NavbarLayoutProps {
  children: React.ReactNode;
}

const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  const { isLogged } = useAppSelector((state) => state.rootReducer.user);
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(session, status);

  const dispatch = useAppDispatch();

  const signOutHandler = (e: React.FormEvent) => {
    e.preventDefault();
    signOut();
    dispatch(
      setUser({
        isLogged: false,
        name: '',
        _id: '',
        token: null,
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
                  Web Shop
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
                      fontSize: 20,
                    }}
                  >
                    Log Out
                  </h3>
                </a>
              </button>
            ) : (
              <button
                style={{
                  border: 'none',
                  backgroundColor: '#000',
                }}
                onClick={() =>
                  router.pathname === '/login'
                    ? router.push('/')
                    : router.push('/login')
                }
              >
                <a>
                  <h3
                    style={{
                      color: '#fff',
                      paddingRight: '50px',
                      fontSize: '22px',
                    }}
                  >
                    {router.pathname === '/login' ? 'Home' : ' Login'}
                  </h3>
                </a>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </>
  );
};

export default NavbarLayout;
