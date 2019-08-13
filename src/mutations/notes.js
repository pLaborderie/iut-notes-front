import gql from 'graphql-tag';

export const CREATE_NOTE = gql`
  mutation createNote($title: String!, $content: String!, $category: ID!) {
    addNote(title: $title, content: $content, category: $category) {
      id
    }
  }
`;
export const DELETE_NOTE = gql`
  mutation deleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;
export const EDIT_NOTE = gql`
  mutation editNote($id: ID!, $title: String!, $content: String!, $category: ID!) {
    editNote(id: $id, title: $title, content: $content, category: $category)
  }
`;