export interface ProductType {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  comments: string[];
  _id: string | undefined;
}
export interface User {
  email: string;
  password: string;
}

export interface Comment {
  _id: string;
  userID: string;
  content: string;
  commentCreator?: string;
  date: Date;
}
