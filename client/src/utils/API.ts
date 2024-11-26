// import { gql } from '@apollo/client';
// import client from './apolloClient';
// import type { Book } from '../models/Book';

// // Query to get logged in user's data
// const GET_ME = gql`
//   query me {
//     me {
//       _id
//       username
//       email
//       bookCount
//       savedBooks {
//         bookId
//         authors
//         description
//         title
//         image
//         link
//       }
//     }
//   }
// `;

// // Mutation for saving a book
// const SAVE_BOOK = gql`
//   mutation saveBook($input: BookInput!) {
//     saveBook(input: $input) {
//       _id
//       username
//       email
//       bookCount
//       savedBooks {
//         bookId
//         authors
//         description
//         title
//         image
//         link
//       }
//     }
//   }
// `;

// // Mutation for removing a book
// const REMOVE_BOOK = gql`
//   mutation removeBook($bookId: String!) {
//     removeBook(bookId: $bookId) {
//       _id
//       username
//       email
//       bookCount
//       savedBooks {
//         bookId
//         authors
//         description
//         title
//         image
//         link
//       }
//     }
//   }
// `;

// class GraphQLService {
//   // Get logged in user's data
//   async getMe() {
//     try {
//       const { data } = await client.query({
//         query: GET_ME,
//         fetchPolicy: 'network-only' // Don't use cache for this query
//       });
//       return data.me;
//     } catch (error) {
//       throw new Error('Failed to fetch user data');
//     }
//   }

//   // Save a book
//   async saveBook(bookData: Book) {
//     try {
//       const { data } = await client.mutate({
//         mutation: SAVE_BOOK,
//         variables: { input: bookData },
//         update: (cache) => {
//           // Remove cached book data to ensure fresh data on next query
//           cache.evict({ fieldName: 'me' });
//         }
//       });
//       return data.saveBook;
//     } catch (error) {
//       throw new Error('Failed to save book');
//     }
//   }

//   // Remove a book
//   async removeBook(bookId: string) {
//     try {
//       const { data } = await client.mutate({
//         mutation: REMOVE_BOOK,
//         variables: { bookId },
//         update: (cache) => {
//           // Remove cached book data to ensure fresh data on next query
//           cache.evict({ fieldName: 'me' });
//         }
//       });
//       return data.removeBook;
//     } catch (error) {
//       throw new Error('Failed to remove book');
//     }
//   }

//   // Search Google Books API (keeping this as REST since it's an external API)
//   async searchGoogleBooks(query: string) {
//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
//       );
//       if (!response.ok) {
//         throw new Error('Failed to search books');
//       }
//       return response.json();
//     } catch (error) {
//       throw new Error('Failed to search books');
//     }
//   }
// }

// export default new GraphQLService();
// // import type { User } from '../models/User.js';
// // import type { Book } from '../models/Book.js';

// // // route to get logged in user's info (needs the token)
// // export const getMe = (token: string) => {
// //   return fetch('/api/users/me', {
// //     headers: {
// //       'Content-Type': 'application/json',
// //       authorization: `Bearer ${token}`,
// //     },
// //   });
// // };

// // export const createUser = (userData: User) => {
// //   return fetch('/api/users', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify(userData),
// //   });
// // };

// // export const loginUser = (userData: User) => {
// //   return fetch('/api/users/login', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify(userData),
// //   });
// // };

// // // save book data for a logged in user
// // export const saveBook = (bookData: Book, token: string) => {
// //   return fetch('/api/users', {
// //     method: 'PUT',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       authorization: `Bearer ${token}`,
// //     },
// //     body: JSON.stringify(bookData),
// //   });
// // };

// // // remove saved book data for a logged in user
// // export const deleteBook = (bookId: string, token: string) => {
// //   return fetch(`/api/users/books/${bookId}`, {
// //     method: 'DELETE',
// //     headers: {
// //       authorization: `Bearer ${token}`,
// //     },
// //   });
// // };

// // // make a search to google books api
// // // https://www.googleapis.com/books/v1/volumes?q=harry+potter
// // export const searchGoogleBooks = (query: string) => {
// //   return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
// // };
