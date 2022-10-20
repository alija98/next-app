import { MongoClient, ObjectId } from 'mongodb';
import { User } from '../types';

const MONGO_API: string = process.env.MONGODB as string;

export class RegexHelper {
  static email =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}

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
  await database.collection('users').insertOne({
    email: user.email,
    password: user.password,
  });
};

export const getAllProducts = async (client: MongoClient) => {
  const database = client.db();
  return await database.collection('products').find().toArray();
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
