import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

// class ServerAuthServices {
//   // Get the user data from the token
//   static getProfile(token: string) {
//     return jwt.decode(token);
//   }

//   // Check if the token is expired
//   static isTokenExpired(token: string) {
//     try {
//       const decoded: any = jwt.decode(token);

//       if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
//         return true;
//       }
//       return false;
//     } catch (err) {
//       return false;
//     }
//   }

//   // Get the token from the local storage
//   static getToken() {
//     const loggedUser = localStorage.getItem('id_token') || '';
//     return loggedUser;
//   }

//   // Check if the user is logged in
//   static loggedIn() {
//     const token = this.getToken();
//     return !!token && !this.isTokenExpired(token);
//   }

//   // Log the user in
//   static login(idToken: string) {
//     localStorage.setItem('id_token', idToken);
//     //window.location.assign('/');
//   }

//   // Log the user out
//   static logout() {
//     localStorage.removeItem('id_token');
//     //window.location.assign('/');
//   }
// }
// export const authenticateToken = async ({ req }: any) => {
//   // Get the token from the request
//   const token = req.headers.authorization?.split(' ')[1] || '';

//   // If no token is provided, return the request object as is
//   if (!token) {
//     console.log('No token provided');
//     return {user: null};
//   }

//   // Try to verify the token
//   try {
//     // Check if JWt_SECRET_KEY is defined
//     if (!process.env.JWT_SECRET_KEY) {
//       throw new Error('JWT_SECRET_KEY is not defined');
//     }
//     const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
//     console.log('Data from token:', data);

//     // Verify the user data from the token
//     if(!data._id) {
//       throw new Error('Invalid token data: _id is missing');
//     }
//     const user = await User.findById(data._id);
//     if (!user) {
//       throw new Error('Invalid token data: user not found');
//       return { user: null };
//     }
    
//     // // If the token is valid, attach the user data to the request object
//     req.user = data;
//     console.log('User Authenticated:', req.user);
//     return { user };

//   } catch (error) {
//     // If the token is invalid, log an error message
//     console.error('Token verification failed', error);
//     if(error instanceof jwt.TokenExpiredError) {
//       console.log('Invalid token: Token expired');
//     }
//     return { user: null };
//   }

// };
export const authenticateToken = async ({ req }: any) => {
  // Get the token from the request
  //const token = req.headers.authorization?.split(' ')[1] || '';
  let token = req.body.token || req.query.token || req.header.authorization
  console.log(token);
  if( req.header.authorization){
    token = token.split(' ').pop().trim();
  }
  
  // If no token is provided, return an object with null user
  if (!token) {
    console.log('No token provided');
    return { user: null };
  }

  try {
    // Verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY || 'Test', { maxAge: '2h' });
    
    // Ensure decoded data exists
    if (!decoded?.data) {
      console.log('Invalid token structure');
      return { user: null };
    }

    // Find the user
    const user = await User.findById(decoded.data._id);
    req.user = decoded.data;
    if (!user) {
      console.log('No user found for the token');
      return { user: null };
    }

    // Return user data
    return req;

  } catch (error) {
    console.error('Authentication error:', error);
    
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid token');
    }

    return { user: null };
  }
};
export const signToken = (username: string, email: string, _id: unknown) => {
  // Create a payload with the user information
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY || 'Test'; // Get the secret key from environment variables

  // Sign the token with the payload and secret key, and set it to expire in 2 hours
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: { code: 'UNAUTHENTICATED' }
    });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};

// export default ServerAuthServices;