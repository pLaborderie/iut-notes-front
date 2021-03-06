import gql from 'graphql-tag';

export const GET_NOTES = gql`
  query getAllNotes($offset: Int, $limit: Int, $semester: String, $category: ID, $title: String, $fromUser: Boolean) {
    notes(offset: $offset, limit: $limit, semester: $semester, category: $category, title: $title, fromUser: $fromUser) {
      count
      rows {
        id
        title
        category {
          name
          semester
        }
        author {
          name
          id
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_NOTE = gql`
  query getNote($id: ID!) {
    note(id: $id) {
      title
      content
      category {
        id
        semester
      }
    }
  }
`

export const GET_NOTE_PDF = gql`
  query getNotePdf($id: ID!) {
    notePdf(id: $id)
  }
`;