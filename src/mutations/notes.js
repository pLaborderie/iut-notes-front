import gql from 'graphql-tag';

export const CREATE_NOTE = gql`
  mutation createNote($title: String!, $content: String!, $category: ID!) {
    addNote(title: $title, content: $content, category: $category) {
      id
    }
  }
`;