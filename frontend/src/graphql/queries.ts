import { gql } from '@apollo/client';

export const GET_COLUMNS = gql`
  query GetColumns {
    columns {
      id
      title
      cards
      colIndex
    }
  }
`;

export const CREATE_COLUMN = gql`
  mutation CreateColumn($title: String!) {
    createColumn(title: $title) {
      column {
        id
        title
        cards
        colIndex
      }
    }
  }
`;

export const UPDATE_COLUMN_CARDS = gql`
  mutation updateColumnCards($id: String!, $cards: JSONString!, $colIndex: Int!, $title: String!) {
    updateColumnCards(id: $id, cards: $cards, colIndex: $colIndex, title: $title) {
      column {
        id
        colIndex
        title
        cards
      }
    }
  }
`;