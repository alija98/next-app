import React from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ProductType } from '../../types';

const API = 'https://dummyjson.com/';

interface ProductPropsType {
  products: ProductType[];
}

const Products: NextPage<ProductPropsType> = ({ products }) => {
  const router = useRouter();

  const openProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '80%',
        }}
      >
        {products?.length > 0 &&
          products.map((product: ProductType, index: number) => {
            return (
              <button
                key={index}
                style={{
                  padding: '40px',
                  margin: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '4px 4px 4px 0px rgba(0,0,0,0.5)',
                  borderRadius: '5%',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  width: '300px',
                  border: '2px solid black',
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
  let parsedProducts = [];
  try {
    const {
      data: { products },
    } = await axios.get(API + 'products');
    parsedProducts = products;
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      products: parsedProducts,
    },
  };
}

export default Products;
