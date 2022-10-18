import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Variant = () => {
  const router = useRouter();
  const { variant } = router.query;

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{ paddingBottom: '40px', textTransform: 'capitalize' }}>
          {variant} Variant
        </h1>
        <Image height={350} width={350} alt="avatar" src={'/money.gif'} />
      </div>
    </div>
  );
};

export default Variant;
