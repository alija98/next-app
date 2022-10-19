import type { NextApiRequest, NextApiResponse } from 'next';
import {
  connectToDatabase,
  getSingleProduct,
  getItemComments,
} from '../../../../utils';
import { MongoClient } from 'mongodb';

async function products(req: NextApiRequest, res: NextApiResponse) {
  const { productid } = req.query;
  let ID: number = 0;
  if (productid && !Array.isArray(productid)) {
    ID = parseInt(productid);
  }

  if (req.method === 'GET') {
    let client: MongoClient,
      product,
      comments: any[] = [];
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Connecting to database failed' });
      return;
    }

    try {
      product = await getSingleProduct(client, ID);
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
    }

    try {
      comments = await getItemComments(client, ID);
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
    }

    res.status(200).json({
      message: 'Product details',
      product: product,
      comments: comments,
    });
    client.close();
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default products;
