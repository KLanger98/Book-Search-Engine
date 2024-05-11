import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { getMe } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

//Import mutation for removing books 
import { useMutation, useQuery } from '@apollo/client'
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  const { loading, data } = useQuery(QUERY_ME);

  //Find current user
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    
    const user = data?.me || {};
    if (!loading && user) {
      setUserData(user);
    }
  }, [loading, data])

  // Delete book useMutation hook
  const [deleteBook, { error }] = useMutation(REMOVE_BOOK, {
    refetchQueries: [QUERY_ME],
  });

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId, userData) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      let userId = userData._id
      const { data } = await deleteBook({
        variables: { userId, bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId, userData)}
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
