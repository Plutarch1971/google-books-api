import express from 'express';
import db from './config/connection.js';
import path from 'node:path';

//Import ApolloServer and expressMiddleware
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';

// Import the authenticateToken function
//import { authenticateToken } from './services/auth.js';
// import { json } from 'body-parser';


const server = new ApolloServer({
  typeDefs, resolvers
});
// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {

  await server.start(); // Start Apollo Server
  await db; // Connect to MongoDB

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Call the async function to start the server
startApolloServer();













