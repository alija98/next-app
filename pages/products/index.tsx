import React from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { ProductType } from '@/types/index';

interface ProductPropsType {
  products: ProductType[];
}

const Products: NextPage<ProductPropsType> = ({ products }) => {
  const router = useRouter();

  const openProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        marginTop: '100px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '80%',
          gap: '30px',
          marginBottom: '20px',
        }}
      >
        {products?.length > 0 &&
          products.map((product: ProductType, index: number) => {
            return (
              <button
                key={index}
                style={{
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '5px 5px 5px 1px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  width: '300px',
                  borderTopRightRadius: '1rem',
                  borderBottomLeftRadius: '1rem',
                }}
                onClick={() => openProduct(product.id)}
              >
                <h2>{product.title}</h2>
                <div
                  style={{
                    height: '140px',
                    width: '180px',
                    marginTop: '20px',
                  }}
                  className="hover"
                >
                  <Image
                    height={150}
                    width={150}
                    alt="avatar"
                    src={product.images[0]}
                    objectFit="contain"
                  />
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const getProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/products');
      return data.products;
    } catch (error) {
      console.log('error');
      return [];
    }
  };

  return {
    props: {
      products: await getProducts(),
    },
  };
}

export default Products;
