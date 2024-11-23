import jwt from 'jsonwebtoken';
import { Request } from 'express';

// const token;
// const user

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

export const signToken = ({ _id, username, email }) => {
  const payload = { _id, username, email };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

/*
const authMiddleware = ({ req }) => {
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
  
    if (!token) {
      return req;
    }
  
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
  
    return req;
  };
