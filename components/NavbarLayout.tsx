import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/userSlice';
import { useRouter } from 'next/router';
import { signOut, getSession } from 'next-auth/react';

interface NavbarLayoutProps {
  children: React.ReactNode;
}

const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  const dispatch = useAppDispatch();

  const signOutHandler = (e: React.FormEvent) => {
    e.preventDefault();
    signOut();
    dispatch(
      setUser({
        name: '',
        _id: '',
      })
    );
    router.replace('/');
  };

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setIsLogged(true);
      }
    });
  }, [router]);

  return (
    <>
      <nav>
        <div
          style={{
            position: 'fixed',
            width: '100%',
            left: 0,
            top: 0,
            backgroundColor: '#000',
            padding: '25px',
            paddingRight: '35px',
            paddingLeft: '35px',
            display: 'flex',
            justifyContent: 'space-evenly',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-start',
            }}
          >
            <Link href={'/profile'}>
              <a>
                {isLogged && (
                  <h3 style={{ color: '#fff', fontSize: '22px' }}>Profile</h3>
                )}
              </a>
            </Link>
          </div>
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
                <h3
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: '22px',
                  }}
                >
                  Web Shop
                </h3>
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
                      fontSize: 22,
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
