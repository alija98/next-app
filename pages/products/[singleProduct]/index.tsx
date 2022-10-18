import React from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Image from 'next/image';
import { ProductType } from '../../../types';
import Link from 'next/link';

const API = 'https://dummyjson.com/products/';

interface SingleProductProps {
  product: ProductType | null;
}

const SingleProduct: NextPage<SingleProductProps> = ({ product }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: '40px',
      }}
    >
      <div style={{ height: '250', width: '250' }} className="hover">
        <Image
          height={250}
          width={250}
          alt="avatar"
          src={product?.images[0] || ''}
        />
      </div>
      <h2 style={{ paddingTop: '15px' }}>{product?.title}</h2>
      <h3 style={{ paddingTop: '15px' }}>Price: ${product?.price}</h3>
      <h3 style={{ paddingTop: '15px' }}>
        Category:{' '}
        <span style={{ textTransform: 'capitalize' }}>{product?.category}</span>
      </h3>
      <p style={{ paddingTop: '15px' }}>{product?.description}</p>
      <Link href={`/products/${product?.id}/black`} passHref>
        <div
          style={{
            padding: '15px',
            marginTop: '10px',
            backgroundColor: 'gray',
            cursor: 'pointer',
          }}
        >
          <p style={{ color: '#fff' }}>Select Black Variant</p>
        </div>
      </Link>
      <Link href={`/products/${product?.id}/white`} passHref>
        <div
          style={{
            padding: '15px',
            marginTop: '10px',
            backgroundColor: 'gray',
            cursor: 'pointer',
          }}
        >
          <p style={{ color: '#fff' }}>Select White Variant</p>
        </div>
      </Link>
    </div>
  );
};

export default SingleProduct;

interface Params extends ParsedUrlQuery {
  singleProduct: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params as Params;
  let product: ProductType | null = null;
  const { singleProduct } = params;
  try {
    const { data } = await axios.get(API + singleProduct);
    product = data;
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      product,
    },
  };
};
