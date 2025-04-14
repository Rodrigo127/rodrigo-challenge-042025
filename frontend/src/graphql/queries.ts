import { gql } from '@apollo/client';

export const GET_COLUMNS = gql`
  query GetColumns {
    columns {
      id
      title
      cards
      order
    }
  }
`;

export const CREATE_COLUMN = gql`
  mutation CreateColumn($title: String!) {
    createColumn(title: $title) {
      id
      title
      cards
      order
    }
  }
`;

export const UPDATE_COLUMN_CARDS = gql`
  mutation updateColumnCards($id: String!, $cards: JSONString!, $order: String!) {
    updateColumnCards(id: $id, cards: $cards, order: $order) {
      column {
        id
        order
        title
        cards
      }
    }
  }
`;