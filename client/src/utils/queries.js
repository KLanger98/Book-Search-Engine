import { gql } from '@apollo/client';

export const QUERY_SINGLE_USER = gql`
    query getUser{
        user {
            username
            email
            savedBooks{
                title
                bookId
                description
                authors
                link
                image
            }
        }
    }
`;

export const QUERY_USERS = gql`
    query getUsers{
        users {
            username
            email
            savedBooks{
                title
                bookId
                description
                authors
                link
                image
            }
        }
    }
`;

export const QUERY_ME = gql`
    query me{
        me {
            _id
            username
            email
            savedBooks{
                title
                bookId
                description
                authors
                link
                image
            }
        }
    }
`