//npm install @apollo/client graphql
// ? in which directory we must run this command
import './App.css';
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import SearchBooks from './components/SearchBooks';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('token') || '',
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <SearchBooks />
    </ApolloProvider>
  );
}

export default App