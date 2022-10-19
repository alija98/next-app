import type { NextApiRequest, NextApiResponse } from 'next';
import {
  connectToDatabase,
  getSingleProduct,
  getItemComments,
  findUserById,
} from '../../../../utils';
import { Comment } from '../../../../types';
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
      comments: any[] = [],
      parsedComments;
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

    // try {
    //   const test = await findUserById(client, comments[0].userID);
    //   console.log('USER BY ID je', test);
    // } catch (error) {
    //   res.status(500).json({ message: 'Database problem' });
    // }

    /*

  for (const comment of comments) {
    console.log('COMM JE', comment);

    const tempUser = await database.collection('users').findOne({
      // _id: `ObjectId('${comment.userID}')`,
      _id: "ObjectId('634e877fb5d99229599ac7da')",
    });
    console.log('user', tempUser);
  }

    */

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
