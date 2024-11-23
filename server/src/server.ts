import express from 'express';
import { ApolloServer } from '@apollo/server-express';
import { typeDefs, resolvers } from './schemas';
import connectDB from './config/connection';
//import { expressMiddleware } from '@apollo/server-express';
// import { json } from 'body-parser';
// import cors from 'cors';
import { typeDefs} from './schemas/typeDefs';
import { resolvers } from './schemas/resolvers';
import  authMiddleware  from '../../client/src/utils/auth';


const app = express();

// Connect to MongoDB
connectDB();

const server = new ApolloServer({typeDefs, resolvers});

// Start Apollo Server
await server.start();

app.use('/graphql', 
  expressMiddleware(server, {
  context: authMiddleware
}));

const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🌍 Server running on port :${PORT}`));

