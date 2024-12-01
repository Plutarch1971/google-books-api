import { Outlet } from 'react-router-dom';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import  AppNavbar  from './components/Navbar';


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
      <AppNavbar/>
     <Outlet />
    </ApolloProvider>
  );
}

export default App