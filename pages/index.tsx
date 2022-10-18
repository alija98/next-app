import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <div
        style={{
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 style={{ textAlign: 'center', paddingBottom: '5px' }}>
            This is Home Screen{' '}
          </h2>
          <>
            <h3 style={{ textAlign: 'center' }}> See list of all products ↓</h3>
            <Link href={'/products'}>
              <button style={{ padding: '10px', marginTop: '10px' }}>
                <h4>Press Here </h4>
              </button>
            </Link>
          </>
        </div>
      </div>
    </div>
  );
};

export default Home;
