import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  data: {
    _id: string;
    username: string;
    email: string;
  };
}

 const getToken = () => {
  return localStorage.getItem('id_token');
};

 const loggedIn = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

 const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

 const login = (token: string) => {
  localStorage.setItem('id_token', token);
};

 const logout = () => {
  localStorage.removeItem('id_token');
  window.location.assign('/');
};

export const getProfile = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};
// import jwt from 'jsonwebtoken';
// import { jwtDecode } from 'jwt-decode';
// import { Request } from 'express';

// //Server side secret and expiration
// const secret = process.env.JWT_SECRET || 'mysecretsshh';
// const expiration = '2h';

// //Server side function to authenticate token
//  const authMiddleware = async (req: Request) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return null;

//   try {
//     const { data } = jwt.verify(token, secret) as any;
//     return data;
//   } catch {
//     console.error('Invalid token');
//     return null;
//   }
// };

//  const signToken = ({ _id, username, email } : { _id: string, username: string, email: string}) => {
//   const payload = { _id, username, email };
//   return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
// };

// const loggedIn = () => {
//   const token = localStorage.getItem('id_token');
//   return !!token && !isTokenExpired(token);
// }

// const isTokenExpired = (token: string) => {
//   try {
//     const decoded: any = jwt.decode(token);
//     if (decoded.exp < Date.now() / 1000) {
//       return true;
//     } else return false;
//   } catch {
//     return false;
//   }
// };

// const login = (token: string) => {
//   localStorage.setItem('id_token', token);
// };

const Auth = {
  //signToken,
  //authMiddleware,
  loggedIn,
  login,
  logout,
  getProfile,
  isTokenExpired,
  getToken
  
};

export default Auth;


