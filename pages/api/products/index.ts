import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, getAllProducts } from '../../../utils';

async function products(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let client, products;
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Connecting to database failed' });
      return;
    }

    try {
      products = await getAllProducts(client);
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
    }
    res.status(200).json({
      message: 'List of products',
      products: products,
    });
    client.close();
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default products;
