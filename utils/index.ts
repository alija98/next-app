import { MongoClient, ObjectId } from 'mongodb';
import { User } from '../types';

// const MONGO_API =
//   'mongodb+srv://alija:alija123@atlascluster.of5ulpc.mongodb.net/nextjsProducts?retryWrites=true&w=majority';
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
/*
{"_id":{"$oid":"634e877fb5d99229599ac7da"},"email":"alija@gmail.com","password":"test123"}
*/

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
    .toArray();
  return comments;
};
