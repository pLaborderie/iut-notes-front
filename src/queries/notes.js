import gql from 'graphql-tag';

export const GET_NOTES = gql`
  query getAllNotes {
    notes {
      title
      category {
        name
        semester
      }
      author {
        name
      }
      createdAt
      updatedAt
    }
  }
`;