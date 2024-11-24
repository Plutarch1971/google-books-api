import jwt from 'jsonwebtoken';
import { Request } from 'express';


const secret = process.env.JWT_SECRET || 'mysecretsshh';
const expiration = '2h';

export const authMiddleware = async (req: Request) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    const { data } = jwt.verify(token, secret) as any;
    return data;
  } catch {
    console.error('Invalid token');
    return null;
  }
};

export const signToken = ({ _id, username, email } : { _id: string, username: string, email: string}) => {
  const payload = { _id, username, email };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};


