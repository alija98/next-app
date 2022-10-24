import { MongoClient, ObjectId } from 'mongodb';
import { hash, compare } from 'bcryptjs';

import { User } from '../types';

const MONGO_API: string = process.env.MONGODB as string;

export class RegexHelper {
  static email =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}

export const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = compare(password, hashedPassword);
  return isValid;
};

export const connectToDatabase = async () =>
  await MongoClient.connect(MONGO_API);

export const findUser = async (client: MongoClient, email: string) => {
  const database = client.db();
  return await database.collection('users').findOne({
    email: email,
  });
};

export const findUserById = async (client: MongoClient, userID: string) => {
  const database = client.db();
  return await database.collection('users').findOne({
    _id: new ObjectId(userID),
  });
};

export const insertUser = async (client: MongoClient, user: User) => {
  const database = client.db();
  return await database.collection('users').insertOne({
    email: user.email,
    password: user.password,
  });
};

export const getAllProducts = async (client: MongoClient) => {
  const database = client.db();
  return await database
    .collection('products')
    .find()
    .sort({ id: 1 })

    .toArray();
};

export const getSingleProduct = async (client: MongoClient, id: number) => {
  const database = client.db();
  return await database.collection('products').findOne({
    id: id,
  });
};

export const getItemComments = async (client: MongoClient, id: number) => {
  const database = client.db();
  const comments = await database
    .collection('comments')
    .find({ productId: id.toString() })
    .sort({ _id: -1 })
    .toArray();

  let editedComments: any = [];
  for (const comment of comments) {
    const tempUser = await database.collection('users').findOne({
      _id: new ObjectId(comment.userID),
    });
    editedComments = [
      ...editedComments,
      {
        ...comment,
        commentCreator: tempUser?.email,
      },
    ];
  }

  return editedComments;
};

export const updateComment = async (
  client: MongoClient,
  commentID: string,
  content: string
) => {
  const database = client.db();

  return await database.collection('comments').findOneAndUpdate(
    {
      _id: new ObjectId(commentID),
    },
    {
      $set: {
        content: content,
        date: new Date(),
      },
    },
    {
      upsert: false,
    }
  );
};

export const changePassword = async (
  client: MongoClient,
  email: string,
  newPassword: string
) => {
  const database = client.db();
  console.log('email je', email, 'hashed je', newPassword);

  return await database.collection('users').findOneAndUpdate(
    {
      email: email,
    },
    {
      $set: {
        password: newPassword,
      },
    }
  );
};

export const addComment = async (
  client: MongoClient,
  userID: string,
  productID: string,
  content: string
) => {
  const database = client.db();
  return await database.collection('comments').insertOne({
    userID: userID,
    productId: productID.toString(),
    content: content,
    date: new Date(),
  });
};

export const deleteComment = async (client: MongoClient, commentID: string) => {
  const database = client.db();
  return await database.collection('comments').deleteOne({
    _id: new ObjectId(commentID),
  });
};
