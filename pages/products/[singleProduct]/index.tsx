import React from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Image from 'next/image';
import { ProductType } from '../../../types';
import Link from 'next/link';
import { Comment } from '../../../types/index';
import CommentSection from '../../../components/commentSection/CommentSection';

interface SingleProductProps {
  product: ProductType | null;
  comments: Comment[];
}
const SingleProduct: NextPage<SingleProductProps> = ({ product, comments }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '40px',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <div style={{ height: '300', width: '300' }}>
            <Image
              height={400}
              width={400}
              alt="avatar"
              src={product?.images[0] || ''}
              objectFit={'contain'}
            />
          </div>
          <div
            style={{
              flex: 1,
              marginLeft: '20px',
            }}
          >
            <h2 style={{ paddingTop: '15px' }}>{product?.title}</h2>
            <h3 style={{ paddingTop: '15px' }}>Price: ${product?.price}</h3>
            <h3 style={{ paddingTop: '15px' }}>
              Category:{' '}
              <span style={{ textTransform: 'capitalize' }}>
                {product?.category}
              </span>
            </h3>
            <p style={{ paddingTop: '15px' }}>{product?.description}</p>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: '30px' }}>
          <Link href={`/products/${product?.id}/black`} passHref>
            <div
              style={{
                padding: '15px',
                marginTop: '10px',
                backgroundColor: 'gray',
                cursor: 'pointer',
                width: '60%',
                marginRight: '10px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
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
                width: '60%',
                marginLeft: '10px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <p style={{ color: '#fff' }}>Select White Variant</p>
            </div>
          </Link>
        </div>
      </div>
      <CommentSection
        comments={comments}
        productMongoID={product?._id}
        productCustomID={product?.id}
      />
    </>
  );
};

export default SingleProduct;

interface Params extends ParsedUrlQuery {
  singleProduct: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params as Params;
  const { singleProduct } = params;

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/products/${singleProduct}`
      );
      return data;
    } catch (error) {
      console.log('error je', error);
      return {};
    }
  };
  const data = await getProduct();

  return {
    props: {
      product: data.product,
      comments: data.comments,
    },
  };
};
