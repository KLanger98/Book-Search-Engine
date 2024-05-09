import { gql } from '@apollo/client';

export const QUERY_SINGLE_USER = gql`
    query getUser{

    }
`;

export const QUERY_USERS = gql`
    query getUsers{
        users {

        }
    }
`;