import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Book } from '../models/Book';


const SavedBooks = () => {
  const { data, loading ,error} = useQuery(GET_ME); // Fetch user data
  console.log(data);
  const [removeBook] = useMutation(REMOVE_BOOK); // Mutation to remove a book

  const userData = data.me; // User data or empty object

  const handleDeleteBook = async (bookId: string) => {
    try {
      if (!data || !data.me) {
      return; 
    }
      await removeBook({
        variables: { bookId },
        update: cache => {
          // const data = cache.readQuery({ query: GET_ME }); // Read current cache
          // const userDataCache = userData?.me ;
          const updatedBooks = userData.savedBooks.filter(
            (book: any) => book.bookId !== bookId // Filter out deleted book
          );
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...userData, savedBooks: updatedBooks } }, // Write updated cache
          });
        },
      });
      removeBookId(bookId); // Remove book ID from local state (not shown)
    } catch (err) {
      console.error(err); // Log any errors
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>; // Show loading message
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: Book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
