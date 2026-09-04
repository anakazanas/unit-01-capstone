export type User = {
  _id: string;
  email: string;
};

export type Recipe = {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  tags: string[];
  image?: string;
  ownerId: string;
  createdAt?: string;
};